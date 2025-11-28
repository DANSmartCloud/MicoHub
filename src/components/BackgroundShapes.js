import React, { useEffect, useMemo, useRef } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';

const COLORS = {
  red: ['#ff6b6b', '#ff8787'],
  green: ['#6eeb83', '#36d399'],
  blue: ['#64b5f6', '#38b6ff'],
  yellow: ['#ffd166', '#ffcc80']
};
const TYPES = ['circle', 'triangle', 'square', 'cross'];
const MIN_D = 0.1;
const MAX_D = 1.8;
function clamp01(x){ return Math.min(1, Math.max(0, x)); }
function normDepth(d){ return clamp01((d - MIN_D) / (MAX_D - MIN_D)); }
function blurPxForDepth(d, lowEnd){
  const n = normDepth(d);
  const base = lowEnd ? 5 : 8; // 最大叠加模糊
  const floor = 0.6; // 最小模糊避免硬边
  const v = Math.abs(Math.cos(Math.PI * n)); // 中间清晰，两端模糊
  return floor + base * v;
}
function opacityForDepth(d){
  const n = normDepth(d);
  const middle = 1 - Math.abs(2 * n - 1); // 中间高、两端低
  return 0.5 + 0.5 * middle;
}

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function BackgroundShapes({ count = 28, lowEnd = false }) {
  const containerRef = useRef(null);
  const shapes = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      const t = pick(TYPES);
      const c = pick(Object.values(COLORS));
      const size = rand(22, 120);
      const depth = rand(0.2, 1.2);
      const x = rand(0, 100);
      const y = rand(0, 100);
      return { t, c, size, depth, x, y };
    });
  }, [count]);

  useEffect(() => {
    const el = containerRef.current;
    const gs = window.gsap;
    if (!gs) return;
    const states = [];
    Array.from(el.children).forEach((node) => {
      const targetX = parseFloat(node.dataset.x) || 50;
      const targetY = parseFloat(node.dataset.y) || 50;
      const s = {
        node,
        depth: node.dataset.depth ? parseFloat(node.dataset.depth) : 1,
        idleX: 0,
        idleY: 0,
        reactiveX: 0,
        reactiveY: 0,
        baseX: 50,
        baseY: 50,
        targetX,
        targetY,
        setX: gs.quickTo(node, 'x', { duration: 0.25, ease: 'sine.out', overwrite: 'auto' }),
        setY: gs.quickTo(node, 'y', { duration: 0.25, ease: 'sine.out', overwrite: 'auto' }),
        zoom: 1,
        rot: 0,
        size: parseFloat(node.dataset.size) || 60,
        repelX: 0,
        repelY: 0
      };
      states.push(s);
      node.style.left = '50%';
      node.style.top = '50%';
      gs.set(node, { transformOrigin: '50% 50%', scale: s.depth, rotation: rand(-30,30) });
    });
    introBlast(gs, states, lowEnd, () => {
      states.forEach((s) => {
        startWander(gs, s, lowEnd);
        startRoam(gs, s, lowEnd);
        startDepthSpin(gs, s, lowEnd);
      });
    });

    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      states.forEach((s) => {
        const d = s.depth;
        const base = lowEnd ? 48 : 80;
        const dx = (mx - 0.5) * base * d;
        const dy = (my - 0.5) * base * d;
        const avoid = (lowEnd ? 30 : 46) / d;
        const bx = (mx * 100 - s.baseX) / 100;
        const by = (my * 100 - s.baseY) / 100;
        s.reactiveX = dx - avoid * bx;
        s.reactiveY = dy - avoid * by;
        s.setX(s.idleX + s.reactiveX);
        s.setY(s.idleY + s.reactiveY);
        s.node.style.filter = `blur(${blurPxForDepth(s.depth, lowEnd)}px)`;
      });
    }
    window.addEventListener('pointermove', onMove);
    function tick(){
      const rect = el.getBoundingClientRect();
      const n = states.length;
      const pos = new Array(n);
      const rad = new Array(n);
      for (let i=0;i<n;i++){
        const s = states[i];
        const px = s.baseX/100*rect.width + s.idleX + s.reactiveX + s.repelX;
        const py = s.baseY/100*rect.height + s.idleY + s.reactiveY + s.repelY;
        pos[i] = [px, py];
        rad[i] = (s.size/2) * s.depth * s.zoom;
      }
      for (let i=0;i<n;i++){
        for (let j=i+1;j<n;j++){
          const dx = pos[j][0] - pos[i][0];
          const dy = pos[j][1] - pos[i][1];
          const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;
          const minDist = rad[i] + rad[j];
          if (dist < minDist){
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;
            const tx = -ny;
            const ty = nx;
            const k = 0.5;
            const t = 0.25;
            const pushX = nx * overlap * k;
            const pushY = ny * overlap * k;
            const slideX = tx * overlap * t;
            const slideY = ty * overlap * t;
            states[i].repelX += -(pushX) + (slideX);
            states[i].repelY += -(pushY) + (slideY);
            states[j].repelX += (pushX) - (slideX);
            states[j].repelY += (pushY) - (slideY);
          }
        }
      }
      for (let i=0;i<n;i++){
        const s = states[i];
        s.repelX *= 0.9;
        s.repelY *= 0.9;
        if (s.repelX > 40) s.repelX = 40; if (s.repelX < -40) s.repelX = -40;
        if (s.repelY > 40) s.repelY = 40; if (s.repelY < -40) s.repelY = -40;
        s.setX(s.idleX + s.reactiveX + s.repelX);
        s.setY(s.idleY + s.reactiveY + s.repelY);
      }
    }
    gs.ticker.add(tick);
    function onDown(e){
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left);
      const my = (e.clientY - rect.top);
      states.forEach((s) => {
        const boxX = s.baseX / 100 * rect.width;
        const boxY = s.baseY / 100 * rect.height;
        const vx = boxX - mx;
        const vy = boxY - my;
        const dist = Math.sqrt(vx*vx + vy*vy);
        const dirX = vx / (dist || 1);
        const dirY = vy / (dist || 1);
        const amp = (lowEnd ? 40 : 80) * s.depth;
        const delay = dist / 900; // 波时序
        gs.to(s, {
          reactiveX: s.reactiveX + dirX * amp,
          reactiveY: s.reactiveY + dirY * amp,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          delay,
          onUpdate(){ s.setX(s.idleX + s.reactiveX); s.setY(s.idleY + s.reactiveY); }
        });
      });
    }
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      gs.ticker.remove(tick);
    };
  }, [lowEnd]);

  return html`
    <div className="bg-layer" ref=${containerRef} aria-hidden>
      ${shapes.map((s, i) => html`<${SVGShape} key=${i} data=${{...s}} lowEnd=${lowEnd} />`)}
    </div>
  `;
}

