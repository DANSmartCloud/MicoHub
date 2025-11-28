import React, { useEffect, useRef } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';
import Title from './Title.js';

export default function Header() {
  const cardRef = useRef(null);
  useEffect(() => {
    const gs = window.gsap;
    if (!gs) return;
    gs.from(cardRef.current, { opacity: 0, y: 48, scale: 0.92, duration: 1.2, ease: 'power3.out' });
    const sub = cardRef.current.querySelector('.subtitle');
    if (sub) gs.from(sub, { opacity: 0, y: 22, duration: 0.6, ease: 'power2.out', delay: 0.2 });
    const minis = cardRef.current.querySelectorAll('.mini-card');
    if (minis.length) {
      gs.from(minis, { opacity: 0, y: 26, scale: 0.96, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)', delay: 0.25 });
      minis.forEach(el => {
        const tilt = (e) => {
          const r = el.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width;
          const my = (e.clientY - r.top) / r.height;
          const rx = (0.5 - my) * 12;
          const ry = (mx - 0.5) * 12;
          gs.to(el, { rotateX: rx, rotateY: ry, scale: 1.02, duration: 0.2, ease: 'sine.out' });
        };
        const leave = () => gs.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.3, ease: 'sine.out' });
        const bounce = () => gs.to(el, { scale: 0.96, duration: 0.08, yoyo: true, repeat: 1 });
        el.classList.add('card-3d', 'glass');
        el.addEventListener('pointermove', tilt);
        el.addEventListener('pointerleave', leave);
        el.addEventListener('click', bounce);
      });
    }
  }, []);
  return html`
    <section className="hero-full">
      <div ref=${cardRef}>
        ${Title({ text: '米可集公益服' })}
        <p className="subtitle">好玩尽在米可集</p>
        <div className="mini-cards"></div>
        <div className="cta-row" style=${{ justifyContent:'center', marginTop:'16px' }}>
          <a className="btn btn-primary" href="#games">立即开始</a>
        </div>
        <span className="scroll-arrow"></span>
      </div>
    </section>
  `;
}

function iconGame() {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="7" cy="12" r="1"/><circle cx="17" cy="12" r="1"/></svg>`;
}
function iconCloud(){return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15a4 4 0 0 0 4 4h9a4 4 0 0 0 0-8h-1.5a5.5 5.5 0 0 0-10.5 2"/></svg>`}
function iconQQ(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5zm-6 14c2 3 4 4 6 4s4-1 6-4c0-1-2-3-3-3-1 0-1 1-3 1s-2-1-3-1c-1 0-3 2-3 3z"/></svg>`}
function iconFB(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3h-4a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm-1 5h2v2h-2v8h-2V10H9V8h4z"/></svg>`}
function iconDiscord(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6a18 18 0 0 0-4-1l-1 2a13 13 0 0 0-6 0L8 5a18 18 0 0 0-4 1c-1 2-2 5-2 9a18 18 0 0 0 6 2l1-2a9 9 0 0 0 6 0l1 2a18 18 0 0 0 6-2c0-4-1-7-2-9zM9 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>`}
