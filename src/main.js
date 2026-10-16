import { PageFlip } from 'page-flip';
import '@fontsource/im-fell-english/400.css';
import '@fontsource/im-fell-english/400-italic.css';
import './style.css';

const book = document.querySelector('#book');
const ornament = '<span class="ornament" aria-hidden="true">❦</span>';
const pages = [
  ['cover', `<div class="cover-frame"><span class="cover-top">A collection by Sara</span><h2>Selected<br>Poems</h2><div class="cover-picture" role="img" aria-label="An illustrated cottage garden"></div>${ornament}<p class="cover-author">SARA</p></div>`, true],
  ['bookplate', `<div class="bookplate-inner">${ornament}<p>From the bookshelf of</p><h2>Sara</h2><div class="bookplate-line"></div><p class="small-italic">A place for words<br>to make themselves at home.</p></div>`, false],
  ['title-page', `<p class="running-title">SELECTED POEMS</p><h2>In these pages</h2><div class="toc"><button data-page="3"><span>A place for a poem</span><span>3</span></button><button data-page="5"><span>A moment in the garden</span><span>5</span></button></div><p class="edition-note">The beginning of a collection.<br>More words will find their way here.</p>${ornament}<span class="page-number">2</span>`, false],
  ['poem-page', `<p class="running-title">SELECTED POEMS</p><div class="poem"><h2>A place for a poem</h2><p>Your poem will live here,<br>with room around each line,<br>and a little world<br>growing at its edges.</p><p class="sample-label">Sample layout · awaiting Sara’s poem</p></div><div class="page-garden"></div><span class="page-number">3</span>`, false],
  ['illustration-page', `<div class="vignette" role="img" aria-label="A cottage garden filled with flowers, and a child with a red kite"></div><p class="art-caption">A little room for wonder.</p><span class="page-number">4</span>`, false],
  ['panorama panorama-left', `<span class="sr-only">Left half of a continuous garden illustration, with a birch tree and wildflowers.</span><span class="page-number">5</span>`, false],
  ['panorama panorama-right', `<span class="sr-only">Right half of the garden illustration, with a cottage and a child flying a kite.</span><span class="page-number">6</span>`, false],
  ['last-page', `${ornament}<h2>To be continued.</h2><p>There is always room<br>for another poem.</p><span class="page-number">7</span>`, false],
  ['bookplate', `<div class="bookplate-inner">${ornament}<p>Selected Poems</p><h2>Sara</h2><p class="small-italic">An illustrated collection<br>in the making.</p></div>`, false],
  ['cover back-cover', `<div class="cover-frame">${ornament}<p>Selected Poems</p><span>SARA</span></div>`, true],
];
for (const [classes, html, hard] of pages) {
  const page = document.createElement('article');
  page.className = `page ${classes}`;
  if (hard) page.dataset.density = 'hard';
  page.innerHTML = html;
  book.append(page);
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const position = document.querySelector('#book-position');
const status = document.querySelector('#page-status');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const open = document.querySelector('#open');
let flip;
function sync() {
  const index = flip.getCurrentPageIndex();
  const portrait = flip.getOrientation() === 'portrait';
  position.classList.toggle('closed', index === 0 && !portrait);
  position.classList.toggle('back-closed', index === pages.length - 1 && !portrait);
  position.classList.toggle('portrait', portrait);
  prev.disabled = index === 0;
  next.disabled = index >= pages.length - (portrait ? 1 : 2);
  open.hidden = index !== 0;
  status.hidden = index === 0;
  status.textContent = index === pages.length - 1 ? 'Back cover' : portrait ? `${index} / 8` : `${index} — ${Math.min(index + 1, 8)}`;
  document.querySelector('#invitation').textContent = index === 0 ? 'A little world between two covers.' : 'Stay awhile. Turn a page.';
  document.querySelector('#gesture').textContent = index === 0 ? 'Pull the cover’s lower corner to begin' : 'Drag a corner · or use the arrow keys';
  // Keep hidden leaves out of keyboard focus; the plain view provides an accessible reading alternative.
  [...book.querySelectorAll('.page')].forEach((p, i) => p.querySelectorAll('button').forEach(b => b.tabIndex = i === index || (!portrait && i === index + 1) ? 0 : -1));
}
flip = new PageFlip(book, {
  width: 430, height: 580, size: 'stretch', minWidth: 280, maxWidth: 430,
  minHeight: 378, maxHeight: 580, showCover: true, usePortrait: true,
  maxShadowOpacity: .28, flippingTime: reducedMotion.matches ? 1 : 1000,
  mobileScrollSupport: false, showPageCorners: true, disableFlipByClick: true,
});
flip.on('init', sync);
flip.on('flip', sync);
flip.on('changeOrientation', sync);
flip.on('changeState', e => {
  if ((e.data === 'user_fold' || e.data === 'flipping') && flip.getCurrentPageIndex() === 0) position.classList.remove('closed');
  if (e.data === 'read') sync();
});
flip.loadFromHTML(book.querySelectorAll('.page'));
function turn(direction) {
  if (direction > 0 && !next.disabled) reducedMotion.matches ? flip.turnToNextPage() : flip.flipNext();
  if (direction < 0 && !prev.disabled) reducedMotion.matches ? flip.turnToPrevPage() : flip.flipPrev();
}
prev.addEventListener('click', () => turn(-1));
next.addEventListener('click', () => turn(1));
open.addEventListener('click', () => turn(1));
document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => flip.turnToPage(Number(button.dataset.page))));
document.querySelector('#contents').addEventListener('click', () => {
  setReading(false); flip.turnToPage(1);
});
const toggle = document.querySelector('#reading-toggle');
function setReading(reading) {
  document.querySelector('#reading-view').hidden = !reading;
  document.querySelector('#experience').hidden = reading;
  toggle.setAttribute('aria-pressed', String(reading));
  toggle.textContent = reading ? 'Back to the book' : 'Reading view';
  if (!reading) requestAnimationFrame(() => { flip.update(); sync(); });
}
toggle.addEventListener('click', () => setReading(toggle.getAttribute('aria-pressed') !== 'true'));
document.addEventListener('keydown', e => {
  if (toggle.getAttribute('aria-pressed') === 'true' || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
  if (e.key === 'Home') { e.preventDefault(); flip.turnToPage(0); }
});
