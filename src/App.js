import React, { useEffect } from 'https://esm.sh/react@18.3.1';
import { html } from './utils/html.js';
import BackgroundShapes from './components/BackgroundShapes.js';
import Navbar from './components/Navbar.js';
import Header from './components/Header.js';
import Games from './components/Games.js';
import Footer from './components/Footer.js';
import { detectLowEnd } from './utils/perf.js';

export default function App() {
  const lowEnd = detectLowEnd();
  useEffect(() => {
    document.documentElement.classList.toggle('low-end', lowEnd);
  }, [lowEnd]);

  useEffect(() => {
    const gs = window.gsap; if (!gs) return;
    function runAfterTitle(){
      const tl = gs.timeline();
      tl.from('.mini-card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.5, ease: 'power2.out' })
        .from('.btn-primary', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from('#games .section-title', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' })
        .from('#games .cards > a', { opacity: 0, y: 40, scale: 0.96, stagger: 0.08, duration: 0.7, ease: 'power3.out' });
    }
    window.addEventListener('titleReady', runAfterTitle, { once: true });

    const clickBounce = (e) => {
      const el = e.currentTarget;
      gs.to(el, { scale: 0.96, duration: 0.08, ease: 'power1.out', yoyo: true, repeat: 1 });
    };
    document.querySelectorAll('.card').forEach(el => {
      el.addEventListener('click', clickBounce);
    });
    const startBtn = document.querySelector('.btn-primary');
    const gamesEl = document.querySelector('#games');
    const onStart = (ev) => {
      ev.preventDefault();
      gamesEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    startBtn?.addEventListener('click', onStart);
    return () => {
      document.querySelectorAll('.card').forEach(el => {
        el.removeEventListener('click', clickBounce);
      });
      startBtn?.removeEventListener('click', onStart);
    };
  }, []);

  return html`
    <div className="app">
      <${BackgroundShapes} count=${lowEnd ? 24 : 64} lowEnd=${lowEnd} />
      <${Navbar} />
      <main className="wrap parallax">
        <section id="hero"><${Header} /></section>
        <section id="games"><${Games} /></section>
        <${Footer} />
      </main>
    </div>
  `;
}
