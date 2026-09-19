// One orchestrated moment: the name rises in, then the process flow diagram
// draws itself stream by stream. Nothing else on the page moves on its own.
(function () {
  var root = document.documentElement;

  function reveal() {
    clearTimeout(window.__introFallback);
    root.classList.add('intro-done');
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduceMotion) {
    reveal();
    return;
  }

  var narrow = window.matchMedia('(max-width: 55rem)').matches;
  var targets = document.querySelectorAll('[data-intro]');

  var tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: function () {
      gsap.set(targets, { clearProps: 'transform,opacity,visibility' });
    },
  });

  tl.from('.name-line > span', { yPercent: 110, duration: 1.1, stagger: 0.08 })
    .from('.hero-intro', { autoAlpha: 0, y: 12, duration: 0.8 }, 0.45);

  // Each unit appears, then the stream leaving it flows into the next one.
  var nodes = document.querySelectorAll('.pfd-node');
  var at = 0.8;
  nodes.forEach(function (node) {
    var icon = node.querySelector('.pfd-icon');
    var text = node.querySelector('.pfd-text');
    var pipe = node.querySelector('.pfd-pipe');
    var tag = node.querySelector('.pfd-tag');

    tl.from(icon, { autoAlpha: 0, scale: 0.94, duration: 0.5, transformOrigin: '50% 50%' }, at)
      .from(text, narrow
        ? { autoAlpha: 0, x: -6, duration: 0.6 }
        : { autoAlpha: 0, y: 8, duration: 0.6 }, at + 0.05);
    at += 0.2;

    if (pipe) {
      tl.from(pipe, narrow
        ? { scaleY: 0, duration: 0.45, ease: 'power2.inOut' }
        : { scaleX: 0, duration: 0.45, ease: 'power2.inOut' }, at)
        .from(tag, { autoAlpha: 0, scale: 0.85, duration: 0.4 }, at + 0.2);
      at += 0.4;
    }
  });

  tl.from('.pfd-caption', { autoAlpha: 0, duration: 0.6, ease: 'power1.out' }, at);

  // From-states are applied synchronously above, so it's now safe to un-hide.
  reveal();
})();
