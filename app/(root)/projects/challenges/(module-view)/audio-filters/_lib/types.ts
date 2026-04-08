export type VoicePresetKey =
  | "normal"
  | "custom"
  | "squirrel"
  | "batman"
  | "robot"
  | "telephone"
  | "alien";

export type VoicePreset = {
  label: string;
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ: number;
  filterGain: number;
  outputGain: number;
  playbackRate: number;
};

export type AudioSourceKind = "recorded" | "external";
