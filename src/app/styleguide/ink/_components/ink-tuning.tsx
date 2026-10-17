"use client";

import * as React from "react";

import { Halftone } from "@/components/effects/halftone";
import type { InkFieldPalette } from "@/components/effects/ink-field";
import { InkField } from "@/components/effects/ink-field";
import { Button } from "@/components/ui/button";

function useFps(): number {
  const [fps, setFps] = React.useState(0);

  React.useEffect(() => {
    let frames = 0;
    let lastSample = performance.now();
    let raf = 0;

    const loop = (): void => {
      frames += 1;
      const now = performance.now();
      if (now - lastSample >= 500) {
        setFps(Math.round((frames * 1000) / (now - lastSample)));
        frames = 0;
        lastSample = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return fps;
}

function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-label text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-accent"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-label text-muted-foreground">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-accent"
      />
    </label>
  );
}

function InkStage({ title, children }: { title: string; children: React.ReactNode }) {
  const fps = useFps();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-label text-muted-foreground">{title}</p>
        <p className="text-label text-muted-foreground">{fps} fps</p>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-card bg-surface-muted">
        {children}
      </div>
    </div>
  );
}

export function InkTuning() {
  const [intensity, setIntensity] = React.useState(1);
  const [dissipation, setDissipation] = React.useState(0.22);
  const [dotSize, setDotSize] = React.useState(11);
  const [pressureIterations, setPressureIterations] = React.useState(20);
  const [halftone, setHalftone] = React.useState(true);
  const [chromatic, setChromatic] = React.useState(true);
  const [idleDrift, setIdleDrift] = React.useState(false);
  const [palette, setPalette] = React.useState<InkFieldPalette>("accent");
  const [reducedMotionPreview, setReducedMotionPreview] = React.useState(false);
  const [mounted, setMounted] = React.useState(true);
  const [mountKey, setMountKey] = React.useState(0);
  const [mountCount, setMountCount] = React.useState(0);

  const toggleMounted = (): void => {
    setMounted((prev) => {
      const next = !prev;
      if (next) {
        setMountKey((key) => key + 1);
        setMountCount((count) => count + 1);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12 py-12">
      <section className="space-y-6">
        <h2 className="text-heading">Primary — live controls</h2>
        <InkStage title={`Primary instance (mounts: ${mountCount})`}>
          {/* Text renders first so the ink canvas paints above it — mix-blend-mode needs
              the text as backdrop to recolor it (DESIGN_SPEC §5 Hero). */}
          <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-display-md">
            Creative development
          </p>
          {reducedMotionPreview ? (
            <Halftone />
          ) : mounted ? (
            <InkField
              key={mountKey}
              className="size-full"
              palette={palette}
              intensity={intensity}
              dissipation={dissipation}
              dotSize={dotSize}
              pressureIterations={pressureIterations}
              halftone={halftone}
              chromatic={chromatic}
              idleDrift={idleDrift}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-label text-muted-foreground">
              Unmounted
            </div>
          )}
        </InkStage>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <SliderField
            label="Intensity"
            value={intensity}
            onChange={setIntensity}
            min={0.2}
            max={3}
            step={0.1}
          />
          <SliderField
            label="Dissipation (lower = fades faster)"
            value={dissipation}
            onChange={setDissipation}
            min={0.03}
            max={0.4}
            step={0.01}
          />
          <SliderField
            label="Dot size (px)"
            value={dotSize}
            onChange={setDotSize}
            min={2}
            max={16}
            step={1}
          />
          <SliderField
            label="Pressure iterations"
            value={pressureIterations}
            onChange={setPressureIterations}
            min={4}
            max={40}
            step={1}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ToggleField label="Halftone" checked={halftone} onChange={setHalftone} />
          <ToggleField label="Chromatic" checked={chromatic} onChange={setChromatic} />
          <ToggleField label="Idle drift" checked={idleDrift} onChange={setIdleDrift} />
          <ToggleField
            label="Reduced motion preview"
            checked={reducedMotionPreview}
            onChange={setReducedMotionPreview}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-label text-muted-foreground">
            Palette
            <select
              value={typeof palette === "string" ? palette : "accent"}
              onChange={(event) => setPalette(event.target.value as InkFieldPalette)}
              className="rounded-input border border-border bg-background px-2 py-1 text-foreground"
            >
              <option value="accent">accent</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <Button variant="outline" size="sm" onClick={toggleMounted}>
            {mounted ? "Unmount" : "Mount"}
          </Button>
        </div>
        <p className="text-body text-muted-foreground">
          For heap-snapshot leak testing: click Unmount/Mount ~10x, then take two Memory panel
          snapshots and diff for retained <code>WebGLRenderer</code>/canvas instances.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-heading">Multi-instance — three contexts at once</h2>
        <p className="text-body text-muted-foreground">
          Each instance owns its own WebGL context, paused independently via IntersectionObserver —
          proves instances don&rsquo;t conflict without a shared-context architecture.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InkStage title="Light panel (accent)">
            <InkField className="size-full" palette="accent" idleDrift />
          </InkStage>
          <InkStage title="Inverse panel (dark)">
            <div className="absolute inset-0 bg-surface-inverse">
              <InkField className="size-full" palette="dark" idleDrift />
            </div>
          </InkStage>
        </div>
      </section>
    </div>
  );
}
