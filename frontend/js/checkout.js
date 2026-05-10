// ================================
// PETALSHOP — CHECKOUT JS
// ================================

let deliveryCost    = 5;
let selectedPayment = 'card';

document.addEventListener('DOMContentLoaded', function () {
  loadCheckoutItems();
});

// ─── LOAD CART ITEMS INTO SUMMARY ────────
function loadCheckoutItems() {
  const cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  const container = document.getElementById('checkoutItems');
  if (container) {
    container.innerHTML = cart.map(function(item) {
      return `
        <div class="order-item">
          <div class="order-item-img"
               style="background:${item.bgColor || '#FFF9E6'}">
            <img src="${item.image || ''}"
                 alt="${item.name}"
                 onerror="this.style.display='none';
                          this.nextElementSibling.textContent='${item.emoji || '🌸'}'"/>
            <span style="font-size:18px"></span>
          </div>
          <div class="order-item-info">
            <strong>${item.name}</strong>
            <span>Qty: ${item.quantity}</span>
          </div>
          <div class="order-item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    }).join('');
  }

  updateCheckoutSummary();
}

// ─── UPDATE SUMMARY NUMBERS ──────────────
function updateCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  const subtotal = cart.reduce((s,i) => s + i.price * i.quantity, 0);

  // Calculate saved amount
  let saved = 0;
  cart.forEach(function(item) {
    const p = (window.allProducts||[]).find(x => x.id === item.id);
    if (p && p.oldPrice) saved += (p.oldPrice - item.price) * item.quantity;
  });

  const total = subtotal - saved + deliveryCost;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('coSubtotal', `$${subtotal.toFixed(2)}`);
  set('coDiscount', saved > 0 ? `−$${saved.toFixed(2)}` : '−$0.00');
  set('coDelivery', deliveryCost === 0 ? 'Free 🚚' : `$${deliveryCost.toFixed(2)}`);
  set('coTotal',    `$${total.toFixed(2)}`);

  const discEl = document.getElementById('coDiscount');
  if (discEl) discEl.style.color = '#16A34A';

  const delEl = document.getElementById('coDelivery');
  if (delEl) delEl.style.color = deliveryCost === 0 ? '#16A34A' : '#1a1a1a';
}

// ─── SELECT DELIVERY METHOD ──────────────
function selectDelivery(type, cost) {
  deliveryCost = cost;

  // Update card styles
  ['sameday','standard','scheduled'].forEach(function(t) {
    const el = document.getElementById(`dopt-${t}`);
    if (el) el.classList.remove('selected');
  });
  const sel = document.getElementById(`dopt-${type}`);
  if (sel) sel.classList.add('selected');

  // Update label
  const labels = {
    sameday:   'Same-day delivery',
    standard:  'Standard delivery',
    scheduled: 'Scheduled delivery'
  };
  const labelEl = document.getElementById('deliveryLabel');
  if (labelEl) labelEl.textContent = labels[type] || 'Delivery';

  updateCheckoutSummary();
}

// ─── SELECT PAYMENT ──────────────────────
function selectPayment(type) {
  selectedPayment = type;

  // Reset all
  ['card','paypal','cash'].forEach(function(t) {
    const opt    = document.getElementById(`popt-${t}`);
    const radio  = document.getElementById(`radio-${t}`);
    if (opt)   opt.classList.remove('selected');
    if (radio) {
      radio.classList.remove('sel');
      radio.innerHTML = '';
    }
  });

  // Activate selected
  const selOpt   = document.getElementById(`popt-${type}`);
  const selRadio = document.getElementById(`radio-${type}`);
  if (selOpt)   selOpt.classList.add('selected');
  if (selRadio) {
    selRadio.classList.add('sel');
    selRadio.innerHTML = '<div class="radio-dot"></div>';
  }

  // Show/hide card fields
  const cardFields = document.getElementById('cardFields');
  if (cardFields) {
    cardFields.style.display = type === 'card' ? 'block' : 'none';
  }
}

// ─── PLACE ORDER ─────────────────────────
function placeOrder() {
  // Basic validation
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const address   = document.getElementById('address').value.trim();
  const city      = document.getElementById('city').value.trim();
  const phone     = document.getElementById('phone').value.trim();

  if (!firstName || !lastName || !address || !city || !phone) {
    alert('⚠️ Please fill in all required shipping fields!');
    return;
  }

  // Get cart
  const cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Build order object
  const subtotal = cart.reduce((s,i) => s + i.price * i.quantity, 0);
  let saved = 0;
  cart.forEach(function(item) {
    const p = (window.allProducts||[]).find(x => x.id === item.id);
    if (p && p.oldPrice) saved += (p.oldPrice - item.price) * item.quantity;
  });

  const order = {
    id:        'PS-2025-' + String(Date.now()).slice(-4),
    date:      new Date().toLocaleDateString('en-GB',
                 { day:'numeric', month:'short', year:'numeric' }),
    time:      new Date().toLocaleTimeString('en-GB',
                 { hour:'2-digit', minute:'2-digit' }),
    items:     cart,
    subtotal:  subtotal,
    saved:     saved,
    delivery:  deliveryCost,
    total:     subtotal - saved + deliveryCost,
    payment:   selectedPayment,
    status:    'Processing',
    address: {
      firstName, lastName, address, city,
      postal:   document.getElementById('postal').value.trim(),
      province: document.getElementById('province').value.trim(),
      phone,
      note:     document.getElementById('deliveryNote').value.trim()
    }
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('petalshop_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('petalshop_orders', JSON.stringify(orders));

  // Save last order for success page
  localStorage.setItem('petalshop_last_order', JSON.stringify(order));

  // Clear cart
  localStorage.removeItem('petalshop_cart');

  // Go to success page
  window.location.href = 'order-success.html';
}