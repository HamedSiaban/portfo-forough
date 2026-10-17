import * as THREE from "three";

import { glowFragmentShader, TRAIL_LENGTH, vertexShader } from "./shaders";

type WaveRendererOptions = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  dotSize?: number;
  halftone?: boolean;
  chromatic?: boolean;
  tint?: [number, number, number];
};

type WaveRendererTunables = Required<
  Pick<WaveRendererOptions, "dotSize" | "halftone" | "chromatic" | "tint">
>;

const CHROMATIC_OFFSET_PX = 2.5;
// Below this the glow is invisible; skip drawing entirely instead of running the shader.
const MIN_VISIBLE_STRENGTH = 0.002;

const DEFAULTS: WaveRendererTunables = {
  dotSize: 11,
  halftone: true,
  chromatic: true,
  tint: [1, 0.24, 0.44],
};

type GlowUniforms = {
  resolution: { value: THREE.Vector2 };
  trail: { value: THREE.Vector4[] };
  tint: { value: THREE.Vector3 };
  dotSize: { value: number };
  halftoneEnabled: { value: boolean };
  chromaticEnabled: { value: boolean };
  chromaticOffset: { value: number };
};

/**
 * Vanilla (non-React) glow renderer: one fullscreen shader pass per frame, drawn at the point
 * and radius the caller passes in. Holds no per-frame state. React lifecycle, pointer tracking
 * and the speed-to-size mapping live in wave-field-canvas.tsx.
 */
class WaveRenderer {
  readonly canvas: HTMLCanvasElement;
  options: WaveRendererTunables;
  contextLost = false;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private quad: THREE.Mesh;
  private material: THREE.ShaderMaterial & { uniforms: GlowUniforms };

  private width: number;
  private height: number;
  private dpr: number;
  private cleared = false;

  private handleContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
  };

  private handleContextRestored = (): void => {
    this.contextLost = false;
    this.cleared = false;
  };

  constructor(opts: WaveRendererOptions) {
    this.canvas = opts.canvas;
    this.width = opts.width;
    this.height = opts.height;
    this.dpr = opts.dpr;
    this.options = {
      dotSize: opts.dotSize ?? DEFAULTS.dotSize,
      halftone: opts.halftone ?? DEFAULTS.halftone,
      chromatic: opts.chromatic ?? DEFAULTS.chromatic,
      tint: opts.tint ?? DEFAULTS.tint,
    };

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.width, this.height, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.scene.add(this.quad);

    const uniforms: GlowUniforms = {
      resolution: { value: new THREE.Vector2() },
      trail: { value: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector4()) },
      tint: { value: new THREE.Vector3(...this.options.tint) },
      dotSize: { value: this.options.dotSize },
      halftoneEnabled: { value: this.options.halftone },
      chromaticEnabled: { value: this.options.chromatic },
      chromaticOffset: { value: CHROMATIC_OFFSET_PX },
    };
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: glowFragmentShader,
      uniforms,
      // Straight alpha written as-is; three's default blend would premultiply and darken edges.
      blending: THREE.NoBlending,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }) as WaveRenderer["material"];
    this.quad.material = this.material;

    this.canvas.addEventListener("webglcontextlost", this.handleContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored);
  }

  setOptions(partial: Partial<WaveRendererTunables>): void {
    // Filter out `undefined` entries so unset React props don't clobber existing tunables.
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, value]) => value !== undefined),
    );
    this.options = { ...this.options, ...defined };
  }

  resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.cleared = false;
  }

  /**
   * `points` is TRAIL_LENGTH × [x, y, radius, strength], head first. x/y/radius in CSS px from
   * the canvas top-left; strength 0..1.
   */
  draw(points: Float32Array): void {
    if (this.contextLost) return;

    if ((points[3] ?? 0) < MIN_VISIBLE_STRENGTH) {
      if (!this.cleared) {
        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.cleared = true;
      }
      return;
    }
    this.cleared = false;

    const { uniforms } = this.material;
    const [r, g, b] = this.options.tint;
    uniforms.resolution.value.set(this.width * this.dpr, this.height * this.dpr);
    uniforms.trail.value.forEach((v, i) => {
      const o = i * 4;
      v.set(
        (points[o] ?? 0) * this.dpr,
        (this.height - (points[o + 1] ?? 0)) * this.dpr,
        Math.max((points[o + 2] ?? 1) * this.dpr, 1),
        points[o + 3] ?? 0,
      );
    });
    uniforms.tint.value.set(r, g, b);
    uniforms.dotSize.value = this.options.dotSize * this.dpr;
    uniforms.halftoneEnabled.value = this.options.halftone;
    uniforms.chromaticEnabled.value = this.options.chromatic;
    uniforms.chromaticOffset.value = CHROMATIC_OFFSET_PX * this.dpr;

    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
    this.quad.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}

export { DEFAULTS as WAVE_RENDERER_DEFAULTS, WaveRenderer };
export type { WaveRendererOptions, WaveRendererTunables };
