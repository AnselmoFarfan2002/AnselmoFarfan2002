import { ChangeEvent } from "react";
import { AudioSourceKind } from "../types";

type Props = {
  audioSource: AudioSourceKind;
  hasRecordedAudio: boolean;
  hasExternalAudio: boolean;
  onSourceChange: (value: AudioSourceKind) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function AudioSourceSection({
  audioSource,
  hasRecordedAudio,
  hasExternalAudio,
  onSourceChange,
  onUpload,
}: Props) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">
        Audio Source
      </p>
      <label className="flex flex-col gap-2 text-sm">
        <span>Load external audio</span>
        <input
          type="file"
          accept="audio/*"
          onChange={onUpload}
          className="rounded-lg bg-black/35 border border-white/15 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-1 file:text-slate-900"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span>Current source</span>
        <select
          className="rounded-lg bg-black/35 border border-white/15 px-3 py-2"
          value={audioSource}
          onChange={(event) =>
            onSourceChange(event.target.value as AudioSourceKind)
          }
        >
          <option value="recorded" disabled={!hasRecordedAudio}>
            Recording {!hasRecordedAudio ? "(none)" : ""}
          </option>
          <option value="external" disabled={!hasExternalAudio}>
            External File {!hasExternalAudio ? "(none)" : ""}
          </option>
        </select>
      </label>
    </div>
  );
}
