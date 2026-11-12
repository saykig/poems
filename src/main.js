import { PageFlip } from 'page-flip';
import '@fontsource/im-fell-english/400.css';
import '@fontsource/im-fell-english/400-italic.css';
import poems from '../content/poems.json';
import '@fontsource/cormorant-garamond/400.css';
import './style.css';

const coverStars = () => Array.from({length:22}, () => `<span class="cover-spark" aria-hidden="true" style="left:${5+Math.random()*90}%;top:${4+Math.random()*92}%;--duration:${4+Math.random()*5}s;--delay:${-Math.random()*9}s"></span>`).join('');
const ornament = '<span class="ornament" aria-hidden="true">❦</span>';
const escape = text => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function lineHTML(line, index) {
  return `<span class="poem-line${line.italic ? ' italic' : ''}" style="--indent:${line.indent}" data-line="${index}">${escape(line.text)}</span>`;
}
function stanzaHTML(stanza, offset = 0) {
  return `<p class="stanza">${stanza.map((line, i) => lineHTML(line, offset + i)).join('')}</p>`;
}
function leaf(classes, html, poemId) {
  const page = document.createElement('article');
  page.className = `page ${classes}`;
  page.innerHTML = html;
  if (poemId) page.dataset.poemId = poemId;
  if (classes.includes('cover')) page.dataset.density = 'hard';
  return page;
}
const position = document.querySelector('#book-position');
const stage = document.querySelector('.stage');
const status = document.querySelector('#page-status');
const toggle = document.querySelector('#reading-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let flip, pages = [], book, previousWidth = 0;

// Measure actual typeset stanzas at this viewport; move whole stanzas where possible.
// If a stanza cannot fit on an empty leaf, split only between original lines.
function paginate(poem, width, height) {
  const pageClass = 'poem-page';
  const probe = leaf(`${pageClass} measuring`, '<div class="poem-flow"></div>', poem.id);
  Object.assign(probe.style, {width:`${width}px`,height:`${height}px`});
  document.body.append(probe);
  const flow = probe.querySelector('.poem-flow');
  const chunks = [];
  let offset = 0;
  const heading = () => chunks.length ? '' : `<h2>${escape(poem.title)}</h2>`;
  flow.innerHTML = heading();
  const fits = () => flow.scrollHeight <= flow.clientHeight + 1;
  const save = () => { chunks.push(flow.innerHTML); flow.innerHTML = heading(); };
  for (const stanza of poem.stanzas) {
    const p = document.createElement('p'); p.className = 'stanza';
    p.innerHTML = stanza.map((line, i) => lineHTML(line, offset + i)).join('');
    const hadContent = Boolean(flow.querySelector('.stanza'));
    flow.append(p);
    if (!fits()) {
      p.remove();
      if (hadContent) save();
      flow.append(p);
      if (!fits()) {
        p.remove();
        let fragment = document.createElement('p'); fragment.className = 'stanza'; flow.append(fragment);
        for (let i = 0; i < stanza.length; i++) {
          const holder = document.createElement('span'); holder.innerHTML = lineHTML(stanza[i], offset + i);
          const line = holder.firstElementChild; fragment.append(line);
          if (!fits() && fragment.children.length > 1) {
            line.remove(); save();
            fragment = document.createElement('p'); fragment.className = 'stanza';
            fragment.append(line); flow.append(fragment);
          }
        }
      }
    }
    offset += stanza.length;
  }
  if (flow.querySelector('.stanza')) chunks.push(flow.innerHTML);
  probe.remove();
  return chunks.map(html => leaf(pageClass, `<div class="poem-flow">${html}</div>`, poem.id));
}
function renderBook() {
  const width = stage.clientWidth / (matchMedia('(max-width:700px)').matches ? 1 : 2);
  if (Math.abs(previousWidth - width) < 1 && flip) return;
  previousWidth = width;
  const height = width * 580 / 430;
  const oldPage = pages[flip?.getCurrentPageIndex() ?? 0];
  const oldPoem = oldPage?.dataset.poemId;
  const oldLine = Number(oldPage?.querySelector('[data-line]')?.dataset.line ?? 0);
  if (flip) flip.destroy();
  position.innerHTML = '<div id="book" tabindex="0" role="group" aria-label="Poetry book. Drag a corner or use the left and right arrow keys to turn pages."></div>';
  book = position.querySelector('#book');
  pages = [
    leaf('cover', `${coverStars()}<div class="cover-frame"><h2>SELECTED<br>POEMS</h2><p class="cover-author">SARA KIM</p></div>`),
    leaf('bookplate', `<div class="dedication"><p>To you</p></div>`),
    leaf('contents-page', '<div class="contents-inner"><h2>Contents</h2><nav class="toc" aria-label="Poems"></nav></div>'),
  ];
  const starts = [];
  for (const poem of poems) {
    starts.push(pages.length);
    pages.push(...paginate(poem, width, height));
  }
  pages.push(leaf('cover back-cover', `<div class="cover-frame"><p class="cover-author">SARA KIM</p></div>`));
  pages[2].querySelector('.toc').innerHTML = poems.map((poem, i) => `<button data-page="${starts[i]}"><span>${escape(poem.title)}</span><span>${starts[i]}</span></button>`).join('');
  pages.forEach((p, i) => {
    if (i > 0 && i < pages.length - 1) p.insertAdjacentHTML('beforeend', `<span class="page-number" aria-hidden="true">${i}</span>`);
    book.append(p);
  });
  flip = new PageFlip(book, {width,height,size:'fixed',showCover:true,usePortrait:true,
    maxShadowOpacity:.28,flippingTime:reducedMotion.matches ? 1 : 900,
    mobileScrollSupport:false,showPageCorners:true,disableFlipByClick:true});
  flip.on('init', sync); flip.on('flip', sync); flip.on('changeOrientation', sync);
  flip.on('changeState', e => {
    if (['user_fold','flipping'].includes(e.data) && flip.getCurrentPageIndex() === 0) position.classList.remove('closed');
    if (e.data === 'read') sync();
  });
  flip.loadFromHTML(pages);
  if (oldPoem) {
    const index = pages.findIndex(p => p.dataset.poemId === oldPoem && [...p.querySelectorAll('[data-line]')].some(l => Number(l.dataset.line) === oldLine));
    const restoredIndex = index >= 0 ? index : pages.findIndex(p => p.dataset.poemId === oldPoem);
    if (restoredIndex >= 0) flip.turnToPage(restoredIndex);
  }
  book.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => flip.turnToPage(Number(button.dataset.page))));
}
function sync() {
  const index = flip.getCurrentPageIndex();
  const portrait = flip.getOrientation() === 'portrait';
  const closed = index === 0 || index === pages.length - 1;
  position.classList.toggle('closed', index === 0 && !portrait);
  position.classList.toggle('back-closed', index === pages.length - 1 && !portrait);
  position.classList.toggle('portrait', portrait);
  status.textContent = index === 0 ? 'Front cover' : index === pages.length - 1 ? 'Back cover' : `Pages ${index}${portrait ? '' : ` and ${index + 1}`}`;
  document.querySelector('#gesture').textContent = index === 0 ? 'Pull the cover’s lower corner to begin' : 'Pull a page corner to turn';
  document.querySelector('.toolbar').classList.toggle('on-cover', closed);
  pages.forEach((p, i) => {
    const visible = i === index || (!portrait && !closed && i === index + 1);
    p.setAttribute('aria-hidden', String(!visible));
    p.querySelectorAll('button').forEach(b => b.tabIndex = visible ? 0 : -1);
  });
}
function turn(direction) {
  const index = flip.getCurrentPageIndex();
  if (direction > 0 && index < pages.length - 1) reducedMotion.matches ? flip.turnToNextPage() : flip.flipNext();
  if (direction < 0 && index > 0) reducedMotion.matches ? flip.turnToPrevPage() : flip.flipPrev();
}
const readingView = document.querySelector('#reading-view');
readingView.innerHTML = `<h2 class="reading-title">Selected Poems</h2><p class="byline">Sara Kim</p><nav class="reading-toc" aria-label="Poems">${poems.map(p => `<a href="#read-${p.id}">${escape(p.title)}</a>`).join('')}</nav>${poems.map(p => `<article id="read-${p.id}" class="reading-poem" data-poem-id="${p.id}"><h2>${escape(p.title)}</h2>${p.stanzas.map(stanza => stanzaHTML(stanza)).join('')}</article>`).join('')}`;
function setReading(reading) {
  readingView.hidden = !reading;
  document.querySelector('#experience').hidden = reading;
  toggle.setAttribute('aria-pressed', String(reading));
  toggle.textContent = reading ? 'Back to the book' : 'Reading view';
  if (!reading) requestAnimationFrame(() => { renderBook(); flip.update(); sync(); });
}
toggle.addEventListener('click', () => setReading(toggle.getAttribute('aria-pressed') !== 'true'));
document.querySelector('#contents').addEventListener('click', () => {
  setReading(false); requestAnimationFrame(() => flip.turnToPage(flip.getOrientation() === 'portrait' ? 2 : 1));
});
document.addEventListener('keydown', e => {
  if (toggle.getAttribute('aria-pressed') === 'true' || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
  if (e.key === 'Home') { e.preventDefault(); flip.turnToPage(0); }
});
await document.fonts.ready;
renderBook();
let resizeTimer;
new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  if (!document.querySelector('#experience').hidden) resizeTimer = setTimeout(renderBook, 180);
}).observe(stage);

let lastDust = 0;
document.querySelector('#experience').addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || reducedMotion.matches || performance.now()-lastDust < 45) return;
  lastDust = performance.now();
  const dust = document.createElement('span');
  dust.className = 'star-dust'; dust.setAttribute('aria-hidden','true');
  dust.style.cssText = `left:${event.clientX}px;top:${event.clientY}px;--dx:${Math.random()*16-8}px`;
  document.body.append(dust);
  dust.addEventListener('animationend', () => dust.remove(), {once:true});
});
