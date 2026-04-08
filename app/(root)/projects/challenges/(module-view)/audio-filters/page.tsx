"use client";

import { formatDuration } from "./_lib/utils/format-duration";
import { AudioSourceSection } from "./_lib/components/audio-source-section";
import { FilterControlsSection } from "./_lib/components/filter-controls-section";
import { NativePreviewSection } from "./_lib/components/native-preview-section";
import { SpectrumCanvas } from "./_lib/components/spectrum-canvas";
import { useAudioFilters } from "./_lib/hooks/use-audio-filters";
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";

export default function Page() {
  const audio = useAudioFilters();

  return (
    <>
      <h2 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight gradient md:text-3xl gradient">
        Audio Filters
      </h2>

      <p className="text-base leading-8 text-neutral-400">
        Graba audio y procesa su reproducción con filtros de Web Audio API.
      </p>

      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(56,189,248,0.12),rgba(2,6,23,0.8)_42%,rgba(16,185,129,0.1))] p-5 md:p-7 space-y-5 shadow-[0_24px_70px_-35px_rgba(56,189,248,0.5)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-sky-200/80">
              State
            </p>
            <p className="text-lg font-semibold">
              {audio.isRecording
                ? "Recording..."
                : audio.isFilteredPlaying
                  ? "Playing with Web Audio filters..."
                  : "Ready to Record"}
            </p>
          </div>

          <div className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-lg font-mono text-sky-100">
            {formatDuration(audio.durationMs)}
          </div>
        </div>

        <div className="flex items-center">
          <SpectrumCanvas canvasRef={audio.canvasRef} />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={
                audio.isRecording ? audio.stopRecording : audio.startRecording
              }
              className="rounded-2xl shrink-0 h-12 flex items-center justify-center aspect-square font-semibold text-slate-950 transition active:scale-[0.98] bg-[linear-gradient(120deg,#22d3ee,#a7f3d0)] hover:brightness-110 cursor-pointer"
            >
              {audio.isRecording ? (
                <FaRegStopCircle size={24} />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>
          </div>
        </div>

        <AudioSourceSection
          audioSource={audio.audioSource}
          hasRecordedAudio={Boolean(audio.audioUrl)}
          hasExternalAudio={Boolean(audio.externalAudioUrl)}
          isLoadingExternalUrl={audio.isLoadingExternalUrl}
          onSourceChange={audio.setAudioSource}
          onUpload={audio.handleExternalAudioUpload}
          onLoadExternalUrl={audio.handleExternalAudioUrlLoad}
        />

        {audio.selectedAudioUrl && (
          <FilterControlsSection
            voicePreset={audio.voicePreset}
            onApplyPreset={audio.applyPreset}
            onPlayFiltered={audio.startFilteredPlayback}
            onDownloadFiltered={audio.downloadFilteredAudio}
          />
        )}

        {audio.error && (
          <p className="rounded-xl border border-red-300/40 bg-red-500/10 px-4 py-2 text-red-200">
            {audio.error}
          </p>
        )}

        {audio.selectedAudioUrl && (
          <NativePreviewSection
            previewAudioRef={audio.previewAudioRef}
            src={audio.selectedAudioUrl}
            onPlay={audio.startPlaybackSpectrum}
            onPause={audio.stopPlaybackSpectrum}
            onEnded={audio.stopPlaybackSpectrum}
          />
        )}
      </section>
    </>
  );
}
