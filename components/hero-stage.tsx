'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * The room, abstracted: eight lit panels floating at different depths over a
 * dark floor, seen through heavy fog. Decoration only — it sits behind the
 * scrim and carries no information, so it is aria-hidden and every failure
 * path ends in a silent, blank canvas over the painted CSS fallback.
 *
 * Never imported directly by a server component; HeroStageLoader gates it.
 */

type Screen = {
  /** metres, right-handed, camera looking down -z */
  position: [number, number, number];
  size: [number, number];
  rotationY: number;
  role: Role;
  opacity: number;
};

/**
 * Screens name a role, not a hue, so the scene follows whichever theme is
 * running. Embers lights the room warm; Midnight lights it PlayStation blue.
 */
type Role = 'key' | 'keyHi' | 'ember' | 'cool' | 'coolDeep';

/** Reads the live palette off the document rather than duplicating it here. */
function readPalette(): Record<Role | 'fog' | 'floor', THREE.Color> {
  const css = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => {
    const value = css.getPropertyValue(name).trim();
    const colour = new THREE.Color();
    try {
      colour.setStyle(value || fallback);
    } catch {
      colour.setStyle(fallback);
    }
    return colour;
  };

  const key = pick('--color-accent', '#c8763a');
  const keyHi = pick('--color-lamp-hi', '#d68345');
  const cool = pick('--color-screen', '#5c86b4');

  return {
    key,
    keyHi,
    ember: key.clone().multiplyScalar(0.82),
    cool,
    coolDeep: cool.clone().multiplyScalar(0.7),
    fog: pick('--color-room', '#121315'),
    floor: pick('--color-room-deep', '#0c0d0f'),
  };
}

const SCREENS: Screen[] = [
  { position: [-4.6, 1.1, -3.4], size: [2.6, 1.5], rotationY: 0.42, role: 'key', opacity: 0.72 },
  { position: [-2.1, 0.4, -6.2], size: [2.2, 1.25], rotationY: 0.22, role: 'ember', opacity: 0.5 },
  { position: [0.6, 1.6, -9.4], size: [3.4, 1.9], rotationY: 0.0, role: 'coolDeep', opacity: 0.34 },
  { position: [3.9, 0.9, -4.1], size: [2.8, 1.6], rotationY: -0.38, role: 'keyHi', opacity: 0.66 },
  { position: [6.2, 1.8, -7.6], size: [2.4, 1.4], rotationY: -0.55, role: 'cool', opacity: 0.42 },
  { position: [-6.8, 2.3, -8.2], size: [2.0, 1.15], rotationY: 0.6, role: 'cool', opacity: 0.3 },
  { position: [1.9, -0.5, -2.6], size: [1.6, 0.95], rotationY: -0.15, role: 'key', opacity: 0.55 },
  { position: [-1.4, 2.6, -5.0], size: [1.8, 1.05], rotationY: 0.18, role: 'ember', opacity: 0.38 },
];

/** One 128px radial gradient, tinted per screen by the material colour. */
function createHaloTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.32, 'rgba(255,255,255,0.26)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.05)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  return new THREE.CanvasTexture(canvas);
}

export function HeroStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      // no WebGL, or the context was refused — the CSS fallback stands alone
      return;
    }

    const width = () => Math.max(host.clientWidth, 1);
    const height = () => Math.max(host.clientHeight, 1);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width(), height(), false);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    host.appendChild(canvas);

    let palette = readPalette();
    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(palette.fog.getHex(), 0.052);
    scene.fog = fog;

    // materials that have to be repainted when the palette changes under us
    const tinted: { material: THREE.MeshBasicMaterial; role: Role }[] = [];

    const camera = new THREE.PerspectiveCamera(46, width() / height(), 0.1, 60);
    camera.position.set(0, 1.5, 6.4);

    // everything that owns GPU memory, collected for one sweep on unmount
    const disposables: { dispose: () => void }[] = [];

    const panelGeometry = new THREE.PlaneGeometry(1, 1);
    const halo = createHaloTexture();
    disposables.push(panelGeometry, halo);

    for (const screen of SCREENS) {
      const [x, y, z] = screen.position;
      const [w, h] = screen.size;

      const panelMaterial = new THREE.MeshBasicMaterial({
        color: palette[screen.role],
        transparent: true,
        opacity: screen.opacity,
        fog: true,
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(x, y, z);
      panel.rotation.y = screen.rotationY;
      panel.scale.set(w, h, 1);
      scene.add(panel);
      disposables.push(panelMaterial);
      tinted.push({ material: panelMaterial, role: screen.role });

      const haloMaterial = new THREE.MeshBasicMaterial({
        map: halo,
        color: palette[screen.role],
        transparent: true,
        opacity: screen.opacity * 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: true,
      });
      const glow = new THREE.Mesh(panelGeometry, haloMaterial);
      glow.position.set(x, y, z - 0.05);
      glow.rotation.y = screen.rotationY;
      glow.scale.set(w * 3.4, h * 3.8, 1);
      scene.add(glow);
      disposables.push(haloMaterial);
      tinted.push({ material: haloMaterial, role: screen.role });
    }

    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: palette.floor, fog: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.1;
    scene.add(floor);
    disposables.push(floorGeometry, floorMaterial);

    const grid = new THREE.GridHelper(80, 64, palette.key, palette.floor);
    grid.position.y = -2.08;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.14;
    scene.add(grid);
    disposables.push(grid.geometry, gridMaterial);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height(), false);
    };

    const clock = new THREE.Clock();
    let elapsed = 0;
    let raf = 0;
    let onScreen = true;
    let firstFrame = true;

    const target = new THREE.Vector3(0, 0.7, -4);

    const tick = () => {
      raf = requestAnimationFrame(tick);

      // clamped so a paused tab resumes without a jump in the drift
      elapsed += Math.min(clock.getDelta(), 0.05);

      const driftX = Math.sin(elapsed * 0.11) * 0.7;
      const driftY = Math.cos(elapsed * 0.083) * 0.3;

      const wantX = driftX + pointer.x * 1.15;
      const wantY = 1.5 + driftY - pointer.y * 0.45;

      camera.position.x += (wantX - camera.position.x) * 0.03;
      camera.position.y += (wantY - camera.position.y) * 0.03;
      camera.lookAt(target);

      renderer.render(scene, camera);

      if (firstFrame) {
        firstFrame = false;
        setLit(true);
      }
    };

    const start = () => {
      if (!raf) {
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(host);

    const onVisibility = () => sync();

    /*
      The palette can change under a running scene when someone flips the theme.
      Watching the attribute is cheaper and more reliable than threading a prop
      down into a canvas that lives outside React's render path.
    */
    const repaint = () => {
      palette = readPalette();
      for (const { material, role } of tinted) material.color.copy(palette[role]);
      fog.color.copy(palette.fog);
      floorMaterial.color.copy(palette.floor);
      (grid.material as THREE.LineBasicMaterial).color.copy(palette.key);
    };

    const themeWatcher = new MutationObserver(repaint);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      themeWatcher.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);

      scene.clear();
      for (const item of disposables) item.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        lit ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
