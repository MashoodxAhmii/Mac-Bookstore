"use client";

import { useEffect, useRef } from "react";

/**
 * The app's single WebGL canvas: a slow amber "reading lamp" pool of light behind the landing hero.
 * Rendered only on the landing page, only on wide screens, never under reduced motion (see Hero),
 * loaded with next/dynamic (ssr: false), rendered at half resolution, capped at ~30fps, and paused
 * while off-screen or when the tab is hidden.
 */

const VERTEX = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_glow;
uniform float u_strength;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  float t = u_time * 0.05;
  vec2 c = vec2(0.72, 0.52) + 0.03 * vec2(sin(t * 3.0), cos(t * 2.3));
  vec2 d = uv - c; d.x *= aspect;
  float pool = exp(-dot(d, d) * 4.2);
  float haze = noise(uv * vec2(aspect, 1.0) * 3.0 + t) * 0.5 + noise(uv * vec2(aspect, 1.0) * 7.0 - t * 1.3) * 0.25;
  float a = pool * (0.55 + 0.45 * haze) * u_strength;
  gl_FragColor = vec4(u_glow * a, a);
}`;

function readGlow(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--highlight").trim();
  const hex = raw.startsWith("#") ? raw.slice(1) : "";
  if (hex.length !== 6) return [0.72, 0.47, 0.12];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
}

export default function LampGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uGlow = gl.getUniformLocation(program, "u_glow");
    const uStrength = gl.getUniformLocation(program, "u_strength");

    const applyTheme = () => {
      const [r, g, b] = readGlow();
      gl.uniform3f(uGlow, r, g, b);
      // Stronger on ink, much softer on paper.
      gl.uniform1f(uStrength, document.documentElement.classList.contains("dark") ? 0.42 : 0.16);
    };
    const resize = () => {
      const scale = 0.5;
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    let raf = 0;
    let last = 0;
    let visible = true;
    let running = false;
    const draw = (now: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // ~30fps
      last = now;
      draw(now);
    };
    const sync = () => {
      const shouldRun = visible && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    applyTheme();
    resize();
    draw(performance.now());

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      applyTheme();
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", sync);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
