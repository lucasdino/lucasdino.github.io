(function () {
  function initNavigation() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });

    nav.addEventListener('click', function (event) {
      if (!event.target.closest('a')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Menu';
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1020) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
      }
    });
  }

  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px' });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initCopyEmail() {
    var button = document.querySelector('[data-copy-email]');
    if (!button) return;
    button.addEventListener('click', function () {
      var email = ['lucasdionisopoulos', 'gmail.com'].join('@');
      button.textContent = 'Copying…';

      function fallbackCopy() {
        var field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        var copied = false;
        try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
        field.remove();
        return copied;
      }

      var modernCopy = navigator.clipboard && window.isSecureContext
        ? Promise.race([
            navigator.clipboard.writeText(email),
            new Promise(function (_, reject) { setTimeout(reject, 350); })
          ])
        : Promise.reject();

      modernCopy.catch(function () {
        if (!fallbackCopy()) throw new Error('copy unavailable');
      }).then(function () {
        button.textContent = 'Copied';
        setTimeout(function () { button.textContent = 'Copy address'; }, 1600);
      }).catch(function () {
        button.textContent = 'Select address above';
        setTimeout(function () { button.textContent = 'Copy address'; }, 2200);
      });
    });
  }

  function setYear() {
    document.querySelectorAll('[data-year]').forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initReveals();
    initCopyEmail();
    setYear();
  });
})();
