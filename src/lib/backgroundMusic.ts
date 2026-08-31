import musicSrc from '../assets/m.mp3';

let audio: HTMLAudioElement | null = null;
let playing = false;

function getAudio() {
  if (!audio) {
    audio = new Audio(musicSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.85;
  }
  return audio;
}

export async function playBackgroundMusic() {
  const el = getAudio();
  if (playing && !el.paused) return true;
  try {
    await el.play();
    playing = true;
    return true;
  } catch {
    return false;
  }
}

export function getBackgroundAudio() {
  return getAudio();
}
