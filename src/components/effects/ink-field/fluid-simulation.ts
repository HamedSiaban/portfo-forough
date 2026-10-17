import * as THREE from "three";

import {
  advectionFragmentShader,
  curlFragmentShader,
  displayFragmentShader,
  divergenceFragmentShader,
  gradientSubtractFragmentShader,
  pressureFragmentShader,
  splatFragmentShader,
  vertexShader,
  vorticityFragmentShader,
} from "./shaders";

type FluidSimulationOptions = {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  dpr: number;
  simResolution?: number;
  dyeResolution?: number;
  pressureIterations?: number;
  intensity?: number;
  /** Fraction of dye remaining after 1 second — lower fades faster. */
  dissipation?: number;
  dotSize?: number;
  halftone?: boolean;
  chromatic?: boolean;
  tint?: [number, number, number];
};

type FluidSimulationTunables = Required<
  Pick<
    FluidSimulationOptions,
    | "simResolution"
    | "dyeResolution"
    | "pressureIterations"
    | "intensity"
    | "dissipation"
    | "dotSize"
    | "halftone"
    | "chromatic"
    | "tint"
  >
>;

const CURL_STRENGTH = 24;
const VELOCITY_DISSIPATION = 0.35;
const SPLAT_RADIUS = 0.0025;
const CHROMATIC_OFFSET = 0.0015;

const DEFAULTS: FluidSimulationTunables = {
  simResolution: 128,
  dyeResolution: 512,
  pressureIterations: 20,
  intensity: 1,
  dissipation: 0.15,
  dotSize: 6,
  halftone: true,
  chromatic: true,
  tint: [1, 0.24, 0.44],
};

function getResolution(
  baseResolution: number,
  width: number,
  height: number,
): { width: number; height: number } {
  const aspect = width / height || 1;
  return aspect > 1
    ? {
        width: Math.max(1, Math.round(baseResolution)),
        height: Math.max(1, Math.round(baseResolution / aspect)),
      }
    : {
        width: Math.max(1, Math.round(baseResolution * aspect)),
        height: Math.max(1, Math.round(baseResolution)),
      };
}

// three.js types `ShaderMaterial.uniforms` as an index signature, which under
// `noUncheckedIndexedAccess` makes every access `IUniform | undefined`. These named
// interfaces + `createMaterial` give each pass's uniforms their real (non-optional) shape.
type SplatUniforms = {
  uTarget: { value: THREE.Texture | null };
  aspectRatio: { value: number };
  color: { value: THREE.Vector3 };
  point: { value: THREE.Vector2 };
  radius: { value: number };
};
type CurlUniforms = {
  uVelocity: { value: THREE.Texture | null };
  texelSize: { value: THREE.Vector2 };
};
type VorticityUniforms = {
  uVelocity: { value: THREE.Texture | null };
  uCurl: { value: THREE.Texture | null };
  curlStrength: { value: number };
  dt: { value: number };
  texelSize: { value: THREE.Vector2 };
};
type DivergenceUniforms = {
  uVelocity: { value: THREE.Texture | null };
  texelSize: { value: THREE.Vector2 };
};
type PressureUniforms = {
  uPressure: { value: THREE.Texture | null };
  uDivergence: { value: THREE.Texture | null };
  texelSize: { value: THREE.Vector2 };
};
type GradientSubtractUniforms = {
  uPressure: { value: THREE.Texture | null };
  uVelocity: { value: THREE.Texture | null };
  texelSize: { value: THREE.Vector2 };
};
type AdvectionUniforms = {
  uVelocity: { value: THREE.Texture | null };
  uSource: { value: THREE.Texture | null };
  dt: { value: number };
  dissipation: { value: number };
};
type DisplayUniforms = {
  uDye: { value: THREE.Texture | null };
  resolution: { value: THREE.Vector2 };
  dotSize: { value: number };
  halftoneEnabled: { value: boolean };
  chromaticEnabled: { value: boolean };
  chromaticOffset: { value: number };
};

type TypedShaderMaterial<U> = THREE.ShaderMaterial & { uniforms: U };

function createMaterial<U extends Record<string, { value: unknown }>>(
  fragmentShader: string,
  uniforms: U,
): TypedShaderMaterial<U> {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  }) as TypedShaderMaterial<U>;
}

class DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;

  constructor(read: THREE.WebGLRenderTarget, write: THREE.WebGLRenderTarget) {
    this.read = read;
    this.write = write;
  }

  swap(): void {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  dispose(): void {
    this.read.dispose();
    this.write.dispose();
  }
}

/**
 * Vanilla (non-React) stable-fluids engine. Owns the WebGL renderer, FBOs and shader
 * passes; React lifecycle (mount/unmount, ticker, pointer capture) lives in
 * ink-field-canvas.tsx so this class stays testable/portable on its own.
 */
class FluidSimulation {
  readonly canvas: HTMLCanvasElement;
  options: FluidSimulationTunables;
  contextLost = false;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private quad: THREE.Mesh;

  private width: number;
  private height: number;
  private dpr: number;
  private simWidth = 0;
  private simHeight = 0;
  private dyeWidth = 0;
  private dyeHeight = 0;

