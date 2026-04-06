import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { VOICE_PRESETS } from "../presets";
import { AudioSourceKind, VoicePresetKey } from "../types";

const BAR_COUNT = 48;
const RECORDING_MIME = "audio/webm";

export function useAudioFilters() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const externalAudioBlobRef = useRef<Blob | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const recordingAudioContextRef = useRef<AudioContext | null>(null);
  const recordingSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const playbackAudioContextRef = useRef<AudioContext | null>(null);
  const playbackSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const playbackAnalyserRef = useRef<AnalyserNode | null>(null);

  const filteredAudioContextRef = useRef<AudioContext | null>(null);
  const filteredSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filteredAnalyserRef = useRef<AnalyserNode | null>(null);
  const decodedBufferRef = useRef<AudioBuffer | null>(null);
  const decodedBlobRef = useRef<Blob | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const outputGainRef = useRef<GainNode | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const externalAudioUrlRef = useRef<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isFilteredPlaying, setIsFilteredPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [externalAudioUrl, setExternalAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);
  const [audioSource, setAudioSource] = useState<AudioSourceKind>("recorded");

  const [filterType, setFilterType] = useState<BiquadFilterType>("allpass");
  const [filterFrequency, setFilterFrequency] = useState(1200);
  const [filterQ, setFilterQ] = useState(1);
  const [filterGain, setFilterGain] = useState(0);
  const [outputGain, setOutputGain] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [voicePreset, setVoicePreset] = useState<VoicePresetKey>("normal");

  const selectedAudioUrl =
    audioSource === "external" ? externalAudioUrl : audioUrl;

  const stopSpectrum = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const drawSpectrum = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    stopSpectrum();

    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      analyser.getByteFrequencyData(data);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(10, 12, 20, 0.85)";
      context.fillRect(0, 0, width, height);

      const barGap = 4;
      const totalGaps = (BAR_COUNT - 1) * barGap;
      const barWidth = (width - totalGaps) / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * data.length);
        const amplitude = data[dataIndex] / 255;
        const barHeight = Math.max(5, amplitude * (height - 24));
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        const hue = 190 - i * 1.7;
        context.fillStyle = `hsl(${hue}, 90%, ${45 + amplitude * 20}%)`;
        context.fillRect(x, y, barWidth, barHeight);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  }, [stopSpectrum]);

  const cleanupRecordingAudioContext = useCallback(() => {
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    recordingSourceRef.current?.disconnect();
    recordingSourceRef.current = null;
    void recordingAudioContextRef.current?.close();
    recordingAudioContextRef.current = null;
  }, []);

  const stopPlaybackSpectrum = useCallback(() => {
    stopSpectrum();
    analyserRef.current = null;
    void playbackAudioContextRef.current?.suspend();
  }, [stopSpectrum]);

  const cleanupPlaybackAudioContext = useCallback(() => {
    stopPlaybackSpectrum();
    playbackSourceRef.current?.disconnect();
    playbackAnalyserRef.current?.disconnect();
    playbackSourceRef.current = null;
    playbackAnalyserRef.current = null;
    void playbackAudioContextRef.current?.close();
    playbackAudioContextRef.current = null;
  }, [stopPlaybackSpectrum]);

  const stopFilteredPlayback = useCallback(() => {
    stopSpectrum();
    analyserRef.current = null;

    if (filteredSourceRef.current) {
      try {
        filteredSourceRef.current.stop();
      } catch {}
      filteredSourceRef.current.disconnect();
      filteredSourceRef.current = null;
    }

    void filteredAudioContextRef.current?.suspend();
    setIsFilteredPlaying(false);
  }, [stopSpectrum]);

  const cleanupFilteredAudio = useCallback(() => {
    stopFilteredPlayback();
    filterNodeRef.current?.disconnect();
    outputGainRef.current?.disconnect();
    filteredAnalyserRef.current?.disconnect();

    filterNodeRef.current = null;
    outputGainRef.current = null;
    filteredAnalyserRef.current = null;

    void filteredAudioContextRef.current?.close();
    filteredAudioContextRef.current = null;
  }, [stopFilteredPlayback]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setDurationMs(0);
      recordingStartedAtRef.current = performance.now();
      stopPlaybackSpectrum();
      stopFilteredPlayback();
      previewAudioRef.current?.pause();
      cleanupPlaybackAudioContext();

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      audioBlobRef.current = null;
      decodedBufferRef.current = null;
      decodedBlobRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported(RECORDING_MIME)
        ? RECORDING_MIME
        : "";
      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || RECORDING_MIME,
        });
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioSource("recorded");
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        cleanupRecordingAudioContext();
      };

      const audioContext = new window.AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNode.connect(analyser);

      recordingAudioContextRef.current = audioContext;
      recordingSourceRef.current = sourceNode;
      analyserRef.current = analyser;
      drawSpectrum();

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("No se pudo acceder al micrófono");
      cleanupRecordingAudioContext();
      console.error(err);
    }
  }, [
    audioUrl,
    cleanupPlaybackAudioContext,
    cleanupRecordingAudioContext,
    drawSpectrum,
    stopFilteredPlayback,
    stopPlaybackSpectrum,
  ]);

  const stopRecording = useCallback(() => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    ) {
      return;
    }
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }, []);

  const startPlaybackSpectrum = useCallback(async () => {
    const audioElement = previewAudioRef.current;
    if (!audioElement) return;

    try {
      stopFilteredPlayback();

      if (!playbackAudioContextRef.current) {
        const playbackContext = new window.AudioContext();
        const playbackAnalyser = playbackContext.createAnalyser();
        playbackAnalyser.fftSize = 2048;
        playbackAnalyser.smoothingTimeConstant = 0.85;

        const playbackSource =
          playbackContext.createMediaElementSource(audioElement);
        playbackSource.connect(playbackAnalyser);
        playbackAnalyser.connect(playbackContext.destination);

        playbackAudioContextRef.current = playbackContext;
        playbackSourceRef.current = playbackSource;
        playbackAnalyserRef.current = playbackAnalyser;
      }

      if (playbackAudioContextRef.current.state === "suspended") {
        await playbackAudioContextRef.current.resume();
      }

      analyserRef.current = playbackAnalyserRef.current;
      drawSpectrum();
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar el visualizador durante la reproducción");
    }
  }, [drawSpectrum, stopFilteredPlayback]);

  const startFilteredPlayback = useCallback(async () => {
    const sourceBlob =
      audioSource === "external"
        ? externalAudioBlobRef.current
        : audioBlobRef.current;
    if (!sourceBlob) {
      setError("No hay audio disponible en la fuente seleccionada");
      return;
    }

    try {
      setError(null);
      stopPlaybackSpectrum();
      previewAudioRef.current?.pause();

      if (!filteredAudioContextRef.current) {
        filteredAudioContextRef.current = new window.AudioContext();
      }
      const context = filteredAudioContextRef.current;

      if (context.state === "suspended") await context.resume();

      if (!decodedBufferRef.current || decodedBlobRef.current !== sourceBlob) {
        const rawBuffer = await sourceBlob.arrayBuffer();
        decodedBufferRef.current = await context.decodeAudioData(rawBuffer);
        decodedBlobRef.current = sourceBlob;
      }

      if (
        !filterNodeRef.current ||
        !outputGainRef.current ||
        !filteredAnalyserRef.current
      ) {
        const filterNode = context.createBiquadFilter();
        const gainNode = context.createGain();
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.85;

        filterNode.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(context.destination);

        filterNodeRef.current = filterNode;
        outputGainRef.current = gainNode;
        filteredAnalyserRef.current = analyser;
      }

      if (filteredSourceRef.current) {
        try {
          filteredSourceRef.current.stop();
        } catch {}
        filteredSourceRef.current.disconnect();
      }

      const source = context.createBufferSource();
      source.buffer = decodedBufferRef.current;
      source.connect(filterNodeRef.current);
      source.onended = () => {
        setIsFilteredPlaying(false);
        stopSpectrum();
        analyserRef.current = null;
      };
      filteredSourceRef.current = source;

      filterNodeRef.current.type = filterType;
      filterNodeRef.current.frequency.value = filterFrequency;
      filterNodeRef.current.Q.value = filterQ;
      filterNodeRef.current.gain.value = filterGain;
      outputGainRef.current.gain.value = outputGain;
      source.playbackRate.value = playbackRate;

      analyserRef.current = filteredAnalyserRef.current;
      drawSpectrum();

      source.start(0);
      setIsFilteredPlaying(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo reproducir el audio con filtros");
      stopFilteredPlayback();
    }
  }, [
    drawSpectrum,
    filterFrequency,
    filterGain,
    filterQ,
    filterType,
    outputGain,
    playbackRate,
    audioSource,
    stopFilteredPlayback,
    stopPlaybackSpectrum,
    stopSpectrum,
  ]);

  const applyPreset = useCallback((presetKey: VoicePresetKey) => {
    const preset = VOICE_PRESETS[presetKey];
    setVoicePreset(presetKey);
    setFilterType(preset.filterType);
    setFilterFrequency(preset.filterFrequency);
    setFilterQ(preset.filterQ);
    setFilterGain(preset.filterGain);
    setOutputGain(preset.outputGain);
    setPlaybackRate(preset.playbackRate);
  }, []);

  const handleExternalAudioUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("audio/")) {
        setError("Selecciona un archivo de audio válido");
        return;
      }

      setError(null);
      stopPlaybackSpectrum();
      stopFilteredPlayback();
      previewAudioRef.current?.pause();
      cleanupPlaybackAudioContext();

      if (externalAudioUrlRef.current) {
        URL.revokeObjectURL(externalAudioUrlRef.current);
      }

      externalAudioBlobRef.current = file;
      decodedBufferRef.current = null;
      decodedBlobRef.current = null;

      const url = URL.createObjectURL(file);
      setExternalAudioUrl(url);
      setAudioSource("external");
      event.currentTarget.value = "";
    },
    [cleanupPlaybackAudioContext, stopFilteredPlayback, stopPlaybackSpectrum],
  );

  useEffect(() => {
    if (!isRecording) return;
    const intervalId = setInterval(() => {
      if (!recordingStartedAtRef.current) return;
      setDurationMs(performance.now() - recordingStartedAtRef.current);
    }, 120);
    return () => clearInterval(intervalId);
  }, [isRecording]);

  useEffect(() => {
    if (!filterNodeRef.current || !outputGainRef.current) return;
    filterNodeRef.current.type = filterType;
    filterNodeRef.current.frequency.value = filterFrequency;
    filterNodeRef.current.Q.value = filterQ;
    filterNodeRef.current.gain.value = filterGain;
    outputGainRef.current.gain.value = outputGain;
    if (filteredSourceRef.current) {
      filteredSourceRef.current.playbackRate.value = playbackRate;
    }
  }, [
    filterFrequency,
    filterGain,
    filterQ,
    filterType,
    outputGain,
    playbackRate,
  ]);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  useEffect(() => {
    externalAudioUrlRef.current = externalAudioUrl;
  }, [externalAudioUrl]);

  useEffect(() => {
    return () => {
      cleanupRecordingAudioContext();
      cleanupPlaybackAudioContext();
      cleanupFilteredAudio();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (externalAudioUrlRef.current) {
        URL.revokeObjectURL(externalAudioUrlRef.current);
      }
    };
  }, [
    cleanupFilteredAudio,
    cleanupPlaybackAudioContext,
    cleanupRecordingAudioContext,
  ]);

  return {
    previewAudioRef,
    canvasRef,
    isRecording,
    isFilteredPlaying,
    audioUrl,
    externalAudioUrl,
    selectedAudioUrl,
    error,
    durationMs,
    audioSource,
    filterType,
    filterFrequency,
    filterQ,
    filterGain,
    outputGain,
    playbackRate,
    voicePreset,
    startRecording,
    stopRecording,
    startFilteredPlayback,
    stopFilteredPlayback,
    startPlaybackSpectrum,
    stopPlaybackSpectrum,
    applyPreset,
    handleExternalAudioUpload,
    setAudioSource,
    setVoicePreset,
    setFilterType,
    setFilterFrequency,
    setFilterQ,
    setFilterGain,
    setOutputGain,
    setPlaybackRate,
  };
}
