import React, { useEffect, useRef } from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';

const items = [
  { title: '原神', desc: '冒险者聚集地，攻略与交流。', href: '#', color: '#64b5f6', img: 'https://picsum.photos/seed/genshin/600/360' },
  { title: '皇室战争', desc: '卡组分享与赛事讨论。', href: '#', color: '#ff6b6b', img: 'https://picsum.photos/seed/clashroyale/600/360' },
  { title: '海岛奇兵', desc: '部队战术与活动资讯。', href: '#', color: '#6eeb83', img: 'https://picsum.photos/seed/boombeach/600/360' },
  { title: 'Minecraft', desc: '服务器与创造交流。', href: '#', color: '#ffcc80', img: 'https://picsum.photos/seed/minecraft/600/360' }
];

export default function Games() {
  const gridRef = useRef(null);
  useEffect(() => {
    const gs = window.gsap; if (!gs) return;
    Array.from(gridRef.current.children).forEach(el => {
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
      el.classList.add('card-3d');
      el.addEventListener('pointermove', tilt);
      el.addEventListener('pointerleave', leave);
      el.addEventListener('click', bounce);
    });
  }, []);
  return html`
    <section id="games" className="section">
      <h3 className="section-title">游戏社区聚焦</h3>
      <div className="cards" ref=${gridRef}>
        ${items.map((it) => html`<a href=${it.href} className="card glass card-3d">
          <div className="card-media"><img className="card-img" src=${it.img} alt=${it.title} loading="lazy" /></div>
          <div className="card-body">
            <div style=${{ display:'flex', alignItems:'center' }}>
              <span className="icon" style=${{ background: it.color, borderRadius: 8 }} />
              <h4>${it.title}</h4>
            </div>
            <p>${it.desc}</p>
          </div>
        </a>`)}
      </div>
    </section>
  `;
}
