// ================================
// ORDER SUCCESS JS
// ================================

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  loadOrderDetails();
});

function loadOrderDetails() {
  // Get the last order placed
  const order = JSON.parse(
    localStorage.getItem('petalshop_last_order')
  );

  // Load user info
  const user = JSON.parse(
    localStorage.getItem('petalshop_currentUser')
  );

  // Set customer name
  if (user) {
    const name = user.firstName || user.name || 'Thisuli';
    const el = document.getElementById('customerName');
    if (el) el.textContent = name;

    const emailEl = document.getElementById('confirmEmail');
    if (emailEl) emailEl.textContent = user.email || 'thisuli@example.com';
  }

  if (!order) {
    // Show demo data if no real order
    showDemoOrder();
    return;
  }

  // Order reference
  const refEl = document.getElementById('orderRefNum');
  if (refEl) refEl.textContent = `#${order.id}`;

  // Address
  const addrEl = document.getElementById('diAddress');
  if (addrEl && order.address) {
    addrEl.textContent =
      `${order.address.address || '45 Galle Road'}, ${order.address.city || 'Colombo 03'}`;
  }

  // Payment method
  const payEl = document.getElementById('diPayment');
  if (payEl) {
    const payMap = {
      card:   'Credit card ****4242',
      paypal: 'PayPal',
      cash:   'Cash on delivery'
    };
    payEl.textContent = payMap[order.payment] || 'Credit card ****4242';
  }

  // Delivery method
  const methodEl = document.getElementById('diMethod');
  if (methodEl) {
    methodEl.textContent = 'Same-day delivery';
  }

  // Build order items
  const itemsEl = document.getElementById('successItems');
  if (itemsEl && order.items) {
    itemsEl.innerHTML = order.items.map(function(item) {
      const meta = item.quantity > 1
        ? `Qty: ${item.quantity} · Fresh 5+ days`
        : `Qty: ${item.quantity} · Gift-wrapped 🎀`;
      return `
        <div class="sum-item">
          <div class="sum-item-img"
               style="background:${item.bgColor || '#FFF9E6'}">
            <img src="${item.image || ''}"
                 alt="${item.name}"
                 onerror="this.style.display='none';
                          this.nextElementSibling.style.display='flex'"/>
            <div class="sum-item-img-emoji"
                 style="display:none">${item.emoji || '🌸'}</div>
          </div>
          <div class="sum-item-info">
            <span class="sum-item-name">${item.name}</span>
            <span class="sum-item-meta">${meta}</span>
          </div>
          <div class="sum-item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    }).join('');
  }

  // Summary numbers
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('sucSubtotal', `$${(order.subtotal || 0).toFixed(2)}`);

  if (order.saved && order.saved > 0) {
    set('sucDiscount', `−$${order.saved.toFixed(2)}`);
    const discEl = document.getElementById('sucDiscount');
    if (discEl) discEl.style.color = '#16A34A';
  }

  const delEl = document.getElementById('sucDelivery');
  if (delEl) {
    delEl.textContent = order.delivery === 0
      ? 'Free 🚚'
      : `$${(order.delivery || 5).toFixed(2)}`;
    delEl.style.color = order.delivery === 0 ? '#16A34A' : '#1a1a1a';
  }

  set('sucTotal', `$${(order.total || 0).toFixed(2)}`);

  if (order.saved && order.saved > 0) {
    const savedEl = document.getElementById('sucSaved');
    const amtEl   = document.getElementById('sucSavedAmt');
    if (savedEl) savedEl.style.display = 'flex';
    if (amtEl)   amtEl.textContent     = `$${order.saved.toFixed(2)}`;
  }
}

// Demo order when no real order exists
function showDemoOrder() {
  const demoItems = [
    { name:'Red Rose Bouquet',      emoji:'🌹',
      bgColor:'#FFF0F3', image:'../images/rose-red.jpg',
      quantity:1, price:24.99 },
    { name:'Sunny Day Arrangement', emoji:'🌻',
      bgColor:'#FFFBEB', image:'../images/sunflower.jpg',
      quantity:2, price:18.99 },
    { name:'Cherry Blossom Special',emoji:'🌸',
      bgColor:'#FFF0F8', image:'../images/cherry-blossom.jpg',
      quantity:1, price:49.99 },
  ];

  const itemsEl = document.getElementById('successItems');
  if (itemsEl) {
    itemsEl.innerHTML = demoItems.map(function(item) {
      const meta = item.quantity > 1
        ? `Qty: ${item.quantity} · Fresh 5+ days`
        : `Qty: ${item.quantity} · Gift-wrapped 🎀`;
      return `
        <div class="sum-item">
          <div class="sum-item-img"
               style="background:${item.bgColor}">
            <img src="${item.image}" alt="${item.name}"
                 onerror="this.style.display='none';
                          this.nextElementSibling.style.display='flex'"/>
            <div class="sum-item-img-emoji"
                 style="display:none">${item.emoji}</div>
          </div>
          <div class="sum-item-info">
            <span class="sum-item-name">${item.name}</span>
            <span class="sum-item-meta">${meta}</span>
          </div>
          <div class="sum-item-price">
            $${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
    }).join('');
  }

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('sucSubtotal', '$112.96');
  set('sucDiscount', '−$25.01');
  const discEl = document.getElementById('sucDiscount');
  if (discEl) discEl.style.color = '#16A34A';
  set('sucDelivery', '$5.00');
  set('sucTotal',    '$92.95');

  const savedEl = document.getElementById('sucSaved');
  const amtEl   = document.getElementById('sucSavedAmt');
  if (savedEl) savedEl.style.display = 'flex';
  if (amtEl)   amtEl.textContent     = '$25.01';
}

// Share functions
function shareOn(platform) {
  const url = window.location.href;
  const msg = encodeURIComponent(
    'Just ordered beautiful flowers from PetalShop! 🌸 Check them out!'
  );
  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  } else if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${msg}`);
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(function() {
    alert('✅ Link copied to clipboard!');
  });
}

function updateCartCount() {
  const cart  = JSON.parse(
    localStorage.getItem('petalshop_cart')
  ) || [];
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el    = document.getElementById('cartCount');
  if (el) el.textContent = total;
}