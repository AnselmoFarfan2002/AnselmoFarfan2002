"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BAR_COUNT = 48;
const RECORDING_MIME = "audio/webm";

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function Page() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingAudioContextRef = useRef<AudioContext | null>(null);
  const recordingSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackAudioContextRef = useRef<AudioContext | null>(null);
  const playbackSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const playbackAnalyserRef = useRef<AnalyserNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState(0);

  const stopSpectrum = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const cleanupRecordingAudioContext = useCallback(() => {
    stopSpectrum();
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    recordingSourceRef.current?.disconnect();
    recordingSourceRef.current = null;

    void recordingAudioContextRef.current?.close();
    recordingAudioContextRef.current = null;
  }, [stopSpectrum]);

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

  const drawSpectrum = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

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
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setDurationMs(0);
      recordingStartedAtRef.current = performance.now();
      stopPlaybackSpectrum();
      previewAudioRef.current?.pause();
      cleanupPlaybackAudioContext();

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? RECORDING_MIME
        : "";

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || RECORDING_MIME,
        });

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Apagar el microfono al detener la grabacion.
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
    stopPlaybackSpectrum,
  ]);

  const startPlaybackSpectrum = useCallback(async () => {
    const audioElement = previewAudioRef.current;
    if (!audioElement) return;

    try {
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
  }, [drawSpectrum]);

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    )
      return;

    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isRecording) return;

    const intervalId = setInterval(() => {
      if (!recordingStartedAtRef.current) return;
      setDurationMs(performance.now() - recordingStartedAtRef.current);
    }, 120);

    return () => clearInterval(intervalId);
  }, [isRecording]);

  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      cleanupRecordingAudioContext();
      cleanupPlaybackAudioContext();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, [cleanupPlaybackAudioContext, cleanupRecordingAudioContext]);

  return (
    <>
      <h2 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight gradient md:text-3xl gradient">
        Audio Filters
      </h2>

      <p className="text-base leading-8 text-neutral-400">
        Graba audio y mira su espectro en tiempo real con Web Audio API.
      </p>

      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(56,189,248,0.12),rgba(2,6,23,0.8)_42%,rgba(16,185,129,0.1))] p-5 md:p-7 space-y-5 shadow-[0_24px_70px_-35px_rgba(56,189,248,0.5)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200/80">
              State
            </p>
            <p className="text-lg font-semibold">
              {isRecording ? "Recording..." : "Ready to Record"}
            </p>
          </div>

          <div className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-lg font-mono text-sky-100">
            {formatDuration(durationMs)}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-3">
          <canvas
            ref={canvasRef}
            width={760}
            height={170}
            className="h-42.5 w-full rounded-xl"
            aria-label="Visualizador de espectro de audio"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.15),transparent_55%)]" />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-2xl px-5 py-3 font-semibold text-slate-950 transition active:scale-[0.98] bg-[linear-gradient(120deg,#22d3ee,#a7f3d0)] hover:brightness-110"
          >
            {isRecording ? "Stop" : "Record"}
          </button>

          {audioUrl && (
            <a
              href={audioUrl}
              download="recording.webm"
              className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 font-medium hover:bg-white/10 transition"
            >
              Download
            </a>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2 text-red-200">
            {error}
          </p>
        )}

        {audioUrl && (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
              Preview
            </p>
            <audio
              ref={previewAudioRef}
              controls
              src={audioUrl}
              className="w-full"
              onPlay={startPlaybackSpectrum}
              onPause={stopPlaybackSpectrum}
              onEnded={stopPlaybackSpectrum}
            />
          </div>
        )}
      </section>
    </>
  );
}
