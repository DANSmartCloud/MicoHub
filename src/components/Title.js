import React, { useEffect, useRef } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';

export default function Title({ text = '米可集公益服' }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    const gs = window.gsap; if (!gs) return;
    const el = wrapRef.current;
    const stop1 = el.querySelector('#title-stop-1');
    const stop2 = el.querySelector('#title-stop-2');
    gs.from(el, { opacity: 0, y: 38, duration: 1.1, ease: 'power3.out' });
    const chars = Array.from(el.querySelectorAll('tspan'));
    gs.from(chars, { y: 60, opacity: 0, skewY: -18, rotate: -6, scale: 0.98, transformOrigin: '50% 50%', stagger: 0.035, ease: 'back.out(2)', duration: 0.9, delay: 0.3, onComplete(){
      gs.to([stop1, stop2], { attr: { 'stop-color': (i) => i === 0 ? '#103a8a' : '#5fb3ff' }, duration: 0.8, ease: 'sine.inOut', onComplete(){
        window.dispatchEvent(new Event('titleReady'));
      }});
    }});
  }, []);

  return html`
    <div className="title-svg" ref=${wrapRef}>
      <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMid meet" style=${{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="title-grad" x1="0" y1="0" x2="1" y2="0">
            <stop id="title-stop-1" offset="0%" stop-color="#38a3ff" />
            <stop id="title-stop-2" offset="100%" stop-color="#38a3ff" />
          </linearGradient>
        </defs>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              fill="url(#title-grad)" style=${{ fontSize: 'clamp(300px, 16vw, 220px)' }} font-family="ZCOOL KuaiLe, Baloo 2, sans-serif">
          ${text.split('').map(ch => html`<tspan>${ch}</tspan>`)}
        </text>
      </svg>
    </div>
  `;
}
