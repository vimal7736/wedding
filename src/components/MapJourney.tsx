import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type MapJourneyProps = {
  onComplete: () => void;
};

type Scene = 'overview' | 'calicut' | 'road' | 'dindigul' | 'letter';

/** [lng, lat] — Calicut → Dindigul via Palakkad corridor */
const ROUTE: [number, number][] = [
  [75.7804, 11.2588],
  [76.05, 11.12],
  [76.32, 10.95],
  [76.6547, 10.7867],
  [76.9, 10.88],
  [77.15, 10.78],
  [77.45, 10.58],
  [77.72, 10.42],
  [77.9803, 10.3673],
];

const CALICUT = ROUTE[0];
const DINDIGUL = ROUTE[ROUTE.length - 1];
const OVERVIEW: [number, number] = [76.7, 10.85];

/** Esri World Street Map — free, no API key watermark */
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    streets: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri',
    },
  },
  layers: [
    {
      id: 'streets',
      type: 'raster',
      source: 'streets',
      minzoom: 0,
      maxzoom: 18,
    },
  ],
};

const SCENE_COPY: Record<Scene, { title: string; line: string }> = {
  overview: { title: 'Kerala · Tamil Nadu', line: 'Finding the way…' },
  calicut: { title: 'Calicut, Kerala', line: 'Starting from home…' },
  road: { title: 'Calicut → Dindigul', line: 'Along the road…' },
  dindigul: { title: 'Dindigul, Tamil Nadu', line: 'You have arrived' },
  letter: {
    title: 'We seek your blessings',
    line: 'Your love and prayers mean the world to us',
  },
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function routeLength(coords: [number, number][]) {
  let len = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = maplibregl.MercatorCoordinate.fromLngLat({
      lng: coords[i - 1][0],
      lat: coords[i - 1][1],
    });
    const b = maplibregl.MercatorCoordinate.fromLngLat({
      lng: coords[i][0],
      lat: coords[i][1],
    });
    len += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return len;
}

function pointAlongRoute(coords: [number, number][], t: number): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped <= 0) return coords[0];
  if (clamped >= 1) return coords[coords.length - 1];

  const total = routeLength(coords);
  let target = total * clamped;
  let walked = 0;

  for (let i = 1; i < coords.length; i++) {
    const a = maplibregl.MercatorCoordinate.fromLngLat({
      lng: coords[i - 1][0],
      lat: coords[i - 1][1],
    });
    const b = maplibregl.MercatorCoordinate.fromLngLat({
      lng: coords[i][0],
      lat: coords[i][1],
    });
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (walked + seg >= target) {
      const u = seg === 0 ? 0 : (target - walked) / seg;
      return [
        coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * u,
        coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * u,
      ];
    }
    walked += seg;
  }
  return coords[coords.length - 1];
}

function bearing(a: [number, number], b: [number, number]) {
  const toRad = Math.PI / 180;
  const φ1 = a[1] * toRad;
  const φ2 = b[1] * toRad;
  const Δλ = (b[0] - a[0]) * toRad;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function lerpAngle(a: number, b: number, t: number) {
  let diff = ((b - a + 540) % 360) - 180;
  return (a + diff * t + 360) % 360;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function createCarEl() {
  const el = document.createElement('div');
  el.className = 'journey-car';
  // Drawn nose-up so it faces direction of travel with the follow camera
  el.innerHTML = `
    <svg width="18" height="30" viewBox="0 0 18 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="6" width="10" height="20" rx="2" fill="#4a5a37"/>
      <path d="M5 10 L9 3 L13 10 Z" fill="#6b7d51"/>
      <rect x="6.5" y="5" width="5" height="3.5" rx="0.5" fill="#e8dcc0" opacity="0.95"/>
      <circle cx="4" cy="11" r="2" fill="#1a1a1a"/>
      <circle cx="4" cy="11" r="0.8" fill="#c8a96e"/>
      <circle cx="14" cy="11" r="2" fill="#1a1a1a"/>
      <circle cx="14" cy="11" r="0.8" fill="#c8a96e"/>
      <circle cx="4" cy="22" r="2" fill="#1a1a1a"/>
      <circle cx="4" cy="22" r="0.8" fill="#c8a96e"/>
      <circle cx="14" cy="22" r="2" fill="#1a1a1a"/>
      <circle cx="14" cy="22" r="0.8" fill="#c8a96e"/>
      <circle cx="7" cy="4.2" r="1" fill="#f2ead9"/>
      <circle cx="11" cy="4.2" r="1" fill="#f2ead9"/>
    </svg>
  `;
  el.style.cssText =
    'width:18px;height:30px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));pointer-events:none;';
  return el;
}

function flyTo(
  map: maplibregl.Map,
  opts: maplibregl.FlyToOptions,
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const end = () => {
      if (settled) return;
      settled = true;
      map.off('moveend', end);
      resolve();
    };
    map.once('moveend', end);
    map.flyTo({ essential: true, ...opts });
    window.setTimeout(end, (opts.duration ?? 3000) + 900);
  });
}

