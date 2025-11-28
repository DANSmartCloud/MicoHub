export function detectLowEnd() {
  const prefsReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const isLow = prefsReduced || cores <= 4 || mem <= 4;
  return isLow;
}

export function formatDuration(fromTs) {
  const now = Date.now();
  const diff = Math.max(0, now - fromTs);
  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  return `${days}天 ${hours}小时 ${mins}分钟`;
}

