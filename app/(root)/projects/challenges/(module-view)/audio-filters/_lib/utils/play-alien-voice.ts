function createDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const k = Math.max(0, amount);
  const samples = 44_100;
  const buffer = new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT);
  const curve = new Float32Array(buffer);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }

  return curve;
}

function createImpulseResponse(
  context: BaseAudioContext,
  seconds: number,
  decay: number,
): AudioBuffer {
  const length = Math.floor(context.sampleRate * seconds);
  const impulse = context.createBuffer(2, length, context.sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
  }

  return impulse;
}

function encodeWav(audioBuffer: AudioBuffer): Blob {
  const channelCount = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const frameCount = audioBuffer.length;
  const blockAlign = channelCount * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = frameCount * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  let offset = 0;
  const writeString = (text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset++, text.charCodeAt(i));
    }
  };

  writeString("RIFF");
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString("WAVE");
  writeString("fmt ");
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, channelCount, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, byteRate, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, bitDepth, true);
  offset += 2;
  writeString("data");
  view.setUint32(offset, dataSize, true);
  offset += 4;

  const channels = Array.from({ length: channelCount }, (_, i) =>
    audioBuffer.getChannelData(i),
  );

  for (let i = 0; i < frameCount; i++) {
    for (let channel = 0; channel < channelCount; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

async function renderAlienBlob(audioUrl: string): Promise<Blob> {
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`No se pudo descargar el audio (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const decodeContext = new window.AudioContext();
  const inputBuffer = await decodeContext.decodeAudioData(arrayBuffer);
  await decodeContext.close();

  const playbackRate = 1;
  const effectTailSeconds = 0.4;
  const renderedDurationSeconds = inputBuffer.duration / playbackRate + effectTailSeconds;
  const targetLength = Math.ceil(renderedDurationSeconds * inputBuffer.sampleRate);
  const offline = new OfflineAudioContext(
    inputBuffer.numberOfChannels,
    targetLength,
    inputBuffer.sampleRate,
  );

  const source = offline.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.value = playbackRate;
  source.detune.value = 20;

  const highPass = offline.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 90;
  highPass.Q.value = 0.7;

  const bandPass = offline.createBiquadFilter();
  bandPass.type = "bandpass";
  bandPass.frequency.value = 1550;
  bandPass.Q.value = 1.5;

  const distortion = offline.createWaveShaper();
  distortion.curve = createDistortionCurve(85);
  distortion.oversample = "4x";

  const ringModGain = offline.createGain();
  ringModGain.gain.value = 0;

  const lfo = offline.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 38;
  const lfoDepth = offline.createGain();
  lfoDepth.gain.value = 0.8;

  const compressor = offline.createDynamicsCompressor();
  compressor.threshold.value = -22;
  compressor.knee.value = 20;
  compressor.ratio.value = 4.2;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.22;

  const dryGain = offline.createGain();
  dryGain.gain.value = 0.76;

  const wetGain = offline.createGain();
  wetGain.gain.value = 0.34;

  const delay = offline.createDelay(0.4);
  delay.delayTime.value = 0.045;

  const feedback = offline.createGain();
  feedback.gain.value = 0.26;

  const convolver = offline.createConvolver();
  convolver.buffer = createImpulseResponse(offline, 1.6, 2.4);

  const outputGain = offline.createGain();
  outputGain.gain.value = 1.18;

  source.connect(highPass);
  highPass.connect(bandPass);
  bandPass.connect(distortion);
  distortion.connect(ringModGain);
  ringModGain.connect(compressor);

  lfo.connect(lfoDepth);
  lfoDepth.connect(ringModGain.gain);

  compressor.connect(dryGain);
  dryGain.connect(outputGain);

  compressor.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(convolver);
  convolver.connect(wetGain);
  wetGain.connect(outputGain);
  outputGain.connect(offline.destination);

  lfo.start(0);
  source.start(0);

  const renderedBuffer = await offline.startRendering();
  return encodeWav(renderedBuffer);
}

export async function playAlienVoiceFromUrl(
  audioUrl: string,
  autoPlay: true,
): Promise<void>;
export async function playAlienVoiceFromUrl(
  audioUrl: string,
  autoPlay: false,
): Promise<HTMLAudioElement>;
export async function playAlienVoiceFromUrl(
  audioUrl: string,
  autoPlay = true,
): Promise<void | HTMLAudioElement> {
  const blob = await renderAlienBlob(audioUrl);
  const blobUrl = URL.createObjectURL(blob);
  const audio = new Audio(blobUrl);
  audio.preload = "auto";

  if (!autoPlay) {
    return audio;
  }

  await audio.play();
  await new Promise<void>((resolve) => {
    audio.onended = () => {
      URL.revokeObjectURL(blobUrl);
      resolve();
    };
  });
}
