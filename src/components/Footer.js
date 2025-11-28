import React, { useEffect, useState } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';
import { formatDuration } from '../utils/perf.js';

const ONLINE_AT = new Date('2025-01-01T00:00:00+08:00').getTime();

export default function Footer() {
  const [uptime, setUptime] = useState(formatDuration(ONLINE_AT));
  useEffect(() => {
    const id = setInterval(() => setUptime(formatDuration(ONLINE_AT)), 60_000);
    return () => clearInterval(id);
  }, []);
  const year = new Date().getFullYear();
  return html`
    <footer className="footer glass">
      <div>© 2025–${year} 米可集公益服 · 由 <span className="brand">禾云信创</span> 运营</div>
      <div>网站稳定运行：${uptime}</div>
    </footer>
  `;
}

