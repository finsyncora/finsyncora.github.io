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
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

// Interactive dashboard demo. All numbers are illustrative and intentionally labeled as sample data.
const dashboardViews = {
  sales: {
    kicker: 'Sales performance',
    value: '₹1.82 Cr',
    change: '↗ 12.4% vs prior period',
    tone: 'positive',
    text: 'Sales momentum is positive. Collection efficiency is holding at 86%, keeping the growth supported by cash realization.',
    focus: 'Protect collection efficiency while scaling sales.',
    kpis: [['Net Sales','₹1.82 Cr','+12.4%'],['Collections','₹28.4 L','86% of due'],['Top Customer','23.8%','of sales']],
    chart: ['Sales vs Collections','Monthly trend','₹ Lakhs','Sales','Collections'],
    primary: 'M50,208 C105,178 138,190 180,150 S270,112 320,138 S410,87 468,104 S570,62 636,80 S690,49 714,55',
    secondary: 'M50,219 C105,200 138,207 180,177 S270,145 320,160 S410,123 468,135 S570,96 636,108 S690,85 714,91'
  },
  receivables: {
    kicker: 'Receivables risk',
    value: '₹36.8 L',
    change: '10% is 90+ days overdue',
    tone: 'neutral',
    text: 'Most outstanding sits inside the first 60 days, but the oldest bucket deserves focused follow-up before it becomes harder to collect.',
    focus: 'Prioritize high-value customers in the 61+ day buckets.',
    kpis: [['Total OS','₹36.8 L','43 parties'],['0–30 Days','46%','₹16.9 L'],['90+ Days','10%','₹3.7 L']],
    chart: ['Outstanding movement','Aging exposure trend','₹ Lakhs','Total OS','90+ days'],
    primary: 'M50,165 C104,152 139,163 180,147 S265,137 320,151 S407,129 468,138 S565,116 636,122 S690,108 714,114',
    secondary: 'M50,216 C104,212 139,214 180,207 S265,203 320,197 S407,187 468,190 S565,176 636,169 S690,158 714,153'
  },
  payables: {
    kicker: 'Payables planning',
    value: '₹21.7 L',
    change: '₹7.6 L due in next 30 days',
    tone: 'neutral',
    text: 'Upcoming vendor commitments are concentrated in the next payment cycle. Mapping due dates against bank position helps avoid rushed payment decisions.',
    focus: 'Plan the next 30-day payment window against available cash.',
    kpis: [['Total Payables','₹21.7 L','28 suppliers'],['Due <30 Days','₹7.6 L','35% of total'],['Credit Term Risk','4 parties','past term']],
    chart: ['Payables vs planned cash','Upcoming weekly requirement','₹ Lakhs','Payables','Planned cash'],
    primary: 'M50,195 C105,180 138,154 180,163 S270,110 320,124 S410,82 468,100 S570,120 636,98 S690,117 714,111',
    secondary: 'M50,207 C105,198 138,183 180,187 S270,156 320,163 S410,136 468,144 S570,134 636,140 S690,129 714,132'
  },
  cash: {
    kicker: 'Cash visibility',
    value: '₹14.2 L',
    change: '↗ ₹2.1 L net movement',
    tone: 'positive',
    text: 'Closing cash is improving, but the view becomes more useful when collections, vendor payments, loan obligations, and expense outflows are seen together.',
    focus: 'Track future obligations, not only today’s bank balance.',
    kpis: [['Closing Bank','₹14.2 L','+₹2.1 L'],['Expected Inflow','₹9.8 L','next 14 days'],['Committed Outflow','₹6.4 L','next 14 days']],
    chart: ['Cash inflow vs outflow','Rolling liquidity view','₹ Lakhs','Inflow','Outflow'],
    primary: 'M50,205 C105,172 138,181 180,143 S270,125 320,133 S410,92 468,110 S570,73 636,90 S690,65 714,71',
    secondary: 'M50,216 C105,197 138,203 180,188 S270,163 320,174 S410,150 468,157 S570,135 636,145 S690,128 714,132'
  }
};

const ids = id => document.getElementById(id);
const insightButtons = document.querySelectorAll('.insight-btn');

function setDashboard(viewKey) {
  const d = dashboardViews[viewKey];
  if (!d) return;

  ids('summaryKicker').textContent = d.kicker;
  ids('summaryValue').textContent = d.value;
  ids('summaryChange').textContent = d.change;
  ids('summaryChange').className = `summary-change ${d.tone}`;
  ids('summaryText').textContent = d.text;
  ids('decisionFocus').textContent = d.focus;

  ['1','2','3'].forEach((n, i) => {
    ids(`kpi${n}Label`).textContent = d.kpis[i][0];
    ids(`kpi${n}Value`).textContent = d.kpis[i][1];
    ids(`kpi${n}Note`).textContent = d.kpis[i][2];
  });

  ids('chartTitle').textContent = d.chart[0];
  ids('chartSubtitle').textContent = d.chart[1];
  ids('chartUnit').textContent = d.chart[2];
  ids('legend1').textContent = d.chart[3];
  ids('legend2').textContent = d.chart[4];
  ids('primaryPath').setAttribute('d', d.primary);
  ids('secondaryPath').setAttribute('d', d.secondary);
  ids('areaPath').setAttribute('d', `${d.primary} L714,230 L50,230 Z`);
}

insightButtons.forEach(button => {
  button.addEventListener('click', () => {
    insightButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    setDashboard(button.dataset.view);
  });
});

// Simple automation opportunity calculator.
const rowsRange = ids('rowsRange');
const minutesRange = ids('minutesRange');
const coverageRange = ids('coverageRange');

function updateCalculator() {
  const rows = Number(rowsRange?.value || 0);
  const minutes = Number(minutesRange?.value || 0);
  const coverage = Number(coverageRange?.value || 0) / 100;
  const hours = (rows * minutes * coverage) / 60;
  const days = hours / 8;
  ids('rowsOutput').textContent = rows.toLocaleString('en-IN');
  ids('minutesOutput').textContent = `${minutes.toFixed(1)} min`;
  ids('coverageOutput').textContent = `${Math.round(coverage * 100)}%`;
  ids('hoursSaved').textContent = `${Math.round(hours)} hrs / month`;
  ids('daysSaved').textContent = `≈ ${days.toFixed(1)} working days`;
}

[rowsRange, minutesRange, coverageRange].forEach(control => control?.addEventListener('input', updateCalculator));
updateCalculator();

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
  const body = encodeURIComponent(`Hi Priya,\n\nI would like to discuss a project.\n\nName: ${name}\nCompany: ${company}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${details}\n\nRegards,\n${name}`);
  window.location.href = `mailto:Workplace132000@gmail.com?subject=${subject}&body=${body}`;
});
