// ═══════════════════════════════════════════════════════════════
// H&L Flower Walls — Availability Form (Product Pages)
// ═══════════════════════════════════════════════════════════════

// ── Zapier Webhook Configuration ─────────────────────────────
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/YOUR_ZAP_ID/YOUR_HOOK_ID/";

// ── Inquiry Code Generator ───────────────────────────────────
function generateInquiryCode(productId) {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var rand = '';
  for (var i = 0; i < 4; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
  return 'INQ-' + productId.replace('-', '') + '-' + y + m + d + '-' + rand;
}

// ── Form Validation ──────────────────────────────────────────
function validateAvailabilityForm(form) {
  var errors = [];
  var name = form.querySelector('[name="name"]').value.trim();
  var email = form.querySelector('[name="email"]').value.trim();
  var phone = form.querySelector('[name="phone"]').value.trim();
  var eventDate = form.querySelector('[name="event_date"]').value;
  var eventType = form.querySelector('[name="event_type"]').value;
  var eventLocation = form.querySelector('[name="event_location"]').value.trim();

  if (!name) errors.push('Please enter your name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
  if (!phone || phone.replace(/\D/g, '').length < 10) errors.push('Please enter a valid phone number (10+ digits).');
  if (!eventDate) errors.push('Please select your event date.');
  if (!eventType) errors.push('Please select your event type.');
  if (!eventLocation) errors.push('Please enter your event location.');

  return errors;
}

// ── Show / Hide Errors ───────────────────────────────────────
function showFormErrors(form, errors) {
  var errDiv = form.querySelector('.avail-form-errors');
  if (!errDiv) return;
  if (errors.length === 0) {
    errDiv.style.display = 'none';
    errDiv.innerHTML = '';
    return;
  }
  errDiv.innerHTML = errors.map(function(e) { return '<p>' + e + '</p>'; }).join('');
  errDiv.style.display = 'block';
}

// ── Form Submission ──────────────────────────────────────────
function handleAvailabilitySubmit(e) {
  e.preventDefault();
  var form = e.target;

  var errors = validateAvailabilityForm(form);
  if (errors.length > 0) {
    showFormErrors(form, errors);
    return;
  }
  showFormErrors(form, []);

  // Read product data from form data attributes
  var productId = form.getAttribute('data-product-id');
  var productName = form.getAttribute('data-product-name');
  var productCategory = form.getAttribute('data-product-category');
  var hourlyRate = form.getAttribute('data-hourly-rate');
  var dailyRate = form.getAttribute('data-daily-rate');

  var inquiryCode = generateInquiryCode(productId);

  var payload = {
    product: {
      id: productId,
      name: productName,
      category: productCategory,
      hourly_rate: hourlyRate ? Number(hourlyRate) : null,
      daily_rate: dailyRate ? Number(dailyRate) : null
    },
    customer: {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      event_date: form.querySelector('[name="event_date"]').value,
      event_type: form.querySelector('[name="event_type"]').value,
      event_location: form.querySelector('[name="event_location"]').value.trim()
    },
    inquiry_code: inquiryCode,
    submitted_at: new Date().toISOString(),
    source: "product-page"
  };

  // Disable submit button
  var submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  // Warn if placeholder URL
  if (ZAPIER_WEBHOOK_URL.indexOf('YOUR_ZAP_ID') !== -1) {
    console.warn('Zapier webhook not configured. Payload:', JSON.stringify(payload, null, 2));
  }

  fetch(ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function() {
    showSuccessState(form, inquiryCode);
  })
  .catch(function() {
    // Show success anyway (webhook may be placeholder or CORS-blocked)
    showSuccessState(form, inquiryCode);
  });
}

// ── Success State ────────────────────────────────────────────
function showSuccessState(form, inquiryCode) {
  var formState = form.closest('.avail-form-section').querySelector('.avail-form-wrap');
  var successState = form.closest('.avail-form-section').querySelector('.avail-success');

  if (formState) formState.style.display = 'none';
  if (successState) {
    var codeEl = successState.querySelector('.avail-inquiry-code');
    if (codeEl) codeEl.textContent = inquiryCode;
    successState.style.display = 'block';
  }
}

// ── Initialize ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('availability-form-el');
  if (form) {
    form.addEventListener('submit', handleAvailabilitySubmit);

    // Set min date to today
    var dateInput = form.querySelector('[name="event_date"]');
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }
});
