/* ============================================================
   VIXTON LABS — shared front-end behaviour
   ============================================================ */

// ---- header: solid background after scrolling past hero ----
const header = document.querySelector('.site-header');
function onScroll(){
  if(!header) return;
  if(window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}
document.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// ---- mobile nav toggle ----
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if(navToggle && nav){
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.textContent = '☰';
  }));
}

// ---- scroll reveal: fade/slide elements with .reveal into view ----
const revealItems = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && revealItems.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealItems.forEach(el => io.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-visible'));
}

/* ============================================================
   Signature element: the "console" that opens as you scroll.
   Pure scroll-progress driven — no animation library needed.
   Maps scroll position inside .console-stage (0 -> 1) to:
     - console scale (0.82 -> 1)
     - background glow opacity (0 -> 1)
     - staggered reveal of terminal lines
   ============================================================ */
(function consoleScrollAnim(){
  const stage = document.querySelector('.console-stage');
  const consoleEl = document.querySelector('.console');
  if(!stage || !consoleEl) return;

  const lines = Array.from(consoleEl.querySelectorAll('.console-line'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(prefersReduced){
    consoleEl.style.setProperty('--console-scale', 1);
    consoleEl.style.setProperty('--console-glow', 1);
    lines.forEach(l => l.classList.add('on'));
    return;
  }

  function update(){
    const rect = stage.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    // progress: 0 when stage top hits top of viewport, 1 when stage bottom hits bottom
    let progress = total > 0 ? (-rect.top) / total : 0;
    progress = Math.min(1, Math.max(0, progress));

    const scale = 0.82 + (progress * 0.18);
    consoleEl.style.setProperty('--console-scale', scale.toFixed(3));
    consoleEl.style.setProperty('--console-glow', Math.min(1, progress * 1.4).toFixed(2));

    // reveal terminal lines in step with scroll, evenly spaced across 0.15 -> 0.95
    const start = 0.15, end = 0.95;
    const span = end - start;
    lines.forEach((line, i) => {
      const threshold = start + (span * (i / Math.max(1, lines.length - 1)));
      if(progress >= threshold) line.classList.add('on');
      else line.classList.remove('on');
    });

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
})();
