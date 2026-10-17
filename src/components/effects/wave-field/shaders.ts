/**
 * GLSL ES 1.00 sources for the pointer comet. One pass, no buffers: the max of a handful of
 * soft radial falloffs (head at the pointer, then progressively wider, dimmer blobs trailing
 * behind it), displayed through a halftone/chromatic shader. The trail comes from the CPU-side
 * point chain passed in as uniforms, never from remembered pixels, so it always collapses back
 * onto the pointer. Rendered on a fullscreen 2x2 plane with a camera-independent vertex stage.
 */

const TRAIL_LENGTH = 16;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Coordinates are in device pixels so radius and dot size are resolution-independent.
// Output is straight (non-premultiplied) alpha: color is the full-saturation tint and the
// falloff drives only opacity, so thin edges fade out as translucent accent, never muddy.
const glowFragmentShader = /* glsl */ `
  #define TRAIL_LENGTH ${TRAIL_LENGTH}
  varying vec2 vUv;
  uniform vec2 resolution;
  // xy = position (device px), z = radius (device px), w = strength. Index 0 is the head.
  uniform vec4 trail[TRAIL_LENGTH];
  uniform vec3 tint;
  uniform float dotSize;
  uniform bool halftoneEnabled;
  uniform bool chromaticEnabled;
  uniform float chromaticOffset;

  float falloff(vec2 px, vec2 offset) {
    float density = 0.0;
    for (int i = 0; i < TRAIL_LENGTH; i++) {
      vec4 t = trail[i];
      vec2 d = px - t.xy + offset;
      density = max(density, exp(-dot(d, d) / (t.z * t.z)) * t.w);
    }
    return density;
  }

  void main() {
    vec2 px = vUv * resolution;
    float g = falloff(px, vec2(0.0));
    vec3 channels = vec3(g);

    if (chromaticEnabled) {
      vec2 off = vec2(chromaticOffset, 0.0);
      channels = vec3(falloff(px, off), g, falloff(px, -off));
    }

    vec3 weighted = tint * channels;
    float density = clamp(max(weighted.r, max(weighted.g, weighted.b)), 0.0, 1.0);
    if (density < 0.003) discard;
    vec3 color = weighted / max(max(weighted.r, max(weighted.g, weighted.b)), 0.001);

    float alpha = density;
    if (halftoneEnabled) {
      vec2 cell = mod(px, dotSize) - dotSize * 0.5;
      float dotRadius = alpha * dotSize * 0.5;
      float dotAlpha = 1.0 - smoothstep(dotRadius - 1.0, dotRadius + 1.0, length(cell));
      // Soft diffuse halo beneath the dot grid, so the dots read as sitting inside a glow.
      float halo = alpha * alpha * 0.4;
      alpha = max(dotAlpha, halo);
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

export { glowFragmentShader, TRAIL_LENGTH, vertexShader };
