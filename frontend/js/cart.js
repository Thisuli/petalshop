// ================================
// PETALSHOP — CART JS
// Exact match to Figma design
// ================================

const PROMO_CODES = {
  'BLOOM10': 10,
  'PETAL20': 20,
  'ROSE15':  15,
  'FLOWER5':  5,
};

let appliedDiscount = 0;

// ─── ON PAGE LOAD ────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  renderCart();
  updateCartCount();
});

// ─── RENDER CART ─────────────────────────
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  updateCartCount();

  // Update header item pill
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const pill = document.getElementById('itemPill');
  if (pill) {
    pill.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }

  const listEl    = document.getElementById('cartItemsList');
  const emptyEl   = document.getElementById('emptyCart');
  const stockWarn = document.getElementById('stockWarn');

  if (cart.length === 0) {
    if (listEl)    listEl.innerHTML        = '';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (stockWarn) stockWarn.style.display = 'none';
    updateSummary(cart);
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  // Check low stock
  const hasLow = cart.some(function(item) {
    const p = (window.allProducts||[]).find(x => x.id === item.id);
    return p && p.stock <= 5;
  });
  if (stockWarn) stockWarn.style.display = hasLow ? 'block' : 'none';

  // Build cards
  if (listEl) {
    listEl.innerHTML = cart.map(function(item) {
      const product  = (window.allProducts||[]).find(x => x.id === item.id);
      const stock    = product ? product.stock : 99;

      const lowNote  = stock <= 5
        ? `<span style="color:#EF4444;font-size:11px;font-weight:700;margin-left:6px;">
             ⚠️ Only ${stock} left!
           </span>`
        : '';

      const savedAmt = product && product.oldPrice
        ? ((product.oldPrice - item.price) * item.quantity).toFixed(2)
        : null;

      const savedNote = savedAmt
        ? `<span class="cart-price-saved">Saved $${savedAmt}!</span>`
        : '';

      return `
        <div class="cart-card" id="cartCard-${item.id}">
          <div class="cart-img-box"
               style="background:${item.bgColor || '#FFF9E6'}">
            <img src="${item.image || ''}"
                 alt="${item.name}"
                 onerror="this.style.display='none';
                          this.nextElementSibling.style.display='flex'"/>
            <div class="cart-img-emoji"
                 style="display:none">${item.emoji || '🌸'}</div>
          </div>

          <div class="cart-item-info">
            <p class="cart-item-cat">${item.category || 'Flowers'}</p>
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-meta">
              Freshness: 7+ days · Gift-wrapped 🎀${lowNote}
            </p>
            <div class="cart-item-actions">
              <div class="qty-ctrl">
                <button class="qty-btn"
                  onclick="changeCartQty(${item.id}, -1)">−</button>
                <div class="qty-val" id="qty-${item.id}">
                  ${item.quantity}
                </div>
                <button class="qty-btn"
                  onclick="changeCartQty(${item.id}, 1)">+</button>
              </div>
              <button class="btn-save-wish"
                onclick="saveForLater(${item.id})">
                🤍 Save
              </button>
              <button class="btn-remove"
                onclick="removeFromCart(${item.id})">
                🗑 Remove
              </button>
            </div>
          </div>

          <div class="cart-item-price">
            <span class="cart-price-main">
              $${(item.price * item.quantity).toFixed(2)}
            </span>
            <span class="cart-price-each">
              $${item.price.toFixed(2)} each
            </span>
            ${savedNote}
          </div>
        </div>
      `;
    }).join('');
  }

  updateSummary(cart);
}

// ─── UPDATE SUMMARY ──────────────────────
function updateSummary(cart) {
  const subtotal = cart.reduce((s,i) => s + i.price * i.quantity, 0);

  let totalSaved = 0;
  cart.forEach(function(item) {
    const p = (window.allProducts||[]).find(x => x.id === item.id);
    if (p && p.oldPrice) totalSaved += (p.oldPrice - item.price) * item.quantity;
  });

  const promoSaving  = (subtotal * appliedDiscount) / 100;
  const totalDiscount= totalSaved + promoSaving;
  const delivery     = subtotal > 50 ? 0 : 5;
  const total        = subtotal - promoSaving + delivery;
  const totalItems   = cart.reduce((s,i) => s + i.quantity, 0);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('sumItemCount', totalItems);
  set('sumSubtotal',  `$${subtotal.toFixed(2)}`);
  set('sumDiscount',  totalDiscount > 0 ? `−$${totalDiscount.toFixed(2)}` : '−$0.00');
  set('sumTotal',     `$${total.toFixed(2)}`);

  const discEl = document.getElementById('sumDiscount');
  if (discEl) discEl.style.color = '#16A34A';

  const delEl = document.getElementById('sumDelivery');
  if (delEl) {
    delEl.textContent = delivery === 0 ? 'Free 🚚' : `$${delivery.toFixed(2)}`;
    delEl.style.color = delivery === 0 ? '#16A34A' : '#1a1a1a';
  }

  const sNote = document.getElementById('savingsNote');
  const sAmt  = document.getElementById('savingsAmount');
  if (sNote && sAmt) {
    if (totalDiscount > 0) {
      sAmt.textContent    = `$${totalDiscount.toFixed(2)}`;
      sNote.style.display = 'block';
    } else {
      sNote.style.display = 'none';
    }
  }

  const btn = document.getElementById('checkoutBtn');
  if (btn) {
    btn.style.opacity       = cart.length === 0 ? '0.5' : '1';
    btn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
  }
}

// ─── CHANGE QTY ──────────────────────────
function changeCartQty(id, change) {
  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) { removeFromCart(id); return; }
  if (item.quantity > 20)   item.quantity = 20;

  localStorage.setItem('petalshop_cart', JSON.stringify(cart));
  renderCart();
}

// ─── REMOVE ──────────────────────────────
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('petalshop_cart', JSON.stringify(cart));

  const card = document.getElementById(`cartCard-${id}`);
  if (card) {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(30px)';
    setTimeout(() => renderCart(), 300);
  } else {
    renderCart();
  }
}

// ─── SAVE FOR LATER ──────────────────────
function saveForLater(id) { removeFromCart(id); }

// ─── APPLY PROMO ─────────────────────────
function applyPromo() {
  const input = document.getElementById('promoInput');
  const msgEl = document.getElementById('promoMsg');
  const code  = input.value.trim().toUpperCase();

  if (!code) {
    msgEl.textContent = '⚠️ Please enter a promo code.';
    msgEl.className   = 'promo-msg er';
    return;
  }
  if (PROMO_CODES[code]) {
    appliedDiscount   = PROMO_CODES[code];
    msgEl.textContent = `✓ Code applied! ${appliedDiscount}% off!`;
    msgEl.className   = 'promo-msg ok';
    input.disabled    = true;
    renderCart();
  } else {
    appliedDiscount   = 0;
    msgEl.textContent = '✗ Invalid code. Try BLOOM10!';
    msgEl.className   = 'promo-msg er';
  }
}

// ─── UPDATE CART COUNT ───────────────────
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total = cart.reduce((s,i) => s + i.quantity, 0);
  const el    = document.getElementById('cartCount');
  if (el) el.textContent = total;
}