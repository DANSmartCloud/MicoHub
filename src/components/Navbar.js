import React from 'https://esm.sh/react@18.3.1';
import { html } from '../utils/html.js';

export default function Navbar() {
  return html`
    <header className="navbar glass">
      <div className="navbar-inner">
        <div className="brand">米可集公益服</div>
        <nav className="nav">
          <a href="#">社区</a>
          <a href="#games">游戏</a>
          <a href="#">加入</a>
        </nav>
      </div>
    </header>
  `;
}
