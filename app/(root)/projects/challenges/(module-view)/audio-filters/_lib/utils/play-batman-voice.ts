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

async function renderAudioBlob(audioUrl: string): Promise<Blob> {
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`No se pudo descargar el audio (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const decodeContext = new window.AudioContext();
  const inputBuffer = await decodeContext.decodeAudioData(arrayBuffer);
  await decodeContext.close();

  const playbackRate = 1.06;
  const effectTailSeconds = 0.12;
  const renderedDurationSeconds =
    inputBuffer.duration / playbackRate + effectTailSeconds;
  const targetLength = Math.ceil(
    renderedDurationSeconds * inputBuffer.sampleRate,
  );

  const offline = new OfflineAudioContext(
    2,
    targetLength,
    inputBuffer.sampleRate,
  );

  // MAIN SOURCE
  const source = offline.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.value = playbackRate;
  source.detune.value = 110;

  // LIGHT "BREAK" LAYER
  const crackSource = offline.createBufferSource();
  crackSource.buffer = inputBuffer;
  crackSource.playbackRate.value = 1.075;
  crackSource.detune.value = 150;

  // MAIN EQ
  const highPass = offline.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 110;
  highPass.Q.value = 0.7;

  const lowShelf = offline.createBiquadFilter();
  lowShelf.type = "lowshelf";
  lowShelf.frequency.value = 180;
  lowShelf.gain.value = -2.5;

  const nasalBoost = offline.createBiquadFilter();
  nasalBoost.type = "peaking";
  nasalBoost.frequency.value = 1350;
  nasalBoost.Q.value = 1.0;
  nasalBoost.gain.value = 3.0;

  const biteBoost = offline.createBiquadFilter();
  biteBoost.type = "peaking";
  biteBoost.frequency.value = 2800;
  biteBoost.Q.value = 0.9;
  biteBoost.gain.value = 1.8;

  const softenTop = offline.createBiquadFilter();
  softenTop.type = "lowpass";
  softenTop.frequency.value = 6500;
  softenTop.Q.value = 0.7;

  // SATURATION
  const saturation = offline.createWaveShaper();
  saturation.curve = createDistortionCurve(4);
  saturation.oversample = "4x";

  // COMPRESSOR
  const compressor = offline.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.1;

  // GAINS
  const mainGain = offline.createGain();
  mainGain.gain.value = 0.92;

  const crackGain = offline.createGain();
  crackGain.gain.value = 0.09;

  const outputGain = offline.createGain();
  outputGain.gain.value = 1.0;

  // LIGHT INSTABILITY
  const crackOsc = offline.createOscillator();
  crackOsc.type = "sine";
  crackOsc.frequency.value = 8.5;

  const crackDepth = offline.createGain();
  crackDepth.gain.value = 8;

  // VERY SMALL SLAP
  const slapDelay = offline.createDelay(0.05);
  slapDelay.delayTime.value = 0.016;

  const slapGain = offline.createGain();
  slapGain.gain.value = 0.05;

  // MAIN CHAIN
  source.connect(highPass);
  highPass.connect(lowShelf);
  lowShelf.connect(nasalBoost);
  nasalBoost.connect(biteBoost);
  biteBoost.connect(softenTop);
  softenTop.connect(saturation);
  saturation.connect(mainGain);
  mainGain.connect(compressor);

  // CRACK CHAIN
  const crackHighPass = offline.createBiquadFilter();
  crackHighPass.type = "highpass";
  crackHighPass.frequency.value = 150;
  crackHighPass.Q.value = 0.7;

  const crackBand = offline.createBiquadFilter();
  crackBand.type = "bandpass";
  crackBand.frequency.value = 1800;
  crackBand.Q.value = 0.8;

  crackSource.connect(crackHighPass);
  crackHighPass.connect(crackBand);
  crackBand.connect(crackGain);
  crackGain.connect(compressor);

  // MODULATION
  crackOsc.connect(crackDepth);
  crackDepth.connect(crackSource.detune);

  // OUTPUT
  compressor.connect(outputGain);

  compressor.connect(slapDelay);
  slapDelay.connect(slapGain);
  slapGain.connect(outputGain);

  outputGain.connect(offline.destination);

  crackOsc.start(0);
  source.start(0);
  crackSource.start(0);

  const renderedBuffer = await offline.startRendering();
  return encodeWav(renderedBuffer);
}

export async function playBatmanVoice(
  audioUrl: string,
  autoPlay: true,
): Promise<void>;
export async function playBatmanVoice(
  audioUrl: string,
  autoPlay: false,
): Promise<HTMLAudioElement>;
export async function playBatmanVoice(
  audioUrl: string,
  autoPlay = true,
): Promise<void | HTMLAudioElement> {
  const blob = await renderAudioBlob(audioUrl);
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