function startWander(gs, s, lowEnd){
  function loop(){
    const amp = (lowEnd ? 20 : 36) * s.depth;
    const tx = rand(-amp, amp);
    const ty = rand(-amp, amp);
    gs.to(s, {
      idleX: tx,
      idleY: ty,
      duration: rand(1.2, 2.2),
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
      onUpdate(){ s.setX(s.idleX + s.reactiveX); s.setY(s.idleY + s.reactiveY); },
      onComplete: loop
    });
  }
  loop();
}

function startRoam(gs, s, lowEnd){
  function roam(){
    const rect = s.node.parentElement.getBoundingClientRect();
    let nextX = s.baseX, nextY = s.baseY;
    let ok = false; let tries = 10; let best = { x: nextX, y: nextY, score: -Infinity };
    while (tries-- > 0) {
      const candX = Math.min(95, Math.max(5, s.baseX + rand(-25, 25)));
      const candY = Math.min(95, Math.max(5, s.baseY + rand(-25, 25)));
      const score = separationScore(candX, candY, s, rect);
      if (score > 0.6) { nextX = candX; nextY = candY; ok = true; break; }
      if (score > best.score) best = { x: candX, y: candY, score };
    }
    if (!ok) { nextX = best.x; nextY = best.y; }
    gs.to(s, {
      baseX: nextX,
      baseY: nextY,
      duration: (lowEnd ? rand(6, 10) : rand(8, 14)) / s.depth,
      ease: 'sine.inOut',
      onUpdate(){ s.node.style.left = s.baseX + '%'; s.node.style.top = s.baseY + '%'; },
      onComplete: roam
    });
  }
  roam();
}

