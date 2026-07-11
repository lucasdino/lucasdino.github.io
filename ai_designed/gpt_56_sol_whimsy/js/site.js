const VERSION_BASE = '/ai_designed/gpt_56_sol_whimsy/';

function currentPage() {
  const file = location.pathname.split('/').pop();
  return file && file.includes('.html') ? file : 'index.html';
}

function initVersionSwitcher() {
  const select = document.querySelector('#version-select');
  if (!select) return;
  select.addEventListener('change', () => {
    const page = currentPage();
    const version = select.value;
    if (version === 'pages') {
      location.href = page === 'index.html' ? '/index.html' : `/pages/${page}`;
      return;
    }
    location.href = `/ai_designed/${version}/${page}`;
  });
}

function initScrollTrain() {
  const train = document.querySelector('.scroll-train');
  const rail = document.querySelector('.scroll-rail');
  if (!train || !rail) return;
  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const distance = rail.clientHeight - train.clientHeight;
    train.style.transform = `translateY(${Math.max(0, progress * distance)}px)`;
  };
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
}

const stops = {
  corn: {
    number: '01',
    title: 'Nebraska → Finance',
    copy: 'A finance degree, two years in investment banking, and a healthy suspicion that the straight line was not the interesting one.',
    href: 'professional.html',
    link: 'Inspect the work line'
  },
  orbit: {
    number: '02',
    title: '153 days off-map',
    copy: 'One backpack. Twenty-two flights. Long-term Airbnbs, pet sits, sketchbooks, and a self-directed machine-learning curriculum.',
    href: 'personal.html',
    link: 'Open the field notes'
  },
  lab: {
    number: '03',
    title: 'UCSD → AI research',
    copy: 'Reinforcement learning for language models, neurosymbolic search, philosophy classifiers, a NeurIPS oral, and an ICML paper.',
    href: 'research.html',
    link: 'Enter the observatory'
  },
  forge: {
    number: '04',
    title: 'Special Projects',
    copy: 'Currently a jack of all trades at Hadrian in Los Angeles—working where software, machines, and ambiguous problems collide.',
    href: 'contact.html',
    link: 'Send a signal'
  }
};

function initRouteConsole() {
  const buttons = [...document.querySelectorAll('.route-stop')];
  const display = document.querySelector('.route-display');
  if (!buttons.length || !display) return;
  const number = display.querySelector('.route-display-number');
  const title = display.querySelector('h2');
  const copy = display.querySelector('p');
  const link = display.querySelector('a');
  const show = (button) => {
    const stop = stops[button.dataset.stop];
    if (!stop) return;
    buttons.forEach((item) => item.classList.toggle('active', item === button));
    number.textContent = stop.number;
    title.textContent = stop.title;
    copy.textContent = stop.copy;
    link.href = stop.href;
    link.textContent = `${stop.link} →`;
  };
  buttons.forEach((button) => {
    button.addEventListener('click', () => show(button));
    button.addEventListener('mouseenter', () => show(button));
    button.addEventListener('focus', () => show(button));
  });
}

function initFreightRail() {
  const track = document.querySelector('.freight-track');
  const wagons = [...document.querySelectorAll('.project-wagon')];
  const counter = document.querySelector('.freight-counter');
  if (!track || !wagons.length || !counter) return;
  const buttons = document.querySelectorAll('[data-rail-direction]');
  let active = 0;
  const render = () => counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(wagons.length).padStart(2, '0')}`;
  const go = (direction) => {
    active = Math.max(0, Math.min(wagons.length - 1, active + direction));
    wagons[active].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    render();
  };
  buttons.forEach((button) => button.addEventListener('click', () => go(Number(button.dataset.railDirection))));
  track.addEventListener('scroll', () => {
    const left = track.scrollLeft;
    active = wagons.reduce((best, wagon, index) => Math.abs(wagon.offsetLeft - left) < Math.abs(wagons[best].offsetLeft - left) ? index : best, 0);
    render();
  }, { passive: true });
  render();
}

function initResearchSky() {
  const canvas = document.querySelector('#research-sky');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const context = canvas.getContext('2d');
  let stars = [];
  let pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(120, Math.floor(innerWidth / 9)) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.8 + .35,
      phase: Math.random() * Math.PI * 2
    }));
  };
  const draw = (time) => {
    context.clearRect(0, 0, innerWidth, innerHeight);
    stars.forEach((star, index) => {
      const shimmer = .45 + Math.sin(time * .0015 + star.phase) * .35;
      context.fillStyle = index % 9 === 0 ? `rgba(223,255,69,${shimmer})` : `rgba(115,217,255,${shimmer})`;
      context.beginPath();
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      context.fill();
      const distance = Math.hypot(pointer.x - star.x, pointer.y - star.y);
      if (distance < 155) {
        context.strokeStyle = `rgba(115,217,255,${(1 - distance / 155) * .35})`;
        context.beginPath();
        context.moveTo(star.x, star.y);
        context.lineTo(pointer.x, pointer.y);
        context.stroke();
      }
    });
    requestAnimationFrame(draw);
  };
  addEventListener('pointermove', (event) => { pointer = { x: event.clientX, y: event.clientY }; }, { passive: true });
  addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

function initReveals() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elements = document.querySelectorAll('.project-wagon, .research-card, .field-card, .line-link, .departure-link');
  elements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform += ' translateY(24px)';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.8,.2,1)';
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.style.transform.replace(' translateY(24px)', '');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  elements.forEach((element) => observer.observe(element));
}

initVersionSwitcher();
initScrollTrain();
initRouteConsole();
initFreightRail();
initResearchSky();
initReveals();
