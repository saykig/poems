// Localized motion in the September painting; the original remains the fallback.
export function startLivingArt() {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let seaGlow;
 let seaMotion = !reduce.matches;
 const experience = document.querySelector('#experience');
 let motionEnabled=!reduce.matches;
 const control=document.createElement('button');control.type='button';control.textContent=motionEnabled?'Pause leaves':'Play leaves';control.setAttribute('aria-pressed',String(motionEnabled));control.style.cssText='position:fixed;right:24px;bottom:18px;z-index:60;padding:8px 14px;border:1px solid #ffffff40;border-radius:4px;background:#243a52;color:#f5eedb;font:14px Georgia;display:none';document.body.append(control);control.onclick=()=>{motionEnabled=!motionEnabled;control.textContent=motionEnabled?'Pause leaves':'Play leaves';control.setAttribute('aria-pressed',String(motionEnabled));};
 const seaControl = control.cloneNode();
 seaControl.textContent = seaMotion ? 'Pause twinkle' : 'Play twinkle';
 seaControl.onclick = () => {
   seaMotion = !seaMotion;
   seaControl.textContent = seaMotion ? 'Pause twinkle' : 'Play twinkle';
   seaControl.setAttribute('aria-pressed', String(seaMotion));
 };
 reduce.addEventListener('change', () => {
   seaMotion = !reduce.matches;
   seaControl.textContent = seaMotion ? 'Pause twinkle' : 'Play twinkle';
   seaControl.setAttribute('aria-pressed', String(seaMotion));
 });
 document.body.append(seaControl);
 const overlay=document.createElement('canvas'); overlay.setAttribute('aria-hidden','true');
 overlay.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50'; document.body.append(overlay);
 const ctx=overlay.getContext('2d'); let last=0, elapsed=0;
 const leaves=Array.from({length:9},(_,i)=>({phase:i/9,size:5+i%4,seed:i*2.399}));
 function frame(now){requestAnimationFrame(frame);if(now-last<33)return;const dt=Math.min((now-last)/1000,.05);last=now;
  const seaFigure = document.querySelector('.artwork-page[data-poem-id="i-wandered-through-the-sea"][aria-hidden="false"] figure');
  const seaVisible = seaFigure && !experience.hidden;
  seaControl.style.display = seaVisible ? 'block' : 'none';
  if (seaVisible && seaMotion && seaFigure.querySelector('img')?.naturalWidth && !document.body.dataset.artTurning) {
    if (seaGlow?.parentElement !== seaFigure) {
      seaGlow?.remove();
      seaGlow = createSeaGlow(seaFigure);
    }
    seaGlow.style.display = '';
  } else if (seaGlow) {
    seaGlow.style.display = 'none';
  }
  const page=document.querySelector('.artwork-page[data-poem-id="september"][aria-hidden="false"]');
  control.style.display=page&&!document.querySelector('#experience').hidden?'block':'none';
  const allowed=page&&!document.hidden&&motionEnabled&&!document.querySelector('#experience').hidden&&!document.body.dataset.artTurning;
  if(!allowed){overlay.style.display='none';return;}
  const img=page.querySelector('img');if(!img?.complete||!img.naturalWidth)return;
  elapsed+=dt;
  overlay.style.display='block';const d=Math.min(devicePixelRatio,2);if(overlay.width!==Math.round(innerWidth*d)||overlay.height!==Math.round(innerHeight*d)){overlay.width=Math.round(innerWidth*d);overlay.height=Math.round(innerHeight*d);}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
  const r=img.getBoundingClientRect();
  for(const l of leaves){const progress=(elapsed/19+l.phase)%1;const x=r.left+r.width*.82-progress*(r.left+r.width*.82+40);const y=r.top+r.height*(.22+.37*(l.seed%1))+progress*80+Math.sin(progress*9+l.seed)*24;const alpha=Math.min(progress*8,(1-progress)*8,1)*.72;
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(elapsed*.7+l.seed)*.8+progress*5);ctx.scale(1,.45+.35*Math.abs(Math.sin(elapsed+l.seed)));ctx.globalAlpha=alpha;ctx.fillStyle=['#8fa66b','#aac482','#708e55'][Math.floor(l.seed)%3];ctx.beginPath();ctx.moveTo(-l.size*1.5,0);ctx.quadraticCurveTo(0,-l.size,l.size*1.5,0);ctx.quadraticCurveTo(0,l.size,-l.size*1.5,0);ctx.fill();ctx.strokeStyle='#d0d7a0';ctx.lineWidth=.4;ctx.beginPath();ctx.moveTo(-l.size,0);ctx.lineTo(l.size,0);ctx.stroke();ctx.restore();
  }
 }
 requestAnimationFrame(frame);
}

// Coordinates are measured on a 645 × 870 copy of the sea illustration.
const seaStars = [
  [56, 22], [165, 47], [234, 33], [339, 102], [429, 47],
  [542, 78], [183, 114], [88, 148], [140, 181], [227, 175],
  [301, 153], [423, 133], [447, 199], [230, 218], [183, 246],
  [118, 270], [206, 294], [246, 284], [372, 264], [605, 240],
];

function createSeaGlow(figure) {
  const ns = 'http://www.w3.org/2000/svg';
  const overlay = document.createElementNS(ns, 'svg');
  overlay.setAttribute('class', 'sea-twinkle');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('viewBox', '0 0 645 870');
  overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none';

  const defs = document.createElementNS(ns, 'defs');
  const gradient = document.createElementNS(ns, 'radialGradient');
  gradient.id = 'sea-warm-light';
  for (const [offset, color, opacity] of [
    ['0%', '#fff5d4', 1], ['24%', '#ffdb97', 0.85],
    ['48%', '#ffbd79', 0.37], ['100%', '#ffad6b', 0],
  ]) {
    const stop = document.createElementNS(ns, 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    stop.setAttribute('stop-opacity', opacity);
    gradient.append(stop);
  }
  defs.append(gradient);
  overlay.append(defs);

  function addGlow(x, y, rx, ry, peak, duration, delay) {
    const light = document.createElementNS(ns, 'ellipse');
    for (const [name, value] of Object.entries({cx: x, cy: y, rx, ry, fill: 'url(#sea-warm-light)'})) {
      light.setAttribute(name, value);
    }
    light.style.opacity = '0';
    overlay.append(light);
    light.animate([{opacity: 0}, {opacity: peak}, {opacity: 0}], {
      duration, delay, iterations: Infinity, easing: 'ease-in-out',
    });
  }

  seaStars.forEach(([x, y], index) => {
    addGlow(x, y, 8 + index % 3, 10 + index % 3, 0.65 + (index % 3) * 0.09, 3000 + (index % 7) * 480, -index * 467 - 700);
  });
  addGlow(267, 197, 25, 28, 0.63, 6400, -1700);
  figure.append(overlay);
  return overlay;
}