function startDepthSpin(gs, s, lowEnd){
  s.dPhase = Math.random() < 0.5 ? 'up' : 'down';
  function cycle(){
    const up = s.dPhase === 'up';
    const targetDepth = up
      ? rand(1.0, 1.8)
      : rand(0.1, 0.6);
    const targetZoom = lowEnd ? rand(0.85, 1.15) : rand(0.75, 1.25);
    const targetRot = (s.rot || 0) + rand(-180, 180);
    gs.to(s, {
      depth: targetDepth,
      zoom: targetZoom,
      rot: targetRot,
      duration: rand(2, 4.5),
      ease: 'sine.inOut',
      onUpdate(){
        gs.set(s.node, { scale: s.depth * s.zoom, rotation: s.rot });
        s.node.style.filter = `blur(${blurPxForDepth(s.depth, lowEnd)}px)`;
        s.node.style.opacity = String(opacityForDepth(s.depth));
      },
      onComplete(){ s.dPhase = up ? 'down' : 'up'; cycle(); }
    });
  }
  cycle();
}

function separationScore(candX, candY, s, rect){
  const r1 = ((s.size / 2) * s.depth * s.zoom) / rect.width * 100;
  let minRatio = Infinity;
  const siblings = Array.from(s.node.parentElement.children);
  for (let i=0;i<siblings.length;i++){
    const n = siblings[i];
    if (n === s.node) continue;
    const depth = parseFloat(n.dataset.depth) || 1;
    const size = parseFloat(n.dataset.size) || 60;
    const zoom = 1;
    const r2 = ((size / 2) * depth * zoom) / rect.width * 100;
    const bx = parseFloat(n.style.left) || (parseFloat(n.dataset.x) || 50);
    const by = parseFloat(n.style.top) || (parseFloat(n.dataset.y) || 50);
    const dx = candX - bx;
    const dy = candY - by;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const ratio = dist / (r1 + r2 + 0.001);
    if (ratio < minRatio) minRatio = ratio;
  }
  return Math.min(minRatio, 2);
}

function introBlast(gs, states, lowEnd, onDone){
  const rect = states[0]?.node.parentElement.getBoundingClientRect();
  let doneCount = 0;
  const total = states.length;
  states.forEach((s) => {
    const dx = (s.targetX - 50);
    const dy = (s.targetY - 50);
    const dist = Math.sqrt(dx*dx + dy*dy);
    const delay = dist / 120; // 中心爆炸波时序
    gs.to(s, {
      baseX: s.targetX,
      baseY: s.targetY,
      duration: lowEnd ? 0.9 : 1.2,
      ease: 'power2.out',
      delay,
      onUpdate(){ s.node.style.left = s.baseX + '%'; s.node.style.top = s.baseY + '%'; },
      onComplete(){ doneCount++; if (doneCount === total) onDone?.(); }
    });
  });
}

function SVGShape({ data, lowEnd = false }) {
  const { t, c, size, depth, x, y } = data;
  const style = {
    left: `${x}%`,
    top: `${y}%`,
    transform: `translate(-50%, -50%)`,
    opacity: opacityForDepth(depth),
    filter: `blur(${blurPxForDepth(depth, lowEnd)}px)`
  };
  const [c1, c2] = c;
  const sw = Math.max(1.5, 3 * depth);
  const half = size/2;
  const gradId = `g${t}${size}${depth}`;
  return html`
    <div className=${`shape`} style=${style} data-depth=${depth} data-x=${x} data-y=${y} data-size=${size}>
      <svg width=${size} height=${size} viewBox=${`0 0 ${size+4} ${size+4}`}>
        <defs>
          <linearGradient id=${gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color=${c1} />
            <stop offset="100%" stop-color=${c2} />
          </linearGradient>
        </defs>
        ${t === 'circle' && html`<circle cx=${half} cy=${half} r=${half - sw} fill="none" stroke=${`url(#${gradId})`} stroke-width=${sw} />`}
        ${t === 'square' && html`<rect x=${sw} y=${sw} width=${size - sw*2} height=${size - sw*2} rx="8" ry="8" fill="none" stroke=${`url(#${gradId})`} stroke-width=${sw} />`}
        ${t === 'triangle' && html`<polygon points=${`${half},${sw} ${size-sw},${size-sw} ${sw},${size-sw}`} fill="none" stroke=${`url(#${gradId})`} stroke-width=${sw} />`}
        ${t === 'cross' && html`<g stroke=${`url(#${gradId})`} stroke-width=${sw}>
            <line x1=${sw} y1=${sw} x2=${size-sw} y2=${size-sw} />
            <line x1=${size-sw} y1=${sw} x2=${sw} y2=${size-sw} />
          </g>`}
      </svg>
    </div>
  `;
}
