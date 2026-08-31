# Map Journey — How It Works (Learning Guide)

A plain-language map of every file and function behind the Calicut → Dindigul animation.

---

## Big picture (one paragraph)

The app shows a **MapLibre** map with free **Esri** street tiles. You hand-wrote a list of GPS points (`ROUTE`). A scripted story flies the camera, then walks a progress value from `0 → 1` along that route. Each frame, the code draws only the part of the line already “traveled,” moves a glowing tip, and pops city labels when the tip reaches them. When the story ends, it calls `onComplete()` and the app switches to the envelope.

---

## Which file does what

| File | Role |
|------|------|
| `src/App.tsx` | Owns stages: `journey` → `envelope` → `invite`. Renders `<MapJourney onComplete={…} />`. When journey finishes, stage becomes `envelope`. |
| `src/components/MapJourney.tsx` | **Main file.** Creates the map, route, animation, scenes, UI overlays, Skip button. |
| `src/index.css` | Styles for the tip (`.journey-tip`) and city markers (`.journey-cp`, `.is-visible`, `.is-passed`). Makes them look like pop-up labels. |
| `src/lib/backgroundMusic.ts` | Starts looping music when user taps “Begin”. |
| `src/components/AudioPlayer.tsx` | Mute / volume UI for that same music (shared audio instance). |
| `package.json` | Dependencies: `maplibre-gl`, `framer-motion`. |

Nothing else draws the route. Almost all logic lives in **`MapJourney.tsx`**.

---

## How App and MapJourney connect

```
User opens site
    → App stage = "journey"
    → <MapJourney onComplete={handleJourneyDone} />
    → User taps “Begin”
    → Map story runs
    → finish() → onComplete()
    → App sets stage = "envelope"
```

- `onComplete` is just a callback prop. MapJourney does not know about the envelope; it only says “I’m done.”
- Skip button also calls `finish()` → same `onComplete`.

---

## Data you wrote by hand (the “path”)

### `ROUTE` — list of `[longitude, latitude]`

```
Calicut → …via Palakkad corridor… → Dindigul
```

This is **not** Google Directions. You picked waypoints yourself. The dotted line follows **exactly** these points.

### Shortcuts from that list

| Name | Meaning |
|------|---------|
| `CALICUT` | First point of `ROUTE` |
| `DINDIGUL` | Last point of `ROUTE` |
| `OVERVIEW` | Camera start center (wide view of Kerala / Tamil Nadu) |

### `CHECKPOINTS` — cities that show labels

Each checkpoint = city name + which `ROUTE` index it sits on + `at` (progress 0–1 when tip arrives).

Example idea:

- Calicut at progress `0`
- Palakkad at some middle progress
- Dindigul at progress `1`

Labels are **hidden** until the tip reaches their `at` value.

### `MAP_STYLE`

Tells MapLibre: “load free Esri street map tiles from this URL.” No Google API key.

### `SCENE_COPY`

Text titles/lines for each scene: `overview`, `calicut`, `road`, `dindigul`, `letter`.

### `Scene` type

Scripted chapters of the story. React state `scene` drives the top title and bottom subtitle.

---

## Math / helper functions (how the line knows where to go)

Think of the route as a string of beads. Progress `t` is “how far along the string” from `0` (start) to `1` (end).

| Function | What it does |
|----------|----------------|
| `segmentLen(a, b)` | Distance between two points (in Mercator map units). |
| `routeLength(coords)` | Total length of the whole path (sum of segments). |
| `progressAtRouteIndex(index)` | “If I’m at route point #N, what is my progress 0–1?” Used to build checkpoint `at` values. |
| `pointAlongRoute(coords, t)` | Given progress `t`, return the exact `[lng, lat]` on the path (may be between two waypoints). |
| `routeSlice(coords, t)` | Return the path **from start up to** progress `t` — what gets drawn as the growing dotted line. |
| `easeInOut(t)` | Smooth acceleration/deceleration curve (slow → fast → slow). |
| `lerp(a, b, t)` | Blend two numbers: start at `a`, end at `b`, mix by `t`. |
| `bearing(a, b)` | Compass direction from point A toward B (so camera can face along the road). |
| `lerpAngle(a, b, t)` | Smoothly rotate angle without spinning the wrong way (handles 359° → 1°). |
| `wait(ms)` | `setTimeout` wrapped as a Promise so the story can `await wait(800)`. |

**Core idea:** every animation frame picks a `t` (0→1), then:

1. `routeSlice(ROUTE, t)` → update the drawn line  
2. tip of that slice → move the tip marker  
3. if `t >= checkpoint.at` → show that city’s label  

---

## Map / UI helper functions

| Function | What it does |
|----------|----------------|
| `createTipEl()` | Builds the HTML for the glowing tip (core + pulsing ring). CSS classes: `.journey-tip`. |
| `createCheckpointEl(cp, index)` | Builds the HTML card for a city (number, name, region, stem, dot). CSS: `.journey-cp`. |
| `flyTo(map, opts)` | Smooth MapLibre camera flight; returns a Promise that resolves when the move ends (or after a timeout fallback). |
| `animateDottedRoute(...)` | **The heart of the travel.** Runs ~12.5 seconds of `requestAnimationFrame` frames that grow the line, move tip + camera, and fire checkpoints. |

---

## `animateDottedRoute` — frame by frame

Called once during the `road` scene with duration **12500 ms**.

