import './reading-sky.css';

// A reversible, scroll-linked sky. Nothing runs continuously when the reader is idle.
export function initReadingSky(view, reducedMotion) {
  const sky = document.createElement('div');
  sky.className = 'reading-sky';
  sky.hidden = true;
  sky.setAttribute('aria-hidden', 'true');
  sky.innerHTML = '<div class="reading-night"></div><div class="reading-day"></div><canvas></canvas>';
  document.body.prepend(sky);
  const canvas = sky.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  // Fixed seed makes the constellations stable across resizes and direction changes.
  let seed = 319;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const stars = Array.from({length: 150}, () => ({x:random(), y:random(), r:.4+random()*1.5, depth:.035+random()*.06, alpha:.2+random()*.55}));
  let frame = 0;
  let width = 0, height = 0;
  const clamp = n => Math.max(0, Math.min(1,n));
  function paint() {
    frame = 0;
    if (view.hidden) return;
    // Balance night and day across the current scrollable reading length.
    // ResizeObserver recalculates the journey when poems open or close.
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = clamp(scrollY / scrollRange);
    // Equal night/day holds, with dawn centered halfway through the reading.
    const dawn = clamp((progress - .3) / .4);
    const daylight = dawn * dawn * (3 - 2 * dawn);
    sky.style.setProperty('--daylight', daylight);
    // Switch ink at the midpoint, rather than interpolating through unreadable grey.
    document.body.classList.toggle('reading-daylight', daylight > .48);
    if (width !== innerWidth || height !== innerHeight) {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width*dpr; canvas.height = height*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    ctx.clearRect(0,0,width,height);
    const offset = reducedMotion.matches ? 0 : scrollY;
    stars.forEach(star => {
      const x = star.x * width;
      const y = ((star.y * (height+80) - offset*star.depth) % (height+80) + height+80) % (height+80)-40;
      ctx.fillStyle = `rgba(244,211,147,${star.alpha*(1-daylight)})`;
      ctx.beginPath(); ctx.arc(x,y,star.r,0,Math.PI*2); ctx.fill();
      if (star.r>1.65) {
        ctx.fillRect(x-.35,y-4,.7,8); ctx.fillRect(x-4,y-.35,8,.7);
      }
    });
    sky.style.setProperty('--cloud-shift', `${reducedMotion.matches ? 0 : -progress*22}px`);
  }
  const schedule = () => { if (!frame && !view.hidden) frame = requestAnimationFrame(paint); };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  new ResizeObserver(schedule).observe(view);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) view.getAnimations({subtree:true}).forEach(a=>a.finish());
    schedule();
  });

  view.addEventListener('click', event => {
    const button = event.target.closest('.poem-reveal');
    if (!button) return;
    const content = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    content.getAnimations({subtree:true}).forEach(a=>a.cancel());
    button.querySelectorAll('.reveal-dust').forEach(node=>node.remove());
    content.hidden = !open;
    if (open && !reducedMotion.matches) {
      const lines = [...content.querySelectorAll('.poem-line, .poem-date')];
      lines.forEach((line,i) => line.animate([
        {opacity:0,transform:'translateY(5px)'}, {opacity:1,transform:'translateY(0)'}
      ], {duration:600,delay:i*Math.min(65,900/Math.max(1,lines.length-1)),fill:'backwards',easing:'ease-out'}));
      for (let i=0;i<58;i++) {
        const dust=document.createElement('span');
        dust.className='reveal-dust'; dust.setAttribute('aria-hidden','true');
        dust.style.left=`${i/57*100}%`;
        button.append(dust);
        const animation=dust.animate([
          {opacity:0,transform:'translate(0, 0) scale(.5)'},
          {opacity:1,offset:.15},
          {opacity:0,transform:`translate(${Math.random()*36-18}px, ${10+Math.random()*42}px) scale(.1)`}
        ],{duration:900+Math.random()*700,delay:i*8,easing:'ease-out',fill:'both'});
        animation.onfinish=()=>dust.remove();
      }
    }
    schedule();
  });
  return reading => {
    sky.hidden=!reading;
    document.body.classList.toggle('is-reading',reading);
    if (!reading) document.body.classList.remove('reading-daylight');
    schedule();
  };
}
