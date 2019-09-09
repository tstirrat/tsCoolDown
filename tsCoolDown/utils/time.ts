/** @noSelfInFile */
function fmod(a: number, b: number) {
  return Number((a - Math.floor(a / b) * b));
};

export function formatRemainingTime(secsRemaining: number) {
  if (secsRemaining <= 0) {
    return '00:00';
  }
  const min = Math.floor(secsRemaining / 60);
  const sec = Math.floor(fmod(secsRemaining, 60));
  return `${min}:${sec}`;
};

export function getRemainingTime(start: number, duration: number) {
  return start + duration - GetTime();
}

export function throttle(fn: CallableFunction, threshold: number) {
  assert(threshold, 'threshold is required');
  let t = 0;
  return function(frame: WowFrame, elapsed: number) {
    t = t + elapsed;
    if (t > threshold) {
      t = 0;
      fn(frame, elapsed);
    }
  };
};
