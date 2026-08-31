import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 768px), (hover: none) and (pointer: coarse)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** Mobile / touch: skip heavy scroll parallax and background motion. */
export function useTouchLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
