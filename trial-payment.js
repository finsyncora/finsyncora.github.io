const enquiryEndpoint = 'https://script.google.com/macros/s/AKfycbyp1wBv0Nhp2OV5diVLzRYNgiqk7Vb_3ivzG0MtpZhVPLgzJdlVcjlLvNhBXbZEWegD/exec';
const detailsForm = document.getElementById('trialDetailsForm');
const detailsStatus = document.getElementById('trialDetailsStatus');
const qrStage = document.getElementById('trialQrStage');
const referenceForm = document.getElementById('paymentReferenceForm');
const referenceStatus = document.getElementById('paymentReferenceStatus');
let trialCustomer = null;

async function sendTrialRecord(payload) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  try {
    await fetch(enquiryEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    return true;
  } finally {
    window.clearTimeout(timer);
  }
}

detailsForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const formData = new FormData(detailsForm);
  if (String(formData.get('website') || '').trim()) return;
  const button = detailsForm.querySelector('button[type="submit"]');
  trialCustomer = {
    name: String(formData.get('name') || '').trim(),
    company: String(formData.get('company') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    preferredTime: String(formData.get('preferredTime') || '').trim(),
    details: String(formData.get('details') || '').trim()
  };
  if (button) { button.disabled = true; button.textContent = 'Saving details...'; }
  if (detailsStatus) detailsStatus.textContent = 'Saving your details...';
  try {
    await sendTrialRecord({
      name: trialCustomer.name,
      company: trialCustomer.company,
      email: trialCustomer.email,
      service: 'Book a Trial — ₹1,999',
      message: ['Trial status: Awaiting UPI payment', 'Phone / WhatsApp: '+trialCustomer.phone, 'Preferred time: '+trialCustomer.preferredTime, trialCustomer.details && 'Requirement: '+trialCustomer.details].filter(Boolean).join('\n'),
      submittedAt: new Date().toISOString()
    });
    detailsForm.hidden = true;
    qrStage.hidden = false;
    qrStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    if (detailsStatus) detailsStatus.textContent = 'We could not save your details. Please try again.';
  } finally {
    if (button) { button.disabled = false; button.innerHTML = 'Continue to payment <span>↗</span>'; }
  }
});

referenceForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const reference = String(new FormData(referenceForm).get('reference') || '').trim();
  const button = referenceForm.querySelector('button[type="submit"]');
  if (!reference || !trialCustomer) return;
  if (button) { button.disabled = true; button.textContent = 'Submitting...'; }
  if (referenceStatus) referenceStatus.textContent = 'Submitting your payment reference...';
  try {
    await sendTrialRecord({
      name: trialCustomer.name,
      company: trialCustomer.company,
      email: trialCustomer.email,
      service: 'Book a Trial — ₹1,999',
      message: ['Trial status: Payment reference submitted — verification required', 'Payment UTR / reference: '+reference, 'Phone / WhatsApp: '+trialCustomer.phone, 'Preferred time: '+trialCustomer.preferredTime, trialCustomer.details && 'Requirement: '+trialCustomer.details].filter(Boolean).join('\n'),
      submittedAt: new Date().toISOString()
    });
    referenceForm.reset();
    if (referenceStatus) referenceStatus.textContent = '✓ Payment reference received. We will verify it and contact you on your preferred time.';
  } catch (error) {
    if (referenceStatus) referenceStatus.textContent = 'We could not submit the reference. Please try again.';
  } finally {
    if (button) { button.disabled = false; button.innerHTML = 'Submit payment reference <span>↗</span>'; }
  }
});
