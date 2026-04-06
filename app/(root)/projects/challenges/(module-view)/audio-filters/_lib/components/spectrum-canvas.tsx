import { RefObject } from "react";

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export function SpectrumCanvas({ canvasRef }: Props) {
  return (
    <div className="flex-1 relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-3">
      <canvas
        ref={canvasRef}
        width={760}
        height={170}
        className="h-10 w-full rounded-xl"
        aria-label="Visualizador de espectro de audio"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.15),transparent_55%)]" />
    </div>
  );
}
