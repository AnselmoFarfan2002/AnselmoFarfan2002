import { ChangeEvent, FormEvent, useState } from "react";
import { AudioSourceKind } from "../types";

type Props = {
  audioSource: AudioSourceKind;
  hasRecordedAudio: boolean;
  hasExternalAudio: boolean;
  isLoadingExternalUrl: boolean;
  onSourceChange: (value: AudioSourceKind) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onLoadExternalUrl: (url: string) => void;
};

export function AudioSourceSection({
  audioSource,
  hasRecordedAudio,
  hasExternalAudio,
  isLoadingExternalUrl,
  onSourceChange,
  onUpload,
  onLoadExternalUrl,
}: Props) {
  const [externalUrlInput, setExternalUrlInput] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLoadExternalUrl(externalUrlInput);
  };

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
      <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
        <span>Load external audio from URL</span>
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://..."
            value={externalUrlInput}
            onChange={(event) => setExternalUrlInput(event.target.value)}
            className="w-full rounded-lg bg-black/35 border border-white/15 px-3 py-2"
          />
          <button
            type="submit"
            disabled={isLoadingExternalUrl}
            className="rounded-lg border border-white/15 bg-cyan-300 px-3 py-2 text-slate-900 disabled:opacity-60"
          >
            {isLoadingExternalUrl ? "Loading..." : "Load"}
          </button>
        </div>
      </form>
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
