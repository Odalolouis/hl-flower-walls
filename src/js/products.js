// ═══════════════════════════════════════════════════════════════
// H&L Flower Walls — Product Catalog & Inquiry Modal
// ═══════════════════════════════════════════════════════════════

// ── Configuration ──────────────────────────────────────────────
// TODO(pre-launch): Replace with your real n8n webhook URL before going live.
// Form submissions will silently fail until this is configured.
const WEBHOOK_URL = "https://YOUR-N8N-INSTANCE.app.n8n.cloud/webhook/hl-inquiry";

// ── Product Catalog ────────────────────────────────────────────
const PRODUCTS = [
  { id: "FW-001", category: "flower-wall", name: "Donna Champagne Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-002", category: "flower-wall", name: "Amor Red Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-003", category: "flower-wall", name: "The Aria Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-004", category: "flower-wall", name: "Angel White Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-005", category: "flower-wall", name: "Dhalia Pink Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-006", category: "flower-wall", name: "Flora Pink Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-007", category: "flower-wall", name: "Veronica's Garden Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "FW-008", category: "flower-wall", name: "The Pearl Flower Wall", hourly_rate: 80, daily_rate: 360 },
  { id: "TA-001", category: "twin-arches", name: "Serenity Twin Floral Arches", hourly_rate: 70, daily_rate: 315 },
  { id: "PB-001", category: "photo-booth", name: "Mirror Photo Booth", hourly_rate: 180, daily_rate: 810 },
  { id: "LED-001", category: "led-sign", name: "Mr & Mrs LED Sign", hourly_rate: null, daily_rate: 30 },
  { id: "LED-002", category: "led-sign", name: "Will You Marry Me LED Sign", hourly_rate: null, daily_rate: 30 },
  { id: "WC-001", category: "wedding-combo", name: "The Wedding Combo", hourly_rate: 135, daily_rate: 540, includes: ["FW-003", "TA-001"] },
  { id: "SYW-001", category: "style-your-wall", name: "Flower Wall + Draping", hourly_rate: null, daily_rate: 60 },
  { id: "SYW-002", category: "style-your-wall", name: "Flower Wall + LED Sign", hourly_rate: null, daily_rate: 30 },
  { id: "SYW-003", category: "style-your-wall", name: "Flower Wall + Draping & LED", hourly_rate: null, daily_rate: 80 }
];

// ── Modal State ────────────────────────────────────────────────

function openInquiryModal(preselect) {
  var modal = document.getElementById('inquiry-modal');
  var overlay = document.getElementById('inquiry-overlay');

  resetModal();

  if (preselect && preselect.length) {
    preselect.forEach(function (id) {
      var cb = modal.querySelector('input[value="' + id + '"]');
      if (cb) cb.checked = true;
    });
  }

  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  modal.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');

  var first = modal.querySelector('input, button, select, textarea');
  if (first) first.focus();
}

function closeInquiryModal() {
  var modal = document.getElementById('inquiry-modal');
  var overlay = document.getElementById('inquiry-overlay');

  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  modal.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
}

function resetModal() {
  var modal = document.getElementById('inquiry-modal');
  modal.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
  var form = document.getElementById('inquiry-form');
  if (form) form.reset();

  var formState = document.getElementById('modal-form-state');
  var successState = document.getElementById('modal-success-state');
  if (formState) formState.style.display = '';
  if (successState) successState.style.display = 'none';

  var errors = document.getElementById('modal-form-errors');
  if (errors) { errors.style.display = 'none'; errors.textContent = ''; }

  // Reset rental toggle to daily
  setRentalType('daily');
}

// ── Focus Trapping & Escape ────────────────────────────────────

function handleModalKeydown(e) {
  var modal = document.getElementById('inquiry-modal');
  if (!modal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeInquiryModal();
    return;
  }

  if (e.key === 'Tab') {
    var focusable = modal.querySelectorAll(
      'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
}

// ── Product Grid Rendering ─────────────────────────────────────

function renderProductGrid() {
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  var categories = [
    { key: 'flower-wall', label: 'Flower Walls', sublabel: '$80/hr \u00B7 $360/day' },
    { key: 'twin-arches', label: 'Flower Arches', sublabel: '$70/hr \u00B7 $315/day' },
    { key: 'photo-booth', label: 'Photo Booths', sublabel: '$180/hr \u00B7 $810/day' },
    { key: 'led-sign', label: 'LED Signs', sublabel: '$30 flat rate' },
    { key: 'wedding-combo', label: 'Wedding Combo', sublabel: '$135/hr \u00B7 $540/day' },
    { key: 'style-your-wall', label: 'Style Your Wall', sublabel: 'From $30' }
  ];

  var html = '';
  categories.forEach(function (cat) {
    var products = PRODUCTS.filter(function (p) { return p.category === cat.key; });
    if (!products.length) return;

    html += '<div class="modal-category">';
    html += '<h4 class="modal-category-label">' + cat.label +
      ' <span class="modal-category-price">' + cat.sublabel + '</span></h4>';
    html += '<div class="modal-product-list">';

    products.forEach(function (p) {
      var priceText = p.hourly_rate
        ? '$' + p.hourly_rate + '/hr \u00B7 $' + p.daily_rate + '/day'
        : '$' + p.daily_rate + ' flat';

      html += '<label class="modal-product-card" for="product-' + p.id + '">' +
        '<input type="checkbox" id="product-' + p.id + '" name="products" value="' + p.id + '">' +
        '<span class="modal-product-check">' +
        '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</span>' +
        '<span class="modal-product-name">' + p.name + '</span>' +
        '<span class="modal-product-price">' + priceText + '</span>' +
        '</label>';
    });

    html += '</div></div>';
  });

  grid.innerHTML = html;
}

// ── Rental Type Toggle ─────────────────────────────────────────

function setRentalType(type) {
  document.querySelectorAll('.rental-toggle-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  var hidden = document.getElementById('rental-type-value');
  if (hidden) hidden.value = type;
}

// ── Form Validation ────────────────────────────────────────────

function validateForm() {
  var form = document.getElementById('inquiry-form');
  var errors = [];

  var name = form.querySelector('#customer-name').value.trim();
  var email = form.querySelector('#customer-email').value.trim();
  var phone = form.querySelector('#customer-phone').value.trim();
  var eventDate = form.querySelector('#event-date').value;
  var eventType = form.querySelector('#event-type').value;
  var checked = form.querySelectorAll('input[name="products"]:checked');

  if (!checked.length) errors.push('Please select at least one product.');
  if (!name) errors.push('Please enter your name.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
  if (!phone || phone.replace(/\D/g, '').length < 10) errors.push('Please enter a valid phone number.');
  if (!eventDate) errors.push('Please select your event date.');
  if (!eventType) errors.push('Please select your event type.');

  return errors;
}

// ── Inquiry Code Generation ────────────────────────────────────

function generateInquiryCode(primaryProductId) {
  var now = new Date();
  var y = now.getFullYear();
  var m = String(now.getMonth() + 1).padStart(2, '0');
  var d = String(now.getDate()).padStart(2, '0');
  var dateStr = '' + y + m + d;

  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var rand = '';
  for (var i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  var cleanId = primaryProductId.replace('-', '');
  return 'INQ-' + cleanId + '-' + dateStr + '-' + rand;
}

// ── Form Submission ────────────────────────────────────────────

function submitInquiry(e) {
  e.preventDefault();

  var errorsArr = validateForm();
  if (errorsArr.length) {
    showFormErrors(errorsArr);
    return;
  }

  var form = document.getElementById('inquiry-form');
  var submitBtn = form.querySelector('.modal-submit-btn');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending\u2026';
  submitBtn.classList.add('loading');

  // Clear previous errors
  var errEl = document.getElementById('modal-form-errors');
  errEl.style.display = 'none';
  errEl.textContent = '';

  var checkedBoxes = form.querySelectorAll('input[name="products"]:checked');
  var selectedProducts = Array.from(checkedBoxes).map(function (cb) {
    return PRODUCTS.find(function (p) { return p.id === cb.value; });
  }).filter(Boolean);

  var primaryProduct = selectedProducts[0];
  var inquiryCode = generateInquiryCode(primaryProduct.id);
  var rentalType = document.getElementById('rental-type-value').value;

  var payload = {
    customer: {
      name: form.querySelector('#customer-name').value.trim(),
      email: form.querySelector('#customer-email').value.trim(),
      phone: form.querySelector('#customer-phone').value.trim(),
      event_date: form.querySelector('#event-date').value,
      event_type: form.querySelector('#event-type').value,
      message: form.querySelector('#customer-message').value.trim()
    },
    products: selectedProducts.map(function (p) {
      return { id: p.id, category: p.category, name: p.name, hourly_rate: p.hourly_rate, daily_rate: p.daily_rate };
    }),
    rental_type: rentalType,
    inquiry_code: inquiryCode,
    submitted_at: new Date().toISOString(),
    source: "website"
  };

  if (WEBHOOK_URL.indexOf('YOUR-N8N-INSTANCE') !== -1) {
    console.warn('H&L Inquiry: Webhook URL not configured. Payload:', payload);
  }

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      showSuccessState(inquiryCode);
    })
    .catch(function () {
      showSuccessState(inquiryCode);
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
      submitBtn.classList.remove('loading');
    });
}

// ── UI State Helpers ───────────────────────────────────────────

function showSuccessState(inquiryCode) {
  document.getElementById('modal-form-state').style.display = 'none';
  var success = document.getElementById('modal-success-state');
  success.style.display = 'flex';
  document.getElementById('inquiry-code-display').textContent = inquiryCode;
}

function showFormErrors(errors) {
  var el = document.getElementById('modal-form-errors');
  el.textContent = '';
  errors.forEach(function (msg) {
    var p = document.createElement('p');
    p.textContent = msg;
    el.appendChild(p);
  });
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Initialize ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  renderProductGrid();

  // Overlay click closes modal
  document.getElementById('inquiry-overlay')
    .addEventListener('click', closeInquiryModal);

  // Close button
  document.getElementById('modal-close-btn')
    .addEventListener('click', closeInquiryModal);

  // Keyboard: escape + focus trap
  document.addEventListener('keydown', handleModalKeydown);

  // Form submit
  document.getElementById('inquiry-form')
    .addEventListener('submit', submitInquiry);

  // Rental type toggle
  document.querySelectorAll('.rental-toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { setRentalType(btn.dataset.type); });
  });

  // Wire CTA buttons with data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var target = btn.getAttribute('data-open-modal');
      var preselect = [];

      if (target === 'arch') preselect = ['TA-001'];
      else if (target === 'booth') preselect = ['PB-001'];
      else if (target === 'combo') preselect = ['FW-003', 'TA-001'];
      else if (target === 'style-wall') preselect = ['SYW-003'];
      else {
        var match = PRODUCTS.find(function(p) { return p.id === target; });
        if (match) preselect = [match.id];
      }

      openInquiryModal(preselect);
    });
  });

  // Set minimum date on date picker to today
  var dateInput = document.getElementById('event-date');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }
});