  private velocity!: DoubleFBO;
  private pressure!: DoubleFBO;
  private dye!: DoubleFBO;
  private divergenceTarget!: THREE.WebGLRenderTarget;
  private curlTarget!: THREE.WebGLRenderTarget;

  private materials: {
    splat: TypedShaderMaterial<SplatUniforms>;
    curl: TypedShaderMaterial<CurlUniforms>;
    vorticity: TypedShaderMaterial<VorticityUniforms>;
    divergence: TypedShaderMaterial<DivergenceUniforms>;
    pressure: TypedShaderMaterial<PressureUniforms>;
    gradientSubtract: TypedShaderMaterial<GradientSubtractUniforms>;
    advection: TypedShaderMaterial<AdvectionUniforms>;
    display: TypedShaderMaterial<DisplayUniforms>;
  };

  private handleContextLost = (event: Event): void => {
    event.preventDefault();
    this.contextLost = true;
  };

  private handleContextRestored = (): void => {
    this.contextLost = false;
    this.allocateTargets();
  };

  constructor(opts: FluidSimulationOptions) {
    this.canvas = opts.canvas;
    this.width = opts.width;
    this.height = opts.height;
    this.dpr = opts.dpr;
    this.options = {
      simResolution: opts.simResolution ?? DEFAULTS.simResolution,
      dyeResolution: opts.dyeResolution ?? DEFAULTS.dyeResolution,
      pressureIterations: opts.pressureIterations ?? DEFAULTS.pressureIterations,
      intensity: opts.intensity ?? DEFAULTS.intensity,
      dissipation: opts.dissipation ?? DEFAULTS.dissipation,
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

    this.materials = {
      splat: createMaterial<SplatUniforms>(splatFragmentShader, {
        uTarget: { value: null },
        aspectRatio: { value: 1 },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
        radius: { value: SPLAT_RADIUS },
      }),
      curl: createMaterial<CurlUniforms>(curlFragmentShader, {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      vorticity: createMaterial<VorticityUniforms>(vorticityFragmentShader, {
        uVelocity: { value: null },
        uCurl: { value: null },
        curlStrength: { value: CURL_STRENGTH },
        dt: { value: 0 },
        texelSize: { value: new THREE.Vector2() },
      }),
      divergence: createMaterial<DivergenceUniforms>(divergenceFragmentShader, {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      pressure: createMaterial<PressureUniforms>(pressureFragmentShader, {
        uPressure: { value: null },
        uDivergence: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      gradientSubtract: createMaterial<GradientSubtractUniforms>(gradientSubtractFragmentShader, {
        uPressure: { value: null },
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      advection: createMaterial<AdvectionUniforms>(advectionFragmentShader, {
        uVelocity: { value: null },
        uSource: { value: null },
        dt: { value: 0 },
        dissipation: { value: 1 },
      }),
      display: createMaterial<DisplayUniforms>(displayFragmentShader, {
        uDye: { value: null },
        resolution: { value: new THREE.Vector2() },
        dotSize: { value: DEFAULTS.dotSize },
        halftoneEnabled: { value: DEFAULTS.halftone },
        chromaticEnabled: { value: DEFAULTS.chromatic },
        chromaticOffset: { value: CHROMATIC_OFFSET },
      }),
    };
    this.materials.display.transparent = true;

    this.canvas.addEventListener("webglcontextlost", this.handleContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored);

    this.allocateTargets();
  }

  setOptions(partial: Partial<FluidSimulationTunables>): void {
    // Filter out `undefined` entries so unset React props don't clobber existing tunables —
    // `{...partial}` would otherwise assign the key with value `undefined`.
    const defined = Object.fromEntries(
      Object.entries(partial).filter(([, value]) => value !== undefined),
    );
    this.options = { ...this.options, ...defined };
    if (partial.simResolution !== undefined || partial.dyeResolution !== undefined) {
      this.allocateTargets();
    }
  }

  resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.allocateTargets();
  }

  /** xNorm/yNorm in [0,1] UV space; dxNorm/dyNorm are UV-units-per-second velocity. */
  splat(xNorm: number, yNorm: number, dxNorm: number, dyNorm: number): void {
    if (this.contextLost) return;
    const aspect = this.width / this.height || 1;
    const mat = this.materials.splat;

    mat.uniforms.aspectRatio.value = aspect;
    mat.uniforms.point.value.set(xNorm, 1 - yNorm);

    mat.uniforms.uTarget.value = this.velocity.read.texture;
    mat.uniforms.radius.value = SPLAT_RADIUS * this.options.intensity;
    mat.uniforms.color.value.set(
      dxNorm * this.options.intensity,
      dyNorm * this.options.intensity,
      0,
    );
    this.renderPass(mat, this.velocity.write);
    this.velocity.swap();

    const [r, g, b] = this.options.tint;
    const speed = Math.min(Math.hypot(dxNorm, dyNorm) * 3 + 0.08, 1);
    mat.uniforms.uTarget.value = this.dye.read.texture;
    mat.uniforms.radius.value = SPLAT_RADIUS * 3 * this.options.intensity;
    mat.uniforms.color.value.set(r * speed, g * speed, b * speed);
    this.renderPass(mat, this.dye.write);
    this.dye.swap();
  }

  step(dt: number): void {
    if (this.contextLost) return;
    const clampedDt = Math.min(dt, 1 / 30);
    const simTexel = { x: 1 / this.simWidth, y: 1 / this.simHeight };

    const curl = this.materials.curl;
    curl.uniforms.uVelocity.value = this.velocity.read.texture;
    curl.uniforms.texelSize.value.set(simTexel.x, simTexel.y);
    this.renderPass(curl, this.curlTarget);

    const vorticity = this.materials.vorticity;
    vorticity.uniforms.uVelocity.value = this.velocity.read.texture;
    vorticity.uniforms.uCurl.value = this.curlTarget.texture;
    vorticity.uniforms.texelSize.value.set(simTexel.x, simTexel.y);
    vorticity.uniforms.dt.value = clampedDt;
    this.renderPass(vorticity, this.velocity.write);
    this.velocity.swap();

    const divergence = this.materials.divergence;
    divergence.uniforms.uVelocity.value = this.velocity.read.texture;
    divergence.uniforms.texelSize.value.set(simTexel.x, simTexel.y);
    this.renderPass(divergence, this.divergenceTarget);

    const pressure = this.materials.pressure;
    pressure.uniforms.uDivergence.value = this.divergenceTarget.texture;
    pressure.uniforms.texelSize.value.set(simTexel.x, simTexel.y);
    for (let i = 0; i < this.options.pressureIterations; i++) {
      pressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.renderPass(pressure, this.pressure.write);
      this.pressure.swap();
    }

    const gradientSubtract = this.materials.gradientSubtract;
    gradientSubtract.uniforms.uPressure.value = this.pressure.read.texture;
    gradientSubtract.uniforms.uVelocity.value = this.velocity.read.texture;
    gradientSubtract.uniforms.texelSize.value.set(simTexel.x, simTexel.y);
    this.renderPass(gradientSubtract, this.velocity.write);
    this.velocity.swap();

    const advection = this.materials.advection;
    advection.uniforms.uVelocity.value = this.velocity.read.texture;
    advection.uniforms.uSource.value = this.velocity.read.texture;
    advection.uniforms.dt.value = clampedDt;
    advection.uniforms.dissipation.value = Math.pow(VELOCITY_DISSIPATION, clampedDt);
    this.renderPass(advection, this.velocity.write);
    this.velocity.swap();

    advection.uniforms.uVelocity.value = this.velocity.read.texture;
    advection.uniforms.uSource.value = this.dye.read.texture;
    advection.uniforms.dt.value = clampedDt;
    advection.uniforms.dissipation.value = Math.pow(this.options.dissipation, clampedDt);
    this.renderPass(advection, this.dye.write);
    this.dye.swap();

    const display = this.materials.display;
    display.uniforms.uDye.value = this.dye.read.texture;
    display.uniforms.resolution.value.set(this.width * this.dpr, this.height * this.dpr);
    display.uniforms.dotSize.value = this.options.dotSize * this.dpr;
    display.uniforms.halftoneEnabled.value = this.options.halftone;
    display.uniforms.chromaticEnabled.value = this.options.chromatic;
    this.renderPass(display, null);
  }

  dispose(): void {
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.handleContextRestored);
    this.velocity?.dispose();
    this.pressure?.dispose();
    this.dye?.dispose();
    this.divergenceTarget?.dispose();
    this.curlTarget?.dispose();
    this.quad.geometry.dispose();
    for (const material of Object.values(this.materials)) material.dispose();
    this.renderer.dispose();
  }

  private renderPass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null): void {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private createRenderTarget(width: number, height: number): THREE.WebGLRenderTarget {
    return new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    });
  }

  private createDoubleFBO(width: number, height: number): DoubleFBO {
    return new DoubleFBO(
      this.createRenderTarget(width, height),
      this.createRenderTarget(width, height),
    );
  }

  private allocateTargets(): void {
    this.velocity?.dispose();
    this.pressure?.dispose();
    this.dye?.dispose();
    this.divergenceTarget?.dispose();
    this.curlTarget?.dispose();

    const sim = getResolution(this.options.simResolution, this.width, this.height);
    const dyeRes = getResolution(this.options.dyeResolution, this.width, this.height);
    this.simWidth = sim.width;
    this.simHeight = sim.height;
    this.dyeWidth = dyeRes.width;
    this.dyeHeight = dyeRes.height;

    this.velocity = this.createDoubleFBO(sim.width, sim.height);
    this.pressure = this.createDoubleFBO(sim.width, sim.height);
    this.dye = this.createDoubleFBO(dyeRes.width, dyeRes.height);
    this.divergenceTarget = this.createRenderTarget(sim.width, sim.height);
    this.curlTarget = this.createRenderTarget(sim.width, sim.height);
  }
}

export { DEFAULTS as FLUID_SIMULATION_DEFAULTS, FluidSimulation };
export type { FluidSimulationOptions, FluidSimulationTunables };
