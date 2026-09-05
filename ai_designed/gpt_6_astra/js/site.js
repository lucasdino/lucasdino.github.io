document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.version-btn');
  const dropdown = document.querySelector('.version-dropdown');
  if (button && dropdown) {
    dropdown.id = 'page-versions';
    button.setAttribute('aria-controls', dropdown.id);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Page version: GPT 6 Astra');
    const sync = () => {
      const open = dropdown.classList.contains('open');
      button.setAttribute('aria-expanded', String(open));
      dropdown.inert = !open;
    };
    new MutationObserver(sync).observe(dropdown, { attributes: true, attributeFilter: ['class'] });
    sync();
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        button.focus();
      }
    });
    document.addEventListener('focusin', event => {
      if (!event.target.closest('.version-switcher')) dropdown.classList.remove('open');
    });
    const archive = document.querySelector('.archive-toggle');
    const entry = document.querySelector('.archive-entry');
    if (archive && entry) {
      archive.setAttribute('aria-expanded', String(entry.classList.contains('open')));
      new MutationObserver(() => archive.setAttribute('aria-expanded', String(entry.classList.contains('open'))))
        .observe(entry, { attributes: true, attributeFilter: ['class'] });
    }
  }
  document.querySelectorAll('[data-back-top]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.querySelector('.monogram').focus({ preventScroll: true });
  }));
});
