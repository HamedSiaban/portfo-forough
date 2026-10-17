/**
 * GLSL ES 1.00 sources for the stable-fluids pipeline (splat -> curl -> vorticity
 * confinement -> divergence -> pressure Jacobi -> gradient subtract -> advection) and the
 * halftone/chromatic display pass. Original implementation of the public, well-documented
 * "stable fluids" technique (Jos Stam) — not derived from the incredibles.dev reference.
 *
 * Every fragment shader shares `vertexShader`, rendered on a fullscreen 2x2 plane with a
 * camera-independent vertex stage (bypasses MVP matrices entirely).
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const splatFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main() {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const curlFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
    gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0);
  }
`;

const vorticityFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curlStrength;
  uniform float dt;
  uniform vec2 texelSize;

  void main() {
    float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curlStrength * C;
    force.y *= -1.0;

    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`;

const divergenceFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;

const pressureFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 texelSize;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    float div = texture2D(uDivergence, vUv).x;
    gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 texelSize;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel - vec2(R - L, T - B) * 0.5, 0.0, 1.0);
  }
`;

// Velocity is stored directly in UV-units-per-second (splats inject it that way), so the
// backward trace needs no extra texel-size scaling — it works for both the sim-resolution
// velocity field and the (independently sized) dye field.
const advectionFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float dt;
  uniform float dissipation;

  void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
`;

// Dye already stores tinted color (not a bare density channel), so the chromatic offset
// samples the dye's own R/B channels at a small UV shift for the cyan/red fringe.
const displayFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uDye;
  uniform vec2 resolution;
  uniform float dotSize;
  uniform bool halftoneEnabled;
  uniform bool chromaticEnabled;
  uniform float chromaticOffset;

  void main() {
    vec3 center = texture2D(uDye, vUv).rgb;
    vec3 color = center;

    if (chromaticEnabled) {
      vec2 off = vec2(chromaticOffset, 0.0);
      float r = texture2D(uDye, vUv + off).r;
      float b = texture2D(uDye, vUv - off).b;
      color = vec3(r, center.g, b);
    }

    float density = max(center.r, max(center.g, center.b));
    float alpha = clamp(density, 0.0, 1.0);

    if (halftoneEnabled) {
      vec2 px = vUv * resolution;
      vec2 cell = mod(px, dotSize) - dotSize * 0.5;
      float cellDist = length(cell);
      float dotRadius = alpha * dotSize * 0.5;
      alpha = 1.0 - smoothstep(dotRadius - 1.0, dotRadius + 1.0, cellDist);
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

export {
  advectionFragmentShader,
  curlFragmentShader,
  displayFragmentShader,
  divergenceFragmentShader,
  gradientSubtractFragmentShader,
  pressureFragmentShader,
  splatFragmentShader,
  vertexShader,
  vorticityFragmentShader,
};
