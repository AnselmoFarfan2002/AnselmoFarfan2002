import { VOICE_PRESETS } from "../presets";
import { VoicePresetKey } from "../types";

type Props = {
  voicePreset: VoicePresetKey;
  filterType: BiquadFilterType;
  filterFrequency: number;
  filterQ: number;
  filterGain: number;
  outputGain: number;
  playbackRate: number;
  onApplyPreset: (preset: VoicePresetKey) => void;
  onSetCustom: () => void;
  onFilterTypeChange: (value: BiquadFilterType) => void;
  onFilterFrequencyChange: (value: number) => void;
  onFilterQChange: (value: number) => void;
  onFilterGainChange: (value: number) => void;
  onOutputGainChange: (value: number) => void;
  onPlaybackRateChange: (value: number) => void;
  onPlayFiltered: () => void;
  onStopFiltered: () => void;
};

export function FilterControlsSection({
  voicePreset,
  filterType,
  filterFrequency,
  filterQ,
  filterGain,
  outputGain,
  playbackRate,
  onApplyPreset,
  onSetCustom,
  onFilterTypeChange,
  onFilterFrequencyChange,
  onFilterQChange,
  onFilterGainChange,
  onOutputGainChange,
  onPlaybackRateChange,
  onPlayFiltered,
  onStopFiltered,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">
        Web Audio Playback Filters
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Voice Preset</span>
          <select
            className="rounded-lg bg-black/35 border border-white/15 px-3 py-2"
            value={voicePreset}
            onChange={(event) => onApplyPreset(event.target.value as VoicePresetKey)}
          >
            {(Object.keys(VOICE_PRESETS) as VoicePresetKey[]).map((key) => (
              <option key={key} value={key}>
                {VOICE_PRESETS[key].label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Filter Type</span>
          <select
            className="rounded-lg bg-black/35 border border-white/15 px-3 py-2"
            value={filterType}
            onChange={(event) => {
              onSetCustom();
              onFilterTypeChange(event.target.value as BiquadFilterType);
            }}
          >
            <option value="lowpass">lowpass</option>
            <option value="highpass">highpass</option>
            <option value="bandpass">bandpass</option>
            <option value="lowshelf">lowshelf</option>
            <option value="highshelf">highshelf</option>
            <option value="peaking">peaking</option>
            <option value="notch">notch</option>
            <option value="allpass">allpass</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Frequency: {Math.round(filterFrequency)} Hz</span>
          <input
            type="range"
            min={40}
            max={12000}
            step={1}
            value={filterFrequency}
            onChange={(event) => {
              onSetCustom();
              onFilterFrequencyChange(Number(event.target.value));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Q: {filterQ.toFixed(2)}</span>
          <input
            type="range"
            min={0.01}
            max={25}
            step={0.01}
            value={filterQ}
            onChange={(event) => {
              onSetCustom();
              onFilterQChange(Number(event.target.value));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span>Filter Gain: {filterGain.toFixed(1)} dB</span>
          <input
            type="range"
            min={-30}
            max={30}
            step={0.1}
            value={filterGain}
            onChange={(event) => {
              onSetCustom();
              onFilterGainChange(Number(event.target.value));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Output Volume: {outputGain.toFixed(2)}x</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={outputGain}
            onChange={(event) => {
              onSetCustom();
              onOutputGainChange(Number(event.target.value));
            }}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span>Playback Speed: {playbackRate.toFixed(2)}x</span>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.01}
            value={playbackRate}
            onChange={(event) => {
              onSetCustom();
              onPlaybackRateChange(Number(event.target.value));
            }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPlayFiltered}
          className="rounded-xl px-4 py-2 font-semibold text-slate-950 bg-[linear-gradient(120deg,#67e8f9,#34d399)] hover:brightness-110 transition"
        >
          Play with Filters
        </button>
        <button
          type="button"
          onClick={onStopFiltered}
          className="rounded-xl px-4 py-2 font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
        >
          Stop Filtered Playback
        </button>
      </div>
    </div>
  );
}
