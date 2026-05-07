/* Motion Workz – main.js */

(function () {
  'use strict';

  // Navbar scroll state
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu on nav link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Newsletter form
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    if (!name || !email || !email.includes('@')) return;
    success.hidden = false;
    form.querySelector('.form-row').style.display = 'none';
    form.querySelector('.form-note').style.display = 'none';
  });

  // Scroll-reveal for cards
  const reveals = document.querySelectorAll('.product-card, .stat, .about-text');
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal-hidden { opacity: 0; transform: translateY(32px); transition: opacity 0.55s ease, transform 0.55s ease; }
      .reveal-visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el, i) {
      el.classList.add('reveal-hidden');
      el.style.transitionDelay = (i % 3) * 0.1 + 's';
      io.observe(el);
    });
  }
})();
