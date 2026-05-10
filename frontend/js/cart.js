// ================================
// PETALSHOP — CART PAGE JS
// ================================

// Promo codes list
const PROMO_CODES = {
  'BLOOM10' : 10,   // 10% off
  'PETAL20' : 20,   // 20% off
  'ROSE15'  : 15,   // 15% off
  'FLOWER5' : 5,    // 5% off
};

// Track applied promo
let appliedDiscount = 0;

// ─── LOAD CART ON PAGE OPEN ─────────────
document.addEventListener('DOMContentLoaded', function () {
  renderCart();
  updateCartCount();
});

// ─── RENDER ENTIRE CART ─────────────────
function renderCart() {

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  // Update navbar count
  updateCartCount();

  // Update header pill
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const pill = document.getElementById('itemPill');
  if (pill) pill.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  const listEl    = document.getElementById('cartItemsList');
  const emptyEl   = document.getElementById('emptyCart');
  const stockWarn = document.getElementById('stockWarn');

  // Show empty state if cart is empty
  if (cart.length === 0) {
    if (listEl)    listEl.innerHTML   = '';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (stockWarn) stockWarn.style.display = 'none';
    updateSummary(cart);
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  // Check for low stock items — show warning banner
  const hasLowStock = cart.some(function(item) {
    const product = (window.allProducts || [])
      .find(p => p.id === item.id);
    return product && product.stock <= 5;
  });
  if (stockWarn) {
    stockWarn.style.display = hasLowStock ? 'block' : 'none';
  }

  // Build each cart item card
  if (listEl) {
    listEl.innerHTML = cart.map(function(item) {

      // Try to find product data for stock info
      const product = (window.allProducts || [])
        .find(p => p.id === item.id);
      const stock = product ? product.stock : 99;

      const lowStockNote = stock <= 5
        ? `<span style="color:#EF4444;font-size:11px;
                        font-weight:700;">⚠️ Only ${stock} left!</span>`
        : '';

      // Calculate savings if old price exists
      const savedNote = product && product.oldPrice
        ? `<span class="cart-price-saved">
             Saved $${((product.oldPrice - item.price) * item.quantity).toFixed(2)}!
           </span>`
        : '';

      return `
        <div class="cart-card" id="cartCard-${item.id}">

          <!-- Product Image -->
          <div class="cart-img-box"
               style="background:${item.bgColor || '#FFF9E6'}">
            <img
              src="${item.image || ''}"
              alt="${item.name}"
              onerror="this.style.display='none';
                       this.nextElementSibling.style.display='flex'"
            />
            <div class="cart-img-emoji"
                 style="display:none">${item.emoji || '🌸'}</div>
          </div>

          <!-- Product Info -->
          <div class="cart-item-info">
            <p class="cart-item-cat">${item.category || 'Flowers'}</p>
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-meta">
              Freshness: 7+ days &nbsp;·&nbsp; Gift-wrapped 🎀
              ${lowStockNote}
            </p>
            <div class="cart-item-actions">
              <!-- Quantity control -->
              <div class="qty-ctrl">
                <button class="qty-btn"
                  onclick="changeCartQty(${item.id}, -1)">−</button>
                <div class="qty-val" id="qty-${item.id}">
                  ${item.quantity}
                </div>
                <button class="qty-btn"
                  onclick="changeCartQty(${item.id}, 1)">+</button>
              </div>
              <!-- Save to wishlist -->
              <button class="btn-save-wish"
                onclick="saveForLater(${item.id})">
                🤍 Save
              </button>
              <!-- Remove -->
              <button class="btn-remove"
                onclick="removeFromCart(${item.id})">
                🗑 Remove
              </button>
            </div>
          </div>

          <!-- Price on right -->
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

  // Update the order summary
  updateSummary(cart);
}

// ─── UPDATE ORDER SUMMARY ────────────────
function updateSummary(cart) {

  // Calculate subtotal
  const subtotal = cart.reduce(
    (s, i) => s + (i.price * i.quantity), 0
  );

  // Calculate how much was saved (vs old prices)
  let totalSaved = 0;
  cart.forEach(function(item) {
    const product = (window.allProducts || []).find(p => p.id === item.id);
    if (product && product.oldPrice) {
      totalSaved += (product.oldPrice - item.price) * item.quantity;
    }
  });

  // Apply promo discount on top
  const promoSaving = (subtotal * appliedDiscount) / 100;
  const totalDiscount = totalSaved + promoSaving;

  // Delivery — free if over $50
  const delivery = subtotal > 50 ? 0 : 5;
  const deliveryEl = document.getElementById('sumDelivery');
  if (deliveryEl) {
    deliveryEl.textContent = delivery === 0 ? 'Free 🚚' : `$${delivery.toFixed(2)}`;
    deliveryEl.style.color = delivery === 0 ? '#16A34A' : '#1a1a1a';
  }

  // Total
  const total = subtotal - promoSaving + delivery;

  // Update DOM
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const countEl = document.getElementById('sumItemCount');
  if (countEl) countEl.textContent = itemCount;

  const subEl = document.getElementById('sumSubtotal');
  if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;

  const discEl = document.getElementById('sumDiscount');
  if (discEl) {
    discEl.textContent = totalDiscount > 0
      ? `−$${totalDiscount.toFixed(2)}`
      : '−$0.00';
    discEl.style.color = '#16A34A';
  }

  const totalEl = document.getElementById('sumTotal');
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Savings note
  const savingsNote = document.getElementById('savingsNote');
  const savingsAmt  = document.getElementById('savingsAmount');
  if (savingsNote && savingsAmt) {
    if (totalDiscount > 0) {
      savingsAmt.textContent  = `$${totalDiscount.toFixed(2)}`;
      savingsNote.style.display = 'block';
    } else {
      savingsNote.style.display = 'none';
    }
  }

  // Disable checkout if cart empty
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.style.opacity      = '0.5';
      checkoutBtn.style.pointerEvents= 'none';
    } else {
      checkoutBtn.style.opacity      = '1';
      checkoutBtn.style.pointerEvents= 'auto';
    }
  }
}

// ─── CHANGE QUANTITY ─────────────────────
function changeCartQty(productId, change) {

  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const item = cart.find(i => i.id === productId);

  if (!item) return;

  item.quantity += change;

  // If quantity reaches 0, remove from cart
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  // Max 20 per item
  if (item.quantity > 20) item.quantity = 20;

  localStorage.setItem('petalshop_cart', JSON.stringify(cart));

  // Update just the qty display and price (faster than full re-render)
  const qtyEl = document.getElementById(`qty-${productId}`);
  if (qtyEl) qtyEl.textContent = item.quantity;

  // Full re-render to update prices and summary
  renderCart();
}

// ─── REMOVE FROM CART ───────────────────
function removeFromCart(productId) {

  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  // Filter out the removed item
  cart = cart.filter(i => i.id !== productId);

  localStorage.setItem('petalshop_cart', JSON.stringify(cart));

  // Animate removal
  const card = document.getElementById(`cartCard-${productId}`);
  if (card) {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(20px)';
    setTimeout(() => renderCart(), 300);
  } else {
    renderCart();
  }
}

// ─── SAVE FOR LATER (WISHLIST) ──────────
function saveForLater(productId) {
  // Just remove from cart for now
  // (wishlist feature can be expanded later)
  removeFromCart(productId);
}

// ─── APPLY PROMO CODE ───────────────────
function applyPromo() {

  const input   = document.getElementById('promoInput');
  const msgEl   = document.getElementById('promoMsg');
  const code    = input.value.trim().toUpperCase();

  if (!code) {
    msgEl.textContent = '⚠️ Please enter a promo code.';
    msgEl.className   = 'promo-msg er';
    return;
  }

  if (PROMO_CODES[code]) {
    appliedDiscount   = PROMO_CODES[code];
    msgEl.textContent = `✓ Code applied! ${appliedDiscount}% off your order.`;
    msgEl.className   = 'promo-msg ok';
    input.disabled    = true;

    // Re-render to show new discount
    renderCart();
  } else {
    appliedDiscount   = 0;
    msgEl.textContent = '✗ Invalid promo code. Try BLOOM10!';
    msgEl.className   = 'promo-msg er';
  }
}

// ─── UPDATE CART COUNT IN NAVBAR ────────
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el    = document.getElementById('cartCount');
  if (el) el.textContent = total;
}