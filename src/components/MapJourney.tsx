import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { playBackgroundMusic } from '../lib/backgroundMusic';

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

type Checkpoint = {
  name: string;
  region: string;
  coord: [number, number];
  /** Exact progress along ROUTE (0–1) when the tip arrives here */
  at: number;
};

function segmentLen(a: [number, number], b: [number, number]) {
  const A = maplibregl.MercatorCoordinate.fromLngLat({ lng: a[0], lat: a[1] });
  const B = maplibregl.MercatorCoordinate.fromLngLat({ lng: b[0], lat: b[1] });
  return Math.hypot(B.x - A.x, B.y - A.y);
}

function progressAtRouteIndex(index: number) {
  const total = routeLength(ROUTE);
  if (total <= 0 || index <= 0) return 0;
  let walked = 0;
  for (let i = 1; i <= index && i < ROUTE.length; i++) {
    walked += segmentLen(ROUTE[i - 1], ROUTE[i]);
  }
  return walked / total;
}

/** Places the tip visits — tooltip pops only when the tip arrives. */
const CHECKPOINTS: Checkpoint[] = (
  [
    { name: 'Calicut', region: 'Kerala', routeIndex: 0 },
    { name: 'Malappuram', region: 'Kerala', routeIndex: 1 },
    { name: 'Palakkad', region: 'Kerala', routeIndex: 3 },
    { name: 'Pollachi', region: 'Tamil Nadu', routeIndex: 5 },
    { name: 'Oddanchatram', region: 'Tamil Nadu', routeIndex: 7 },
    { name: 'Dindigul', region: 'Tamil Nadu', routeIndex: 8 },
  ] as const
).map((d) => ({
  name: d.name,
  region: d.region,
  coord: ROUTE[d.routeIndex],
  at: progressAtRouteIndex(d.routeIndex),
}));

function createCheckpointEl(cp: Checkpoint, index: number) {
  const el = document.createElement('div');
  el.className = 'journey-cp';
  el.dataset.checkpoint = String(index);
  el.innerHTML = `
    <div class="journey-cp-card">
      <span class="journey-cp-step">${String(index + 1).padStart(2, '0')}</span>
      <div>
        <div class="journey-cp-name">${cp.name}</div>
        <div class="journey-cp-region">${cp.region}</div>
      </div>
    </div>
    <div class="journey-cp-stem"></div>
    <div class="journey-cp-dot"></div>
  `;
  return el;
}

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

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
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
  const diff = ((b - a + 540) % 360) - 180;
  return (a + diff * t + 360) % 360;
}

/** Slice route from start through progress t (0–1), always including the tip point. */
function routeSlice(coords: [number, number][], t: number): [number, number][] {
  const tip = pointAlongRoute(coords, t);
  if (t <= 0) return [coords[0], tip];

  const total = routeLength(coords);
  const target = total * Math.min(1, Math.max(0, t));
  const out: [number, number][] = [coords[0]];
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
      out.push(tip);
      return out;
    }
    out.push(coords[i]);
    walked += seg;
  }
  out.push(tip);
  return out;
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

function createTipEl() {
  const el = document.createElement('div');
  el.className = 'journey-tip';
  el.innerHTML = '<span class="journey-tip-core"></span><span class="journey-tip-ring"></span>';
  return el;
}

