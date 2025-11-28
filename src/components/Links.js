import React, { useEffect, useRef } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';

export default function Links() {
  const rowRef = useRef(null);
  useEffect(() => {
    const gs = window.gsap; if (!gs) return;
    gs.from(rowRef.current.children, { opacity: 0, y: 30, scale: 0.96, stagger: 0.08, duration: 0.6, ease: 'power3.out' });
  }, []);
  return html`
    <section id="links" className="section">
      <div className="glass hero-card">
        <h3 className="section-title">社区链接</h3>
        <div className="cta-row" ref=${rowRef}>
          <a className="btn" href="https://www.heyunq.com" target="_blank" rel="noreferrer">${iconCloud()}<span>禾云大社区</span></a>
          <a className="btn" href="https://jq.qq.com/?k=example" target="_blank" rel="noreferrer">${iconQQ()}<span>QQ群</span></a>
          <a className="btn" href="https://fanbook.cn" target="_blank" rel="noreferrer">${iconFB()}<span>Fanbook</span></a>
          <a className="btn" href="https://discord.gg/example" target="_blank" rel="noreferrer">${iconDiscord()}<span>Discord</span></a>
        </div>
      </div>
    </section>
  `;
}

function iconCloud(){return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15a4 4 0 0 0 4 4h9a4 4 0 0 0 0-8h-1.5a5.5 5.5 0 0 0-10.5 2"/></svg>`}
function iconQQ(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5zm-6 14c2 3 4 4 6 4s4-1 6-4c0-1-2-3-3-3-1 0-1 1-3 1s-2-1-3-1c-1 0-3 2-3 3z"/></svg>`}
function iconFB(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3h-4a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm-1 5h2v2h-2v8h-2V10H9V8h4z"/></svg>`}
function iconDiscord(){return html`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6a18 18 0 0 0-4-1l-1 2a13 13 0 0 0-6 0L8 5a18 18 0 0 0-4 1c-1 2-2 5-2 9a18 18 0 0 0 6 2l1-2a9 9 0 0 0 6 0l1 2a18 18 0 0 0 6-2c0-4-1-7-2-9zM9 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>`}
