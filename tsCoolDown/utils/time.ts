/** @noSelfInFile */
import "@wartoshika/wow-declarations";

function fmod(a: number, b: number) {
  return Number((a - Math.floor(a / b) * b));
}

export function formatRemainingTime(secsRemaining: number) {
  if (secsRemaining <= 0) {
    return '00:00';
  }
  const min = `${Math.floor(secsRemaining / 60)}`.padStart(2, '0');
  const sec = `${Math.floor(fmod(secsRemaining, 60))}`.padStart(2, '0');
  return `${min}:${sec}`;
}

export function getRemainingTime(start: number, duration: number) {
  return start + duration - GetTime();
}

export function throttle(fn: CallableFunction, threshold: number) {
  assert(threshold, 'threshold is required');
  let elapsed = 0;
  return function(frame: WoWAPI.Frame, frameTime: number) {
    elapsed +=  frameTime;
    if (elapsed > threshold) {
      elapsed = 0;
      return fn(frame, frameTime);
    }
    return false;
  };
}
