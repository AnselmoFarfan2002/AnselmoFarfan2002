import { RefObject } from "react";

type Props = {
  previewAudioRef: RefObject<HTMLAudioElement | null>;
  src: string;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
};

export function NativePreviewSection({
  previewAudioRef,
  src,
  onPlay,
  onPause,
  onEnded,
}: Props) {
  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm uppercase tracking-[0.2em] text-white/70">
        Native Preview
      </p>
      <audio
        key={src}
        ref={previewAudioRef}
        controls
        src={src}
        className="w-full"
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
    </div>
  );
}