Each animation frame:

1. Compute time progress `raw` (0→1 over 12.5s), ease it to `targetT`.
2. Smoothly lag `drawT` toward `targetT` (line feels silky, not jumpy).
3. `routeSlice(ROUTE, drawT)` → update GeoJSON source `route-progress` (dotted + glow layers).
4. Move tip marker to the end of that slice.
5. If `drawT` crossed a checkpoint’s `at` → call `onCheckpoint`.
6. Softly chase the camera toward the tip (`jumpTo` with lerped center / zoom / pitch / bearing).
7. Pulse the glow opacity a little (“breathing”).
8. Report progress to React via `onProgress` (updates the % bar).
9. When done: snap line to full `ROUTE`, tip to Dindigul, resolve the Promise.

Cancellation: if user hits Skip, `cancelled()` becomes true and the loop stops.

---

## Map layers (what you see on the map)

When the story starts, MapLibre gets:

| Source / layer | Purpose |
|----------------|---------|
| Source `route` + layer `route-ghost` | Faint dashed full corridor (ghost of the whole trip). |
| Source `route-progress` + `route-progress-glow` | Soft wide glow under the traveling line. |
| Same source + `route-progress-dots` | The gold dotted line that **grows** as you travel. |
| Tip `Marker` | Moving “you are here” glow at the tip. |
| Checkpoint `Marker`s | One per city; CSS toggles visibility when tip arrives. |

Updating the trip = calling `setData(...)` on `route-progress` with a shorter or longer `LineString`. MapLibre redraws automatically.

---

## Story script (`runStory`) — order of scenes

Runs only after **map is loaded** AND user tapped **Begin**.

| Step | Scene | What happens |
|------|-------|----------------|
| 0 | `overview` | Wide map, short pause. |
| 1 | `calicut` | `flyTo` Calicut (zoom in, tilt). |
| 2 | `road` | `animateDottedRoute` — line draws, cities pop, camera follows. |
| 3 | `dindigul` | `flyTo` Dindigul; last checkpoint shown. |
| 4 | `letter` | Blessing overlay (`showBlessing`), slight zoom in, wait, then `finish()`. |

Progress bar mapping (rough):

- Overview / Calicut ≈ 5% → 20%
- Road travel maps tip progress into ≈ 20% → 78%
- Dindigul / letter → 90% → 100%

---

## React state inside `MapJourney`

| State | Meaning |
|-------|---------|
| `progress` | 0–1 for the bottom % bar |
| `scene` | Current chapter for titles |
| `mapReady` | Map tiles/style loaded |
| `started` | User tapped Begin |
| `showBlessing` | Full-screen blessing before envelope |
| `activeStop` | Current city name shown in bottom subtitle |

Refs (`mapRef`, `cancelledRef`, `storyStartedRef`, …) hold things that must not re-trigger React renders every frame (the map object, cancel flag, “story already started”).

---

## User click → music → story

1. Overlay button “Tap anywhere to begin” → `handleBegin()`
2. `playBackgroundMusic()` (browser needs a user gesture to start audio)
3. `setStarted(true)`
4. When map `load` has also fired → `runStory()` starts

---

## CSS (`index.css`) — why markers look alive

| Class | Effect |
|-------|--------|
| `.journey-cp` | Hidden / faded by default |
| `.journey-cp.is-visible` | Pop in when tip arrives |
| `.journey-cp.is-passed` | Dim previous city after moving on |
| `.journey-cp-dot` + pulse keyframes | Dot pulse on reveal |
| `.journey-tip` / `-core` / `-ring` | Glowing tip + breathing ring |
| `.map-journey-canvas …` | Force map canvas to fill the screen |

HTML for markers is created in JS (`createTipEl` / `createCheckpointEl`); **look** comes from CSS.

---

## Framer Motion role

Only for **UI overlays** (titles, begin screen, blessing fade, exit).  
The **map line and camera** are MapLibre + `requestAnimationFrame`, not Framer Motion.

---

## Mental model cheat sheet

```
ROUTE[]          = the road (hand-picked GPS points)
t = 0..1         = how far along that road
routeSlice(t)    = line drawn so far
pointAlongRoute  = tip position
CHECKPOINTS.at   = when to show each city
flyTo / jumpTo   = camera
scenes           = narrative chapters + titles
onComplete       = tell App.tsx to open the envelope
```

---

## Where to look when learning / changing things

| Want to change… | Edit… |
|-----------------|--------|
| Path shape / cities | `ROUTE` and `CHECKPOINTS` in `MapJourney.tsx` |
| Travel speed | `12500` in `animateDottedRoute(...)` call |
| Camera angles | `flyTo({ zoom, pitch, bearing, … })` options |
| Line colors | `paint` on `route-ghost` / `route-progress-*` layers |
| Tip / label look | `.journey-tip` / `.journey-cp` in `index.css` |
| Titles / copy | `SCENE_COPY` |
| What happens after journey | `handleJourneyDone` in `App.tsx` |
| Music | `backgroundMusic.ts` + `assets/m.mp3` |

---

## Say this out loud (short explain for others)

> “I use MapLibre with free Esri map tiles. I define a route as GPS points from Calicut to Dindigul. A story script flies the camera in, then animates progress from 0 to 1 along that route—redrawing the dotted line each frame, moving a tip marker, and popping city labels when the tip reaches them. When it finishes, the app opens the invitation envelope.”
