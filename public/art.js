// Comic panel art in the style of an ink-drawn manhwa page: black ink, halftone
// screentone, cross-hatching and one spot colour. Drawn in SVG so the app ships no
// image files. window.ART.scene(name) returns an <svg> string.
(function () {
  const K = '#1b1510', P = '#f6eedb', R = '#b8321f', G = '#d9a22b', W = 400, H = 240;
  const r1 = (v) => Math.round(v * 10) / 10;

  // Shared patterns and the wobbly "ink" filter, defined once for the whole page.
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <pattern id="ht" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.15" fill="${K}"/></pattern>
    <pattern id="ht2" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1.75" fill="${K}"/></pattern>
    <pattern id="htP" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.2" fill="${P}"/></pattern>
    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" stroke="${K}" stroke-width="1.3"/></pattern>
    <pattern id="xhatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0v7M0 0h7" stroke="${K}" stroke-width="1.1"/></pattern>
    <filter id="ink" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs></svg>`;

  // ---------- primitives ----------
  const rect = (x, y, w, h, f, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${ex}/>`;
  const path = (d, f = K, ex = '') => `<path d="${d}" fill="${f}" ${ex}/>`;
  const line = (d, w = 2, c = K, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
  const circ = (cx, cy, r, f, ex = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${ex}/>`;
  const g = (tr, inner) => `<g transform="${tr}">${inner}</g>`;
  const ink = (w = 2.5) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round"`;

  function wave(y, amp, len, x0 = -30, x1 = W + 30) {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`;
    return d;
  }
  const sea = (y, amp, len, f = K) => path(`${wave(y, amp, len)} V${H + 10} H-30 Z`, f);
  function waveLines(y0, y1, step, c = K, w = 1.4, amp = 3, len = 34) {
    let s = '';
    for (let y = y0, i = 0; y < y1; y += step, i++) s += line(wave(y, amp, len, -30 + (i % 2) * (len / 2)), w, c);
    return s;
  }
  // Manga focus lines radiating from a point.
  function rays(cx, cy, count, rIn, rOut, c = K, width = 0.35) {
    let d = '';
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (i % 3) * 0.02, b = a + (Math.PI / count) * width;
      d += `M${r1(cx + Math.cos(a) * rIn)} ${r1(cy + Math.sin(a) * rIn)}L${r1(cx + Math.cos(a) * rOut)} ${r1(cy + Math.sin(a) * rOut)}L${r1(cx + Math.cos(b) * rOut)} ${r1(cy + Math.sin(b) * rOut)}Z`;
    }
    return path(d, c);
  }
  function spiky(cx, cy, ro, ri, n, f, ex = '') {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? ri : ro;
      d += `${i ? 'L' : 'M'}${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`;
    }
    return path(d + 'Z', f, ex);
  }
  // Deterministic scatter so every render looks the same.
  function scatter(n, seed, fn) {
    let s = seed, out = '';
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < n; i++) out += fn(rnd(), rnd(), rnd(), i);
    return out;
  }

  function palm(x, y, h, lean = 10, sc = 1) {
    const tx = x + lean, ty = y - h;
    let s = line(`M${x} ${y} Q${x + lean * 0.15} ${y - h * 0.55} ${tx} ${ty}`, 6 * sc);
    for (let k = 1; k < 7; k++) s += line(`M${r1(x + (lean * k) / 8 - 3 * sc)} ${r1(y - (h * k) / 7)} l${6 * sc} -2`, 1.5, P);
    const leaves = [[-50, 10], [-40, -12], [-14, -28], [14, -26], [42, -12], [52, 12], [-28, 26], [30, 28]];
    for (const [dx0, dy0] of leaves) {
      const dx = dx0 * sc, dy = dy0 * sc;
      s += path(`M${tx} ${ty} Q${r1(tx + dx * 0.5)} ${r1(ty + dy * 0.5 - 10 * sc)} ${r1(tx + dx)} ${r1(ty + dy)} Q${r1(tx + dx * 0.5 + 2)} ${r1(ty + dy * 0.5 - 1)} ${tx} ${ty}Z`);
    }
    return s;
  }

  // A standing figure, feet at (x, y), about 66 units tall before scaling.
  function figure(x, y, sc = 1, o = {}) {
    const f = o.fill || K;
    let s = circ(0, -52, 7, f);
    s += o.skirt ? path('M-8 -44 Q0 -47 8 -44 L15 -3 Q0 1 -15 -3Z', f)
      : path('M-8 -44 Q0 -47 8 -44 L13 -14 Q0 -10 -13 -14Z', f) + path('M-7 -14 L-8 0 L-3 0 L-1 -14Z M1 -14 L3 0 L8 0 L7 -14Z', f);
    s += path('M-8 -42 L-13 -22 L-10 -21 L-5 -38Z', f);
    s += o.raise ? path('M7 -42 L15 -64 L19 -62 L10 -39Z', f) : o.point ? path('M7 -43 L26 -44 L26 -39 L7 -37Z', f) : path('M8 -42 L13 -22 L10 -21 L5 -38Z', f);
    if (o.crown) s += path('M-6 -57 L-7 -66 L-3 -61 L0 -68 L3 -61 L7 -66 L6 -57Z', G, ink(1.2));
    if (o.hat) s += path('M-15 -53 L0 -66 L15 -53 Q0 -50 -15 -53Z', f);
    if (o.cloth) s += path('M-8 -55 Q0 -64 8 -55 Q0 -58 -8 -55Z M7 -56 L13 -48 L9 -47Z', f);
    if (o.bun) s += circ(-5, -59, 3.5, f);
    if (o.spear) s += line(o.raise ? 'M18 -63 L24 -96' : 'M12 -78 L12 4', 2, f);
    if (o.flag) s += line('M18 -63 L22 -104', 2, f) + path('M22 -104 L46 -98 L23 -91Z', R, ink(1.5));
    return g(`translate(${x} ${y}) scale(${o.flip ? -sc : sc} ${sc})`, s);
  }

  function lion(x, y, sc = 1, flip = false) {
    let s = '';
    s += line('M-43 -42 Q-64 -40 -68 -62', 3);
    s += spiky(-68, -64, 5, 2.5, 7, K);
    s += path('M-31 -28 L-31 0 L-25 0 L-23 -26Z M21 -30 L22 0 L28 0 L27 -30Z');
    s += path('M-44 -46 Q-20 -56 22 -50 Q34 -48 36 -36 L37 0 L30 0 L27 -26 Q6 -22 -22 -26 L-25 0 L-33 0 L-36 -30 Q-48 -34 -44 -46Z', R, ink(2.5));
    s += path('M-36 -32 Q-10 -24 26 -28 L27 -26 Q6 -22 -22 -26Z', 'url(#hatch)');
    s += path('M28 -40 Q36 -28 33 -14 L29 -14 Q30 -28 24 -38Z', P, ink(1.5));
    s += spiky(36, -52, 22, 15, 15, K);
    s += circ(43, -50, 9.5, K);
    s += circ(46.5, -53, 2.2, P) + circ(47, -53, 1, K);
    s += line('M45 -45 q4 2 8 -1', 1.6, P);
    return g(`translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})`, s);
  }

  const rock = (x, y, w, h) => path(`M${x} ${y} L${x + w * 0.08} ${y - h * 0.8} L${x + w * 0.35} ${y - h} L${x + w * 0.7} ${y - h * 0.92} L${x + w * 0.95} ${y - h * 0.5} L${x + w} ${y}Z`, 'url(#xhatch)', ink(3))
    + path(`M${x + w * 0.7} ${y - h * 0.92} L${x + w * 0.95} ${y - h * 0.5} L${x + w} ${y} L${x + w * 0.62} ${y}Z`, K);

  function ship(x, y, sc = 1, tilt = 0) {
    let s = path('M-78 -10 L-64 16 L56 16 L82 -14 L60 -4 L-56 -4Z');
    s += line('M-66 2 L-92 28', 3.5) + line('M0 -4 L0 -104', 3.5);
    s += path('M-36 -94 Q0 -84 36 -94 L32 -24 Q0 -14 -32 -24Z', P, ink(2.5));
    s += path('M2 -88 Q20 -88 36 -94 L32 -24 Q16 -18 2 -17Z', 'url(#hatch)');
    s += path('M0 -104 L24 -98 L0 -92Z', R, ink(1.5));
    return g(`translate(${x} ${y}) rotate(${tilt}) scale(${sc})`, s);
  }
  function junk(x, y, sc = 1) {
    let s = path('M-88 -28 L-76 12 L58 12 L82 -10 L58 -2 L-62 -2 L-72 -28Z');
    s += path('M-8 -98 L32 -92 L38 -6 L-12 -6Z', R, ink(2.5));
    s += path('M-60 -68 L-30 -64 L-28 -6 L-56 -6Z', R, ink(2.5));
    for (let k = 1; k < 6; k++) s += line(`M${-8 - k * 0.6} ${-98 + k * 15.4} L${32 + k * 1.1} ${-92 + k * 14.4}`, 1.6);
    for (let k = 1; k < 4; k++) s += line(`M-58 ${-68 + k * 15} L-29 ${-64 + k * 14.5}`, 1.6);
    s += circ(-74, -14, 4, P, ink(1.5));
    return g(`translate(${x} ${y}) scale(${sc})`, s);
  }
  const sampan = (x, y, sc = 1) => g(`translate(${x} ${y}) scale(${sc})`, path('M-36 -6 Q0 14 36 -6 Q0 3 -36 -6Z'));
  function stilt(x, y, sc = 1) {
    let s = line('M-16 -18 L-16 6 M-4 -18 L-4 6 M8 -18 L8 6 M18 -18 L18 6', 2.2);
    s += rect(-22, -40, 44, 22, P, ink(2.2)) + rect(-4, -34, 10, 16, K);
    s += path('M-28 -40 L0 -60 L28 -40Z', 'url(#hatch)', ink(2.2));
    return g(`translate(${x} ${y}) scale(${sc})`, s);
  }
  function gopuram(x, y, sc = 1) {
    let s = '';
    for (let i = 0; i < 7; i++) {
      const w = 116 - i * 14, yb = -i * 17, yt = yb - 17;
      s += path(`M${-w / 2} ${yb} L${w / 2} ${yb} L${w / 2 - 6} ${yt} L${-w / 2 + 6} ${yt}Z`, i % 2 ? 'url(#ht)' : P, ink(2));
      for (let k = -w / 2 + 14; k < w / 2 - 10; k += 12) s += rect(r1(k), yt + 5, 5, 8, K);
    }
    s += path('M-28 -119 Q0 -142 28 -119Z', K);
    for (const k of [-14, 0, 14]) s += line(`M${k} -128 L${k} -140`, 2) + circ(k, -142, 2.4, G, ink(1));
    s += path('M-14 0 L-14 -12 Q0 -26 14 -12 L14 0Z', K);
    return g(`translate(${x} ${y}) scale(${sc})`, s);
  }
  function stoneLion(x, y, sc = 1) {
    let s = rect(-14, -14, 28, 14, 'url(#hatch)', ink(2));
    s += path('M-12 -14 Q-12 -30 0 -32 Q12 -30 10 -14Z', P, ink(2));
    s += spiky(0, -36, 11, 7, 10, K) + circ(0, -36, 5, P, ink(1.5));
    return g(`translate(${x} ${y}) scale(${sc})`, s);
  }
  function cgate(x, y, sc = 1) {
    let s = rect(-62, -96, 13, 96, R, ink(2.5)) + rect(49, -96, 13, 96, R, ink(2.5));
    s += rect(-72, -106, 144, 13, K) + rect(-26, -92, 52, 18, P, ink(2));
    s += line('M-16 -83 h32', 2);
    s += path('M-106 -104 Q-78 -108 -80 -130 L80 -130 Q78 -108 106 -104 Q60 -118 0 -118 Q-60 -118 -106 -104Z', K);
    s += line('M-80 -130 L80 -130', 3);
    for (const k of [-36, 36]) s += line(`M${k} -93 v8`, 1.5) + circ(k, -77, 8, R, ink(2)) + line(`M${k - 8} -77 h16`, 1, K);
    s += stoneLion(-86, 0) + stoneLion(86, 0);
    return g(`translate(${x} ${y}) scale(${sc})`, s);
  }
  function crowd(x0, y, n, step, seed = 3) {
    return scatter(n, seed, (a, b, c, i) => {
      const x = x0 + i * step + (a - 0.5) * 10, hy = y - 30 - b * 8;
      let s = path(`M${r1(x - 14)} ${y + 2} Q${r1(x - 14)} ${r1(hy + 12)} ${r1(x)} ${r1(hy + 10)} Q${r1(x + 14)} ${r1(hy + 12)} ${r1(x + 14)} ${y + 2}Z`);
      s += circ(r1(x), r1(hy), 8, K);
      if (c < 0.3) s += path(`M${r1(x - 15)} ${r1(hy - 2)} L${r1(x)} ${r1(hy - 14)} L${r1(x + 15)} ${r1(hy - 2)}Z`);
      else if (c < 0.55) s += path(`M${r1(x - 8)} ${r1(hy - 4)} Q${r1(x)} ${r1(hy - 14)} ${r1(x + 8)} ${r1(hy - 4)}Z`);
      return s;
    });
  }
  const skyTone = (h = 100, id = 'ht') => rect(0, 0, W, h, `url(#${id})`, 'opacity=".55"') + rect(0, 0, W, h * 0.45, `url(#${id})`, 'opacity=".5"');
  const birds = (pts) => pts.map(([x, y, s = 1]) => line(`M${x - 7 * s} ${y - 3 * s} q${4 * s} -2 ${7 * s} 3 q${3 * s} -5 ${7 * s} -3`, 1.6)).join('');
  const crownShape = (x, y, sc, rot) => g(`translate(${x} ${y}) rotate(${rot}) scale(${sc})`,
    path('M-20 0 L-24 -22 L-12 -10 L0 -28 L12 -10 L24 -22 L20 0Z', G, ink(2)) + rect(-21, -4, 42, 6, G, ink(1.5))
    + circ(0, -1, 2.6, R) + circ(-11, -1, 2, R) + circ(11, -1, 2, R) + circ(0, -28, 2.4, R) + circ(-24, -22, 2, P) + circ(24, -22, 2, P));

  // ---------- scenes ----------
  const S = {
    temple: () => skyTone(90) + circ(300, 70, 34, R, ink(2.5)) + birds([[60, 50], [84, 40, 0.8], [250, 36, 0.7]])
      + palm(40, 222, 124, 14) + palm(366, 224, 112, -12)
      + gopuram(170, 214, 1.25) + rect(-10, 212, W + 20, 40, K) + figure(268, 214, 0.95, { cloth: true }),

    hill: () => skyTone(80) + circ(318, 58, 22, R, ink(2)) + waveLines(140, 236, 11) + rect(170, 128, 240, 2, K)
      + ship(352, 142, 0.25) + sampan(286, 160, 0.55) + sampan(240, 196, 0.7) + birds([[260, 60], [282, 74, 0.8]])
      + path('M-10 250 L-10 118 Q60 70 150 94 Q206 112 232 164 Q250 206 262 250Z', K)
      + path('M-10 250 L-10 150 Q50 120 120 130 Q170 140 200 250Z', 'url(#htP)', 'opacity=".5"')
      + figure(112, 86, 1.05, { point: true, cloth: true }),

    storm: () => rect(0, 0, W, H, 'url(#ht2)') + rect(0, 0, W, 90, K, 'opacity=".75"')
      + scatter(46, 11, (a, b) => line(`M${r1(a * 440)} ${r1(b * 200)} l-10 22`, 1.3, P, 'opacity=".75"'))
      + path('M262 0 L238 62 L258 62 L226 134 L282 48 L258 48 L280 0Z', P, ink(2))
      + ship(196, 164, 0.86, -16)
      + sea(178, 18, 84) + line(wave(196, 8, 60), 2.2, P) + line(wave(216, 6, 48, -10), 2, P)
      + path('M300 186 Q330 140 372 150 Q344 156 352 176 Q330 166 316 190Z', P, ink(2)),

    crown: () => rays(210, 104, 54, 64, 330) + circ(210, 104, 64, P)
      + path('M-20 260 L76 158 L104 172 L10 270Z', K) + circ(98, 156, 19, K) + line('M84 146 q8 -8 18 -4', 2, P)
      + line('M120 150 Q160 118 186 106', 2) + line('M126 166 Q170 136 194 124', 2) + line('M136 134 Q166 108 182 96', 1.5)
      + crownShape(222, 106, 2.3, 24)
      + sea(212, 7, 46) + spiky(318, 214, 26, 12, 9, P, ink(2)) + line('M318 186 v-14 M300 192 l-8 -10 M336 192 l8 -10', 2),

    beach: () => skyTone(70) + circ(92, 58, 26, R, ink(2)) + rect(0, 118, W, 2, K)
      + waveLines(128, 170, 9) + sampan(156, 142, 0.6) + figure(156, 138, 0.38, { skirt: true, bun: true, raise: true })
      + path('M-10 172 Q200 150 410 168 V250 H-10Z', 'url(#ht)', ink(2.5)) + ship(256, 168, 0.66, 6)
      + scatter(18, 5, (a, b) => line(`M${r1(a * 400)} ${r1(196 + b * 40)} l6 0`, 1.2))
      + palm(36, 240, 152, 22) + palm(374, 240, 132, -18),

    jungle: () => rect(0, 0, W, H, 'url(#ht)', 'opacity=".55"')
      + scatter(7, 21, (a, b, c, i) => rect(r1(i * 60 + a * 20 - 10), 0, r1(16 + c * 14), H, K))
      + scatter(7, 4, (a, b, c, i) => line(`M${r1(i * 60 + 30)} 0 Q${r1(i * 60 + 10 + a * 40)} ${r1(60 + b * 50)} ${r1(i * 60 + 24)} ${r1(130 + c * 40)}`, 1.6))
      + path('M-10 214 Q200 202 410 216 V250 H-10Z', 'url(#xhatch)', ink(2.5)) + rect(60, 150, 280, 70, P, 'opacity=".55"')
      + figure(176, 206, 0.9, { spear: true, cloth: true }) + figure(210, 208, 0.82, { skirt: true, bun: true }) + figure(240, 207, 0.86, { spear: true })
      + palm(-30, 120, 10, 30, 1.6) + palm(430, 110, 10, -30, 1.6) + palm(200, -40, 10, 0, 1.3),

    beast: () => rays(250, 120, 44, 92, 330) + rock(110, 252, 260, 92)
      + lion(250, 160, 1.5, true)
      + palm(-24, 70, 10, 26, 1.4) + palm(-6, 250, 120, 8, 1) + path('M-10 230 Q60 214 120 232 V250 H-10Z', K),

    night: () => rect(0, 0, W, H, K) + rect(0, 0, W, 130, 'url(#htP)', 'opacity=".35"')
      + circ(334, 48, 18, P) + scatter(20, 8, (a, b) => circ(r1(a * 400), r1(b * 110), r1(0.8 + a), P))
      + `<ellipse cx="200" cy="198" rx="170" ry="70" fill="${G}" opacity=".32"/><ellipse cx="200" cy="200" rx="90" ry="38" fill="${G}" opacity=".45"/>`
      + rect(-10, 214, W + 20, 40, K)
      + line('M182 214 L218 200 M182 200 L218 214', 4, P)
      + path('M188 204 Q182 178 200 152 Q202 174 210 168 Q220 186 212 204Z', R) + path('M195 204 Q192 186 201 172 Q206 190 206 204Z', G)
      + figure(112, 214, 0.9, { cloth: true }) + figure(150, 216, 0.75, { spear: true }) + figure(262, 216, 0.82, { skirt: true, bun: true }) + figure(298, 214, 0.9, { point: true, flip: true }),

    market: () => skyTone(60) + [0, 1, 2].map((i) => {
      const x = 14 + i * 132;
      let s = line(`M${x + 6} 70 V150 M${x + 116} 70 V150`, 3);
      for (let k = 0; k < 6; k++) s += path(`M${x + k * 20} 70 L${x + k * 20 + 20} 70 L${x + k * 20 + 17} 48 L${x + k * 20 + 3} 48Z`, k % 2 ? P : R, ink(2));
      for (let k = 0; k < 6; k++) s += path(`M${x + k * 20} 70 q10 12 20 0Z`, k % 2 ? P : R, ink(1.5));
      s += rect(x, 128, 124, 22, K) + `<ellipse cx="${x + 30}" cy="122" rx="14" ry="9" fill="${P}" ${ink(2)}/>` + `<ellipse cx="${x + 64}" cy="118" rx="10" ry="14" fill="url(#hatch)" ${ink(2)}/>`
        + path(`M${x + 84} 128 q12 -16 24 0Z`, P, ink(2));
      return s;
    }).join('') + rect(-10, 150, W + 20, 100, 'url(#ht)', 'opacity=".5"') + crowd(26, 244, 8, 50),

    proclaim: () => rays(200, 30, 60, 30, 340, K, 0.18) + circ(200, 30, 30, R, ink(2.5))
      + path('M70 250 L120 150 Q200 124 280 150 L330 250Z', K) + path('M120 150 Q200 124 280 150 L270 160 Q200 140 130 160Z', 'url(#htP)', 'opacity=".6"')
      + figure(200, 140, 1.5, { flag: true, raise: true, cloth: true }) + crowd(-10, 252, 9, 52, 9),

    stars: () => rect(0, 0, W, H, K) + rect(0, 0, W, 150, 'url(#htP)', 'opacity=".25"') + rect(0, 140, W, 36, P, 'opacity=".22"')
      + scatter(46, 17, (a, b, c) => circ(r1(a * 400), r1(b * 140), r1(0.6 + c * 1.2), P))
      + line('M60 40 L104 30 L140 52 L180 44', 1, P, 'opacity=".7"') + spiky(286, 46, 15, 3, 4, G) + circ(286, 46, 4, P)
      + waveLines(184, 240, 10, P, 1.3) + ship(196, 186, 0.78, 2) + line('M-10 176 H410', 1.5, P),

    calm: () => skyTone(110) + circ(292, 68, 34, P, ink(2.5)) + rect(-10, 150, W + 20, 100, K)
      + scatter(16, 3, (a, b, c, i) => line(`M${r1(270 + (a - 0.5) * (14 + i * 3))} ${158 + i * 5} h${r1(10 + c * 26)}`, 2, P))
      + waveLines(170, 240, 14, P, 1, 1.5, 40)
      + stilt(70, 150) + stilt(132, 152, 0.8) + ship(356, 150, 0.28) + birds([[150, 60], [176, 52, 0.8]]),

    boats: () => skyTone(80) + rect(-10, 150, W + 20, 2, K) + waveLines(160, 240, 12)
      + stilt(56, 152) + stilt(124, 150, 0.82) + stilt(186, 154, 0.92)
      + sampan(340, 172, 0.7) + sampan(282, 202, 1.25) + figure(282, 196, 1.05, { skirt: true, bun: true, spear: true })
      + birds([[300, 50], [324, 62, 0.8], [270, 70, 0.6]]),

    junk: () => skyTone(80) + path('M-10 140 Q40 110 90 124 Q130 134 160 140Z', K) + palm(30, 132, 40, 6, 0.5) + palm(70, 126, 36, -4, 0.45)
      + rect(-10, 140, W + 20, 2, K) + waveLines(150, 240, 11) + junk(220, 184, 1.12)
      + figure(150, 180, 0.62, { hat: true, point: true }) + birds([[330, 50], [352, 62, 0.8]]),

    gate: () => skyTone(80) + rect(-10, 222, W + 20, 30, K) + cgate(200, 224, 1.25) + birds([[52, 40], [74, 52, 0.8]]),

    // Meeting-point map: Fort Canning Hill, the river, Hill Street, the café pin (1), MRT (2), bus stop (3).
    map: () => {
      const road = (d, w = 16) => line(d, w + 5, K) + line(d, w, P);
      const marker = (x, y, n, f = K, c = P) => circ(x, y, 13, f, ink(2.5)) + `<text x="${x}" y="${y + 5.5}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="${c}">${n}</text>`;
      let s = rect(0, 0, W, H, 'url(#ht)', 'opacity=".28"');
      s += path('M-10 18 Q70 -10 160 22 Q196 58 168 104 Q120 132 52 118 Q-6 104 -10 60Z', 'url(#hatch)', ink(2.5));
      s += scatter(12, 31, (a, b) => circ(r1(20 + a * 130), r1(22 + b * 80), r1(5 + a * 3), K));
      s += g('translate(92 70) scale(.5)', path('M-40 0 L-40 -30 L0 -52 L40 -30 L40 0Z', P, ink(4)) + path('M-48 -28 L0 -58 L48 -28Z', R, ink(4)) + rect(-10, -22, 20, 22, K));
      const river = 'M-20 214 Q90 176 190 200 T420 170';
      s += line(river, 36, K) + line(river, 29, P) + line(river, 29, 'url(#ht)') + line('M30 206 q12 -5 24 0 M150 196 q12 -5 24 0 M300 184 q12 -5 24 0', 1.5);
      s += road('M0 136 L400 126') + road('M236 -10 L214 250') + road('M330 -10 L344 250', 12) + road('M236 60 L400 52', 10);
      s += [[252, 70, 70, 50], [352, 70, 48, 50], [256, 144, 76, 34], [362, 140, 38, 36], [130, 146, 74, 30]].map(([x, y, w, h]) => rect(x, y, w, h, 'url(#xhatch)', ink(2))).join('');
      s += line('M300 196 Q262 168 238 150 L228 128', 4, R, 'stroke-dasharray="2 9"');
      s += marker(300, 200, 2) + marker(258, 34, 3);
      s += g('translate(226 124)', path('M0 0 C-18 -20 -18 -44 0 -44 C18 -44 18 -20 0 0Z', R, ink(3)) + circ(0, -29, 9, P, ink(2)) + `<text x="0" y="-23.5" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="${K}">1</text>`);
      s += g('translate(372 30)', circ(0, 0, 15, P, ink(2)) + path('M0 -12 L5 3 L0 0 L-5 3Z', K) + `<text x="0" y="11" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="9" fill="${K}">N</text>`);
      return s;
    },

    cafe: () => rect(0, 0, W, H, 'url(#hatch)', 'opacity=".35"') + `<ellipse cx="200" cy="124" rx="150" ry="96" fill="${P}" ${ink(3)}/>`
      + `<ellipse cx="200" cy="124" rx="138" ry="86" fill="none" ${ink(1.2)}/>`
      + [[110, 72], [290, 72], [110, 176], [290, 176]].map(([x, y]) => circ(x, y, 17, P, ink(2.5)) + circ(x, y, 10, K) + path(`M${x + 15} ${y - 4} q10 4 0 10`, 'none', ink(2.5))).join('')
      + rect(168, 98, 64, 52, K, 'rx="6"') + rect(174, 104, 52, 24, P) + circ(182, 140, 4.5, R) + circ(200, 140, 4.5, G) + circ(218, 140, 4.5, '#2f6b4f')
      + line('M180 112 h40 M180 119 h28', 1.6),
  };

  function scene(name, label = '') {
    const draw = S[name] || S.beach;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}" class="scene">`
      + `${rect(0, 0, W, H, P)}<g filter="url(#ink)">${draw()}</g></svg>`;
  }

  document.body.insertAdjacentHTML('afterbegin', DEFS);
  window.ART = { scene, names: Object.keys(S) };
})();
