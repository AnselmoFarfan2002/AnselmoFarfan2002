import { VoicePreset, VoicePresetKey } from "../types";

export const VOICE_PRESETS: Partial<Record<VoicePresetKey, VoicePreset>> = {
  normal: {
    label: "Normal (No FX)",
    filterType: "allpass",
    filterFrequency: 1200,
    filterQ: 1,
    filterGain: 0,
    outputGain: 1,
    playbackRate: 1,
  },
  custom: {
    label: "Custom (Manual)",
    filterType: "allpass",
    filterFrequency: 1200,
    filterQ: 1,
    filterGain: 0,
    outputGain: 1,
    playbackRate: 1,
  },
  squirrel: {
    label: "Squirrel Voice",
    filterType: "allpass",
    filterFrequency: 1200,
    filterQ: 1,
    filterGain: 0,
    outputGain: 1,
    playbackRate: 1.4,
  },
  robot: {
    label: "Robot",
    filterType: "bandpass",
    filterFrequency: 780,
    filterQ: 10,
    filterGain: 10,
    outputGain: 0.95,
    playbackRate: 1,
  },
  telephone: {
    label: "Telephone",
    filterType: "bandpass",
    filterFrequency: 1500,
    filterQ: 3.2,
    filterGain: -2,
    outputGain: 1,
    playbackRate: 1,
  },
};
