const BASE_PATH = '/lucas-capability-os-pages';
const ENDPOINT = `${BASE_PATH}/telemetry.json`;
const POLL_MS = 60_000;
const TIMEOUT_MS = 3_000;

const dispatchMode = (mode) => {
  window.dispatchEvent(
    new CustomEvent('capability:telemetry-mode', {
      detail: { mode },
    }),
  );
};

const isLiveSnapshot = (value) => {
  if (!value || typeof value !== 'object') return false;
  return (
    value.mode === 'live_public_snapshot' &&
    value.source_scope === 'sanitized_public_snapshot' &&
    value.summary &&
    Number.isInteger(value.summary.engine_count) &&
    Array.isArray(value.engines)
  );
};

const pollOnce = async () => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`telemetry_http_${response.status}`);
    const payload = await response.json();
    dispatchMode(isLiveSnapshot(payload) ? 'live' : 'fallback');
  } catch {
    dispatchMode('fallback');
  } finally {
    window.clearTimeout(timeout);
  }
};

const start = () => {
  void pollOnce();
  window.setInterval(() => void pollOnce(), POLL_MS);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
