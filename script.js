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
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name') || '';
  const company = data.get('company') || '';
  const email = data.get('email') || '';
  const service = data.get('service') || '';
  const details = data.get('details') || '';

  const subject = encodeURIComponent(`Automation enquiry — ${service}`);
  const body = encodeURIComponent(
`Hi Priya,

I would like to discuss a project.

Name: ${name}
Company: ${company}
Email: ${email}
Service: ${service}

Project details:
${details}

Regards,
${name}`
  );

  window.location.href = `mailto:Workplace132000@gmail.com?subject=${subject}&body=${body}`;
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
