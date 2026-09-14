'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * The gate in front of the WebGL hero.
 *
 * This file must never import three.js. `dynamic` only fetches the chunk when
 * the component is actually rendered, and it is only rendered after every check
 * below passes AND the browser has gone idle — so on a phone, a slow link or a
 * reduced-motion machine the scene is never requested at all and three.js stays
 * out of the mobile Lighthouse run entirely.
 */
const HeroStage = dynamic(() => import('./hero-stage').then((m) => m.HeroStage), {
  ssr: false,
});

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/** Both hints are widely shipped but still outside lib.dom. */
type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformation;
};

const SLOW_NETWORKS = ['slow-2g', '2g', '3g'];

export function HeroStageLoader() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Every bail here is permanent: nothing flips `armed`, so the component
    // renders null for the life of the page.
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const nav = navigator as NavigatorWithHints;
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return;
    if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return;

    const connection = nav.connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && SLOW_NETWORKS.includes(connection.effectiveType)) return;

    let idleId: number | undefined;
    let timerId: number | undefined;
    const arm = () => setArmed(true);

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(arm, { timeout: 3000 });
    } else {
      timerId = window.setTimeout(arm, 1200);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, []);

  if (!armed) return null;

  return <HeroStage />;
}