function animateDottedRoute(
  map: maplibregl.Map,
  tipMarker: maplibregl.Marker,
  durationMs: number,
  onProgress: (p: number) => void,
  onCheckpoint: (cp: Checkpoint) => void,
  cancelled: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    let camLng = map.getCenter().lng;
    let camLat = map.getCenter().lat;
    let camZoom = map.getZoom();
    let camPitch = map.getPitch();
    let camBearing = map.getBearing();
    let drawT = 0.002;
    let lastNow = start;
    let lastProgressAt = 0;
    let nextCp = 0;

    const tick = (now: number) => {
      if (cancelled()) {
        resolve();
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;

      // Gentler ease — slower feel at start/end, steady mid-travel
      const raw = Math.min(1, (now - start) / durationMs);
      const targetT = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2;

      // Tip lags slightly so the line draws silk-smooth
      const drawFollow = 1 - Math.pow(0.00008, dt);
      drawT = lerp(drawT, Math.max(0.002, targetT), drawFollow);

      if (now - lastProgressAt > 90 || raw >= 1) {
        lastProgressAt = now;
        onProgress(drawT);
      }

      const slice = routeSlice(ROUTE, drawT);
      const tip = slice[slice.length - 1];
      const ahead = pointAlongRoute(ROUTE, Math.min(1, drawT + 0.035));
      const targetBrg = bearing(tip, ahead);

      // Pop tooltip exactly when the tip arrives at this stop
      while (nextCp < CHECKPOINTS.length && drawT >= CHECKPOINTS[nextCp].at) {
        onCheckpoint(CHECKPOINTS[nextCp]);
        nextCp += 1;
      }

      const src = map.getSource('route-progress') as maplibregl.GeoJSONSource | undefined;
      src?.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: slice },
      });

      tipMarker.setLngLat(tip);

      // Soft breathing glow on the trail
      const breath = 0.28 + Math.sin(now / 520) * 0.08;
      if (map.getLayer('route-progress-glow')) {
        map.setPaintProperty('route-progress-glow', 'line-opacity', breath);
      }

      const targetZoom = lerp(10.1, 8.7, Math.min(1, drawT * 1.15));
      const targetPitch = lerp(50, 45, drawT);

      // Softer chase — less snap, more glide
      const follow = 1 - Math.pow(0.00012, dt);
      const zoomFollow = 1 - Math.pow(0.0009, dt);
      const brgFollow = 1 - Math.pow(0.0018, dt);

      camLng = lerp(camLng, tip[0], follow);
      camLat = lerp(camLat, tip[1], follow);
      camZoom = lerp(camZoom, targetZoom, zoomFollow);
      camPitch = lerp(camPitch, targetPitch, zoomFollow);
      camBearing = lerpAngle(camBearing, targetBrg, brgFollow);

      map.jumpTo({
        center: [camLng, camLat],
        zoom: camZoom,
        pitch: camPitch,
        bearing: camBearing,
      });

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        onProgress(1);
        while (nextCp < CHECKPOINTS.length) {
          onCheckpoint(CHECKPOINTS[nextCp]);
          nextCp += 1;
        }
        tipMarker.setLngLat(DINDIGUL);
        src?.setData({
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: ROUTE },
        });
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
  const [started, setStarted] = useState(false);
  const [activeStop, setActiveStop] = useState<Checkpoint | null>(null);
  const storyStartedRef = useRef(false);
  const mapLoadedRef = useRef(false);
  const runStoryRef = useRef<(() => Promise<void>) | null>(null);
  const startedRef = useRef(false);
  startedRef.current = started;

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

      // Faint full corridor (ghost path)
      map.addLayer({
        id: 'route-ghost',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#c8a96e',
          'line-width': 2.5,
          'line-opacity': 0.28,
          'line-dasharray': [0.8, 1.6],
        },
      });

      map.addSource('route-progress', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: [CALICUT, CALICUT] },
        },
      });

      map.addLayer({
        id: 'route-progress-glow',
        type: 'line',
        source: 'route-progress',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#c8a96e',
          'line-width': 12,
          'line-opacity': 0.32,
          'line-blur': 4,
        },
      });

      // Animated dotted path toward Dindigul
      map.addLayer({
        id: 'route-progress-dots',
        type: 'line',
        source: 'route-progress',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#a98a4b',
          'line-width': 3.5,
          'line-opacity': 0.95,
          'line-dasharray': [0.5, 1.6],
        },
      });

      const tipMarker = new maplibregl.Marker({
        element: createTipEl(),
        anchor: 'center',
      })
        .setLngLat(CALICUT)
        .addTo(map);

      const checkpointMarkers = CHECKPOINTS.map((cp, i) => {
        const el = createCheckpointEl(cp, i);
        return new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, -2] })
          .setLngLat(cp.coord)
          .addTo(map);
      });

      let lastCpIndex = -1;
      const revealCheckpoint = (cp: Checkpoint) => {
        const index = CHECKPOINTS.indexOf(cp);
        if (index < 0 || index === lastCpIndex) return;
        if (lastCpIndex >= 0) {
          const prev = checkpointMarkers[lastCpIndex].getElement();
          prev.classList.remove('is-visible');
          prev.classList.add('is-passed');
        }
        const el = checkpointMarkers[index].getElement();
        el.classList.remove('is-passed', 'is-visible');
        // Restart pop animation when the tip arrives
        void el.offsetWidth;
        el.classList.add('is-visible');
        lastCpIndex = index;
        setActiveStop(cp);
      };

      setScene('overview');
      setProgress(0.05);
      await wait(500);
      if (cancelledRef.current) return;

      // 1) Zoom into Calicut
      setScene('calicut');
      setProgress(0.12);
      await flyTo(map, {
        center: CALICUT,
        zoom: 10.4,
        pitch: 52,
        bearing: 35,
        duration: 3200,
        curve: 1.3,
        speed: 0.45,
        easing: easeInOut,
      });
      if (cancelledRef.current) return;
      setProgress(0.2);
      await wait(800);
      if (cancelledRef.current) return;

      // 2) Dotted line draws — tooltips pop only when the tip reaches each place
      setScene('road');
      await animateDottedRoute(
        map,
        tipMarker,
        12500,
        (p) => setProgress(0.2 + p * 0.58),
        (cp) => revealCheckpoint(cp),
        () => cancelledRef.current,
      );
      if (cancelledRef.current) return;

      // 3) Settle on Dindigul
      setScene('dindigul');
      if (lastCpIndex < CHECKPOINTS.length - 1) {
        revealCheckpoint(CHECKPOINTS[CHECKPOINTS.length - 1]);
      }
      await flyTo(map, {
        center: DINDIGUL,
        zoom: 11.2,
        pitch: 48,
        bearing: map.getBearing(),
        duration: 2000,
        curve: 1.1,
        easing: easeInOut,
      });
      if (cancelledRef.current) return;
      setProgress(0.9);
      await wait(900);
      if (cancelledRef.current) return;

      // 4) Blessing beat, then invitation letter
      setScene('letter');
      setProgress(1);
      setShowBlessing(true);
      setActiveStop(null);
      map.easeTo({
        center: DINDIGUL,
        zoom: 12.5,
        pitch: 55,
        bearing: map.getBearing(),
        duration: 1400,
        easing: easeInOut,
      });
      await wait(2800);
      if (cancelledRef.current) return;
      finish();
    };

    runStoryRef.current = runStory;

    const tryStartStory = () => {
      if (storyStartedRef.current || !startedRef.current || !mapLoadedRef.current) return;
      storyStartedRef.current = true;
      void runStory();
    };

    map.on('load', () => {
      mapLoadedRef.current = true;
      setMapReady(true);
      tryStartStory();
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

  useEffect(() => {
    if (!started || !mapLoadedRef.current || storyStartedRef.current) return;
    storyStartedRef.current = true;
    void runStoryRef.current?.();
  }, [started]);

  const handleBegin = useCallback(() => {
    void playBackgroundMusic();
    setStarted(true);
  }, []);

  const copy = SCENE_COPY[scene];
  const roadLine = activeStop
    ? `${activeStop.name} · ${activeStop.region}`
    : copy.line;

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

      <AnimatePresence>
        {mapReady && !started && (
          <motion.button
            type="button"
            onClick={handleBegin}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 px-8 cursor-pointer border-0"
            style={{ background: 'rgba(20,26,16,0.72)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            aria-label="Begin the journey and start music"
          >
            <p className="font-['Cinzel'] text-[10px] sm:text-[11px] tracking-[0.45em] text-[var(--color-beige-warm)] uppercase">
              The journey begins
            </p>
            <h2 className="font-['Cormorant_Garamond'] italic text-[26px] sm:text-[34px] text-[var(--color-beige-paper)] font-light text-center">
              Calicut → Dindigul
            </h2>
            <div className="w-12 h-px bg-[rgba(169,138,75,0.55)]" />
            <p className="font-['Cormorant_Garamond'] italic text-[14px] sm:text-[16px] text-[var(--color-beige-warm)] opacity-90">
              Tap anywhere to begin
            </p>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-[var(--color-gold-line)] opacity-60 text-sm mt-1"
            >
              ▼
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

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
              key={(activeStop?.name ?? scene) + '-line'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center font-['Cormorant_Garamond'] italic text-[14px] sm:text-[16px] text-[var(--color-beige-paper)]"
            >
              {roadLine}
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
