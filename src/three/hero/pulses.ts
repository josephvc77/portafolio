import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, type Blending } from 'three';
import { seededRandom } from '../core/math';

/**
 * "Requests" travelling between tiers. One Points draw call; positions are
 * written into a preallocated buffer each frame (no allocations in the loop).
 */
const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  uniform float uSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (10.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * alpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

interface Pulse {
  link: number;
  t: number;
  speed: number;
  /** +1 request (down the stack), -1 response (up). */
  direction: 1 | -1;
  live: boolean;
}

export type LinkEndpoints = (link: number, out: { ax: number; ay: number; az: number; bx: number; by: number; bz: number }) => void;

export class Pulses {
  readonly points: Points;
  private readonly pulses: Pulse[] = [];
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly material: ShaderMaterial;
  private readonly random = seededRandom(7);
  private readonly ends = { ax: 0, ay: 0, az: 0, bx: 0, by: 0, bz: 0 };

  constructor(
    count: number,
    private readonly linkCount: number,
    private readonly endpoints: LinkEndpoints,
    pixelRatio: number,
  ) {
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
    geometry.setAttribute('aColor', new BufferAttribute(this.colors, 3));

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSize: { value: 2.6 },
        uPixelRatio: { value: pixelRatio },
        uOpacity: { value: 1 },
      },
    });

    this.points = new Points(geometry, this.material);
    this.points.frustumCulled = false;

    for (let i = 0; i < count; i++) this.pulses.push(this.spawn(this.random()));
  }

  private spawn(t = 0): Pulse {
    return {
      link: Math.floor(this.random() * this.linkCount),
      t,
      speed: 0.35 + this.random() * 0.45,
      direction: this.random() < 0.65 ? 1 : -1,
      live: this.random() < 0.18,
    };
  }

  setTheme(accent: Color, live: Color, blending: Blending): void {
    this.material.blending = blending;
    this.material.needsUpdate = true;
    this.pulses.forEach((pulse, i) => (pulse.live ? live : accent).toArray(this.colors, i * 3));
    this.points.geometry.attributes.aColor.needsUpdate = true;
  }

  set opacity(value: number) {
    this.material.uniforms.uOpacity.value = value;
  }

  update(delta: number): void {
    const { ends } = this;
    this.pulses.forEach((pulse, i) => {
      pulse.t += pulse.speed * delta;
      if (pulse.t >= 1) {
        const live = pulse.live;
        Object.assign(pulse, this.spawn(), { live }); // keep colour stable per slot
      }
      this.endpoints(pulse.link, ends);
      const t = pulse.direction === 1 ? pulse.t : 1 - pulse.t;
      this.positions[i * 3] = ends.ax + (ends.bx - ends.ax) * t;
      this.positions[i * 3 + 1] = ends.ay + (ends.by - ends.ay) * t;
      this.positions[i * 3 + 2] = ends.az + (ends.bz - ends.az) * t;
    });
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}
