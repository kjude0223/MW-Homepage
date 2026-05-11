/* Motion Workz — motion-workz.js */
(function () {
  'use strict';

  // ── Navbar scroll ──────────────────────────────────────────────────────
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Mobile hamburger ───────────────────────────────────────────────
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

  // ── Scroll-reveal ──────────────────────────────────────────────────
  var reveals = document.querySelectorAll('.product-card, .build-series, .pillar, .about-text, .about-car');
  if ('IntersectionObserver' in window && reveals.length) {
    var rvStyle = document.createElement('style');
    rvStyle.textContent = '.reveal-hidden{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}.reveal-visible{opacity:1;transform:none}';
    document.head.appendChild(rvStyle);
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

  // ── Product page: thumbnail gallery ───────────────────────────────
  var mainImg   = document.getElementById('mainProductImg');
  var thumbBtns = document.querySelectorAll('.thumb-btn');
  if (mainImg && thumbBtns.length) {
    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        mainImg.src = btn.dataset.src;
        mainImg.alt = btn.dataset.alt || '';
        thumbBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  // ── Product page: variant selector ────────────────────────────────
  var variantSelect = document.getElementById('variantSelect');
  var priceEl       = document.getElementById('productPrice');
  var addBtn        = document.getElementById('addToCartBtn');
  var variantBtns   = document.querySelectorAll('.variant-btn');

  if (variantSelect && variantBtns.length) {
    var selectedOptions = {};
    variantBtns.forEach(function (btn) {
      var idx = btn.dataset.optionIndex;
      if (!(idx in selectedOptions)) selectedOptions[idx] = btn.dataset.value;
    });

    function syncVariant() {
      var numOpts = Object.keys(selectedOptions).length;
      var matched = null;
      Array.from(variantSelect.options).forEach(function (opt) {
        if (matched) return;
        var parts = opt.text.split(' / ');
        var fits = true;
        for (var i = 0; i < numOpts; i++) {
          if (parts[i] !== selectedOptions[String(i)]) { fits = false; break; }
        }
        if (fits) matched = opt;
      });
      if (!matched) return;
      variantSelect.value = matched.value;
      if (priceEl && matched.dataset.price) priceEl.textContent = matched.dataset.price;
      if (addBtn) {
        addBtn.disabled = matched.disabled;
        addBtn.textContent = matched.disabled ? 'Sold Out' : 'Add to Cart';
      }
    }

    variantBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.dataset.optionIndex;
        selectedOptions[idx] = btn.dataset.value;
        document.querySelectorAll('.variant-btn[data-option-index="' + idx + '"]').forEach(function (b) {
          b.classList.remove('selected');
        });
        btn.classList.add('selected');
        syncVariant();
      });
    });
  }

  // ── Product page: AJAX add to cart ───────────────────────────────
  var productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn    = document.getElementById('addToCartBtn');
      var msg    = document.getElementById('cartMsg');
      var idEl   = variantSelect || productForm.querySelector('[name="id"]');
      if (!idEl || !idEl.value) return;

      btn.textContent = 'Adding...';
      btn.disabled = true;

      fetch('/cart/add.js', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({ id: idEl.value, quantity: 1 })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.id) {
          window.location.href = '/cart';
        } else {
          btn.disabled    = false;
          btn.textContent = 'Add to Cart';
          if (msg) {
            msg.textContent   = data.description || 'Something went wrong. Try again.';
            msg.style.color   = '#CC1111';
            msg.style.display = 'block';
          }
        }
      })
      .catch(function () {
        btn.disabled    = false;
        btn.textContent = 'Add to Cart';
      });
    });
  }

})();
