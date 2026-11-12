// Localized motion in the September painting; the original remains the fallback.
export function startLivingArt() {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let motionEnabled=!reduce.matches;
 const control=document.createElement('button');control.type='button';control.textContent=motionEnabled?'Pause leaves':'Play leaves';control.setAttribute('aria-pressed',String(motionEnabled));control.style.cssText='position:fixed;right:24px;bottom:18px;z-index:60;padding:8px 14px;border:1px solid #ffffff40;border-radius:4px;background:#243a52;color:#f5eedb;font:14px Georgia;display:none';document.body.append(control);control.onclick=()=>{motionEnabled=!motionEnabled;control.textContent=motionEnabled?'Pause leaves':'Play leaves';control.setAttribute('aria-pressed',String(motionEnabled));};
 const overlay=document.createElement('canvas'); overlay.setAttribute('aria-hidden','true');
 overlay.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:50'; document.body.append(overlay);
 const ctx=overlay.getContext('2d'); let last=0, elapsed=0;
 const leaves=Array.from({length:9},(_,i)=>({phase:i/9,size:5+i%4,seed:i*2.399}));
 function frame(now){requestAnimationFrame(frame);if(now-last<33)return;const dt=Math.min((now-last)/1000,.05);last=now;
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
