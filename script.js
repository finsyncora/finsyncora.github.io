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

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
    setFormStatus('✓ Your enquiry was submitted. We will reply to the email you provided.', 'success');
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
