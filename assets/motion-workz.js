/* Motion Workz — motion-workz.js */
(function () {
  'use strict';

  // Navbar scroll state
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile hamburger
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll('.product-card, .build-series, .pillar, .about-text, .about-car');
  if ('IntersectionObserver' in window && reveals.length) {
    var style = document.createElement('style');
    style.textContent = '.reveal-hidden{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}.reveal-visible{opacity:1;transform:none}';
    document.head.appendChild(style);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function (el, i) {
      el.classList.add('reveal-hidden');
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  }
})();
