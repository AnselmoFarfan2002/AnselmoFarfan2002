import { VOICE_PRESETS } from "../utils/presets";
import { VoicePresetKey } from "../types";

type Props = {
  voicePreset: VoicePresetKey;
  onApplyPreset: (preset: VoicePresetKey) => void;
  onPlayFiltered: () => void;
  onDownloadFiltered: () => void;
};

export function FilterControlsSection({
  voicePreset,
  onApplyPreset,
  onPlayFiltered,
  onDownloadFiltered,
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
            onChange={(event) =>
              onApplyPreset(event.target.value as VoicePresetKey)
            }
          >
            {[
              {
                label: "Alien",
                key: "alien",
              },
              {
                label: "Normal",
                key: "normal",
              },
              {
                label: "Batman",
                key: "batman",
              },
              {
                label: "Squirrel",
                key: "squirrel",
              },
            ].map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
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
          onClick={onDownloadFiltered}
          className="rounded-xl px-4 py-2 font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
        >
          Download Filtered Audio
        </button>
      </div>
    </div>
  );
}