function animateRoute(
  map: maplibregl.Map,
  carMarker: maplibregl.Marker,
  durationMs: number,
  onProgress: (p: number) => void,
  cancelled: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    let lng = CALICUT[0];
    let lat = CALICUT[1];
    let brg = bearing(ROUTE[0], ROUTE[1]);

    const tick = (now: number) => {
      if (cancelled()) {
        resolve();
        return;
      }
      const raw = Math.min(1, (now - start) / durationMs);
      const t = easeInOut(raw);
      onProgress(t);

      const here = pointAlongRoute(ROUTE, t);
      const ahead = pointAlongRoute(ROUTE, Math.min(1, t + 0.015));
      const targetBrg = bearing(here, ahead);

      lng += (here[0] - lng) * 0.07;
      lat += (here[1] - lat) * 0.07;
      brg = lerpAngle(brg, targetBrg, 0.05);

      carMarker.setLngLat(here);

      map.jumpTo({
        center: [lng, lat],
        zoom: 9.2 + t * 0.7,
        pitch: 52,
        bearing: brg,
      });

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        carMarker.setLngLat(DINDIGUL);
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

export const MapJourney = ({ onComplete }: MapJourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const doneRef = useRef(false);
  const cancelledRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [scene, setScene] = useState<Scene>('overview');
  const [mapReady, setMapReady] = useState(false);
  const [showBlessing, setShowBlessing] = useState(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelledRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    cancelledRef.current = false;

    const map = new maplibregl.Map({
      container: el,
      style: MAP_STYLE,
      center: OVERVIEW,
      zoom: 6.1,
      pitch: 28,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
    mapRef.current = map;

    const forceResize = () => map.resize();

    const runStory = async () => {
      forceResize();
      requestAnimationFrame(forceResize);
      await wait(150);
      forceResize();

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: ROUTE },
        },
      });

      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#c8a96e',
          'line-width': 14,
          'line-opacity': 0.4,
          'line-blur': 4,
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#8b6914',
          'line-width': 4.5,
          'line-opacity': 1,
        },
      });

      const carMarker = new maplibregl.Marker({
        element: createCarEl(),
        anchor: 'center',
        rotationAlignment: 'viewport',
        pitchAlignment: 'viewport',
      })
        .setLngLat(CALICUT)
        .addTo(map);

      const startMarker = new maplibregl.Marker({ color: '#4a5a37' })
        .setLngLat(CALICUT)
        .setPopup(
          new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(
            '<div style="font-family:Cormorant Garamond,serif;font-size:14px;padding:2px 4px"><strong>Calicut</strong><br/><span style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.7">Kerala</span></div>',
          ),
        )
        .addTo(map);

      const endMarker = new maplibregl.Marker({ color: '#a98a4b' })
        .setLngLat(DINDIGUL)
        .setPopup(
          new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(
            '<div style="font-family:Cormorant Garamond,serif;font-size:14px;padding:2px 4px"><strong>Dindigul</strong><br/><span style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;opacity:0.7">Tamil Nadu</span></div>',
          ),
        )
        .addTo(map);

      setMapReady(true);
      setScene('overview');
      setProgress(0.05);
      await wait(900);
      if (cancelledRef.current) return;

      // 1) Slow camera into Calicut
      setScene('calicut');
      setProgress(0.12);
      await flyTo(map, {
        center: CALICUT,
        zoom: 10.4,
        pitch: 52,
        bearing: 35,
        duration: 4800,
        curve: 1.4,
        speed: 0.35,
        easing: easeInOut,
      });
      if (cancelledRef.current) return;
      startMarker.togglePopup();
      setProgress(0.22);
      await wait(1600);
      if (cancelledRef.current) return;

      // 2) Soft travel along the road
      setScene('road');
      startMarker.getPopup()?.remove();
      await animateRoute(
        map,
        carMarker,
        16000,
        (p) => setProgress(0.22 + p * 0.55),
        () => cancelledRef.current,
      );
      if (cancelledRef.current) return;

      // 3) Settle on Dindigul
      setScene('dindigul');
      endMarker.togglePopup();
      await flyTo(map, {
        center: DINDIGUL,
        zoom: 11.2,
        pitch: 48,
        bearing: 18,
        duration: 2800,
        curve: 1.2,
        easing: easeInOut,
      });
      if (cancelledRef.current) return;
      setProgress(0.9);
      await wait(1400);
      if (cancelledRef.current) return;

      // 4) Blessing beat, then invitation letter
      setScene('letter');
      setProgress(1);
      setShowBlessing(true);
      map.easeTo({
        center: DINDIGUL,
        zoom: 12.5,
        pitch: 55,
        bearing: 8,
        duration: 1800,
        easing: easeInOut,
      });
      await wait(3800);
      if (cancelledRef.current) return;
      finish();
    };

    map.on('load', () => {
      void runStory();
    });

    map.on('error', (e) => {
      console.error('Map error', e);
    });

    window.addEventListener('resize', forceResize);

    return () => {
      cancelledRef.current = true;
      window.removeEventListener('resize', forceResize);
      map.remove();
      mapRef.current = null;
    };
  }, [finish]);

  const copy = SCENE_COPY[scene];

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex flex-col overflow-hidden"
      style={{ background: 'var(--color-olive-deep, #4a5a37)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
      transition={{ duration: 0.7 }}
      aria-label="Map journey from Calicut to Dindigul"
    >
      <div className="absolute inset-x-0 top-0 z-20 pt-6 sm:pt-8 px-4 pointer-events-none flex flex-col items-center">
        {!showBlessing && (
          <>
            <motion.div
              key={scene + '-eyebrow'}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full px-4 py-1.5 mb-3"
              style={{ background: 'rgba(20,26,16,0.75)', backdropFilter: 'blur(8px)' }}
            >
              <p className="font-['Cinzel'] text-[10px] tracking-[0.4em] text-[var(--color-beige-warm)] uppercase">
                The journey begins
              </p>
            </motion.div>
            <motion.h2
              key={scene + '-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-['Cormorant_Garamond'] italic text-[22px] sm:text-[28px] text-[var(--color-beige-paper)] px-4 py-1 rounded-lg text-center"
              style={{
                background: 'rgba(20,26,16,0.6)',
                textShadow: '0 2px 12px rgba(0,0,0,0.45)',
              }}
            >
              {copy.title}
            </motion.h2>
          </>
        )}
      </div>

      <div
        ref={containerRef}
        className="map-journey-canvas absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {!mapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#141a10]">
          <p className="font-['Cormorant_Garamond'] italic text-[var(--color-beige-paper)] text-lg">
            Loading map…
          </p>
        </div>
      )}

      {/* Blessing bridge — fills the gap before the envelope */}
      <AnimatePresence>
        {showBlessing && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center"
            style={{ background: 'var(--color-olive-deep, #4a5a37)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.45em] text-[var(--color-beige-warm)] uppercase mb-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              With grateful hearts
            </motion.p>
            <motion.h2
              className="font-['Cormorant_Garamond'] italic text-[28px] sm:text-[38px] md:text-[44px] text-[var(--color-beige-paper)] font-light leading-snug max-w-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.85 }}
            >
              We seek your blessings
            </motion.h2>
            <motion.div
              className="w-14 h-px bg-[rgba(169,138,75,0.55)] mt-6 mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            />
            <motion.p
              className="font-['Cormorant_Garamond'] italic text-[15px] sm:text-[17px] text-[var(--color-beige-warm)] opacity-80 max-w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              Your love and prayers mean the world to us
            </motion.p>
            <motion.p
              className="font-['Cinzel'] text-[9px] tracking-[0.35em] text-[var(--color-gold-line)] uppercase mt-8 opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.1, duration: 0.7 }}
            >
              Vimal & Aishwariya
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showBlessing && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 pb-8 pt-14 px-6 pointer-events-none"
          style={{ background: 'linear-gradient(transparent, rgba(20,26,16,0.88) 42%)' }}
        >
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between mb-2">
              <span className="font-['Cinzel'] text-[8px] tracking-[0.25em] text-[var(--color-beige-warm)] uppercase opacity-70">
                On the road
              </span>
              <span className="font-['Cormorant_Garamond'] text-[13px] text-[var(--color-beige-paper)]">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="h-[2px] rounded-full bg-[rgba(232,220,192,0.12)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--color-gold-line)] transition-[width] duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <motion.p
              key={scene + '-line'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center font-['Cormorant_Garamond'] italic text-[14px] sm:text-[16px] text-[var(--color-beige-paper)]"
            >
              {copy.line}
            </motion.p>
          </div>
          <div className="flex justify-center mt-4 pointer-events-auto">
            <button
              type="button"
              onClick={finish}
              className="font-['Cinzel'] text-[9px] tracking-[0.3em] text-[var(--color-beige-warm)] uppercase opacity-40 hover:opacity-75 bg-transparent border-0 cursor-pointer"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
