const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

const revealObserver = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 }) : null;

document.querySelectorAll('.reveal').forEach(el => revealObserver?.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('projectForm');
const formStatus = document.getElementById('formStatus');
const enquiryEndpoint = 'https://script.google.com/macros/s/AKfycbyp1wBv0Nhp2OV5diVLzRYNgiqk7Vb_3ivzG0MtpZhVPLgzJdlVcjlLvNhBXbZEWegD/exec';

function setFormStatus(message, type = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('success', 'error');
  if (type) formStatus.classList.add(type);
}

form?.addEventListener('submit', async event => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonHTML = submitButton?.innerHTML || 'Send enquiry <span>↗</span>';
  const data = new FormData(form);
  const honeypot = String(data.get('website') || '').trim();

  if (honeypot) return;

  const phone = String(data.get('phone') || '').trim();
  const currentSystem = String(data.get('currentSystem') || '').trim();
  const goal = String(data.get('goal') || '').trim();
  const timeline = String(data.get('timeline') || '').trim();
  const details = String(data.get('details') || '').trim();

  const payload = {
    name: String(data.get('name') || '').trim(),
    company: String(data.get('company') || '').trim(),
    email: String(data.get('email') || '').trim(),
    service: String(data.get('service') || '').trim(),
    message: [
      phone && `Phone / WhatsApp: ${phone}`,
      currentSystem && `Current system: ${currentSystem}`,
      goal && `Primary goal: ${goal}`,
      timeline && `Preferred timeline: ${timeline}`,
      details && `Requirement: ${details}`
    ].filter(Boolean).join('\n') || 'No additional details supplied.',
    submittedAt: new Date().toISOString()
  };

  if (!payload.name || !payload.email || !payload.service) {
    setFormStatus('Please complete your name, email, and required service.', 'error');
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
  }
  setFormStatus('Submitting your enquiry...');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    await fetch(enquiryEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    form.reset();
    setFormStatus('Your enquiry was sent for processing. Receipt could not be confirmed automatically; email Workplace132000@gmail.com if you need confirmation.', 'success');
  } catch (error) {
    setFormStatus('We could not submit your enquiry. Please email Workplace132000@gmail.com.', 'error');
  } finally {
    window.clearTimeout(timeout);
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  }
});

// Business solution tabs
const solutionButtons = document.querySelectorAll('[data-solution-tab]');
const solutionPanels = document.querySelectorAll('[data-solution-panel]');

function activateSolution(key) {
  solutionButtons.forEach(btn => {
    const active = btn.dataset.solutionTab === key;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;
  });
  solutionPanels.forEach(panel => {
    const active = panel.dataset.solutionPanel === key;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}

solutionButtons.forEach(button => {
  button.addEventListener('click', () => activateSolution(button.dataset.solutionTab));
});

// Preselect enquiry service when a service CTA is clicked.
document.querySelectorAll('[data-service-choice]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('#projectForm select[name="service"]');
    if (!select) return;
    const requested = link.dataset.serviceChoice;
    const option = [...select.options].find(item => item.text === requested);
    if (option) select.value = option.value;
  });
});


// Case-study cards: keyboard-friendly active state.
document.querySelectorAll('.case-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  const activate = () => {
    document.querySelectorAll('.case-card').forEach(item => item.classList.remove('active'));
    card.classList.add('active');
  };
  card.addEventListener('mouseenter', activate);
  card.addEventListener('focus', activate);
});


// 2026 festive offer: automatically ends after the final day of Sharad Navratri in India.
const festiveOffer = document.getElementById('festiveOffer');
const closeFestiveOffer = document.getElementById('closeFestiveOffer');
const offerCountdown = document.getElementById('offerCountdown');
const festiveOfferEnd = new Date('2026-10-19T23:59:59+05:30');

function updateFestiveOffer() {
  if (!festiveOffer) return;
  const remaining = festiveOfferEnd.getTime() - Date.now();
  if (remaining <= 0) {
    festiveOffer.hidden = true;
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  if (offerCountdown) offerCountdown.textContent = `${days}d ${hours}h remaining`;
}
updateFestiveOffer();
window.setInterval(updateFestiveOffer, 60000);
closeFestiveOffer?.addEventListener('click', () => { festiveOffer.hidden = true; });


// WAI-ARIA tab navigation: one tab stop per group, arrow/Home/End support.
function configureTabs(buttons, activate) {
  const items = [...buttons];
  items.forEach((button, index) => {
    button.tabIndex = button.classList.contains('active') ? 0 : -1;
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = items.length - 1;
      if (next === undefined) return;
      event.preventDefault(); activate(items[next]); items[next].focus();
    });
    button.addEventListener('click', () => activate(button));
  });
}
configureTabs(solutionButtons, button => activateSolution(button.dataset.solutionTab));
configureTabs(tabButtons, button => {
  tabButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  tabPanels.forEach(panel => {
    const active = panel.id === button.dataset.tab;
    panel.hidden = !active; panel.classList.toggle('active', active);
  });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false'); menuToggle?.focus();
  }
});
if (typeof IntersectionObserver === 'function') {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav a').forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}

// Reference-inspired scrolling and presentation details.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && typeof IntersectionObserver === 'function') {
  document.documentElement.classList.add('motion-ready');
}
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
let scrollTicking = false;
function updateScrollDetails() {
  const scrollTop = window.scrollY;
  const range = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${range > 0 ? scrollTop / range : 0})`;
  header?.classList.toggle('scrolled', scrollTop > 40);
  backToTop?.classList.toggle('shown', scrollTop > 600);
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(updateScrollDetails); }
}, { passive: true });
updateScrollDetails();
const rail = document.querySelector('.service-rail');
function moveService(direction) {
  const card = rail?.querySelector('.service-slide');
  if (!rail || !card) return;
  const step = card.getBoundingClientRect().width + 24;
  rail.scrollBy({ left: step * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
}
document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => moveService(-1));
document.querySelector('[data-carousel-next]')?.addEventListener('click', () => moveService(1));
rail?.addEventListener('keydown', event => {
  if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault(); moveService(event.key === 'ArrowRight' ? 1 : -1);
});
function openLinkedService() {
  const key = window.location.hash.replace('#solution-', '');
  if ([...solutionButtons].some(button => button.dataset.solutionTab === key)) activateSolution(key);
}
openLinkedService();
window.addEventListener('hashchange', openLinkedService);
document.addEventListener('click', event => {
  document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
    if (!menu.contains(event.target) || event.target.closest('a')) menu.open = false;
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
    menu.open = false; menu.querySelector('summary')?.focus();
  });
});
