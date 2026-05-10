// ================================
// PETALSHOP — ORDER HISTORY JS
// ================================

// Demo orders so page always looks good
const demoOrders = [
  {
    id: 'PS-2025-0042',
    date: 'Apr 27, 2025',
    time: '10:30 AM',
    status: 'Delivered',
    total: 87.95,
    items: [
      { name:'Red Rose Bouquet', emoji:'🌹', bgColor:'#FFF0F3',
        image:'../images/rose-red.jpg', quantity:1, price:24.99 },
      { name:'Sunny Day Arrangement', emoji:'🌻', bgColor:'#FFFBEB',
        image:'../images/sunflower.jpg', quantity:2, price:18.99 },
      { name:'Cherry Blossom Special', emoji:'🌸', bgColor:'#FFF0F8',
        image:'../images/cherry-blossom.jpg', quantity:1, price:49.99 },
    ],
    deliveredOn: 'Apr 28, 2025'
  },
  {
    id: 'PS-2025-0051',
    date: 'Apr 29, 2025',
    time: '2:15 PM',
    status: 'Shipped',
    total: 52.98,
    items: [
      { name:'Pink Tulip Bundle', emoji:'🌷', bgColor:'#F0FFF4',
        image:'../images/tulip-pink.jpg', quantity:1, price:29.99 },
      { name:'Mixed Spring Bouquet', emoji:'💐', bgColor:'#FFF8E1',
        image:'../images/bouquet-spring.jpg', quantity:1, price:39.99 },
    ],
    eta: 'Apr 30, 2025',
    progress: 75  // percent
  },
  {
    id: 'PS-2025-0038',
    date: 'Apr 10, 2025',
    time: '9:00 AM',
    status: 'Cancelled',
    total: 22.99,
    items: [
      { name:'White Daisy Garden Box', emoji:'🌼', bgColor:'#F0F8FF',
        image:'../images/daisy-white.jpg', quantity:1, price:22.99 },
    ],
    refundNote: 'Order cancelled on Apr 10, 2025. Refund of $22.99 processed ✓'
  }
];

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
  loadUserInfo();

  // Merge demo orders + real orders from localStorage
  const realOrders = JSON.parse(localStorage.getItem('petalshop_orders')) || [];
  const allOrders  = [...realOrders, ...demoOrders];

  renderOrders(allOrders);
  updateStats(allOrders);
});

// ─── LOAD USER INFO ──────────────────────
function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem('petalshop_currentUser'));
  if (!user) return;

  const avatarEl = document.getElementById('userAvatar');
  const nameEl   = document.getElementById('userName');
  const emailEl  = document.getElementById('userEmail');

  if (nameEl)   nameEl.textContent  = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User';
  if (emailEl)  emailEl.textContent = user.email || '';
  if (avatarEl) {
    const name  = nameEl ? nameEl.textContent : 'U';
    const parts = name.split(' ');
    avatarEl.textContent = parts.length >= 2
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : name[0].toUpperCase();
  }
}

// ─── RENDER ORDERS ───────────────────────
function renderOrders(orders) {
  const listEl   = document.getElementById('ordersList');
  const noOrders = document.getElementById('noOrders');

  // Filter
  const filtered = orders.filter(function(o) {
    if (currentFilter === 'all')       return true;
    if (currentFilter === 'active')    return o.status === 'Processing' || o.status === 'Shipped';
    if (currentFilter === 'delivered') return o.status === 'Delivered';
    if (currentFilter === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  if (filtered.length === 0) {
    if (listEl)   listEl.innerHTML       = '';
    if (noOrders) noOrders.style.display = 'block';
    return;
  }
  if (noOrders) noOrders.style.display = 'none';

  if (listEl) {
    listEl.innerHTML = filtered.map(function(order) {

      // Status badge HTML
      const statusMap = {
        'Delivered':  { cls:'s-delivered', icon:'✅' },
        'Shipped':    { cls:'s-shipped',   icon:'🚚' },
        'Processing': { cls:'s-processing',icon:'⏳' },
        'Cancelled':  { cls:'s-cancelled', icon:'❌' },
      };
      const st = statusMap[order.status] || { cls:'s-processing', icon:'⏳' };
      const badgeHTML = `
        <span class="status-badge ${st.cls}">
          ${st.icon} ${order.status}
        </span>`;

      // Thumbnails
      const thumbsHTML = (order.items || []).map(function(item) {
        return `
          <div class="order-thumb"
               style="background:${item.bgColor || '#FFF9E6'}">
            <img src="${item.image || ''}"
                 alt="${item.name}"
                 onerror="this.style.display='none';
                          this.nextElementSibling.textContent='${item.emoji||'🌸'}'"/>
            <span style="font-size:20px"></span>
          </div>
        `;
      }).join('');

      // Progress bar (for Shipped orders)
      let progressHTML = '';
      if (order.status === 'Shipped') {
        const pct = order.progress || 75;
        progressHTML = `
          <div class="progress-wrap">
            <div class="prog-bar">
              <div class="prog-fill" style="width:${pct}%"></div>
            </div>
            <div class="prog-steps">
              <span class="pstep done">Ordered ✓</span>
              <span class="pstep done">Packed ✓</span>
              <span class="pstep ${pct >= 75 ? 'done' : ''}">
                Shipped ${pct >= 75 ? '✓' : ''}
              </span>
              <span class="pstep">Delivered</span>
            </div>
          </div>
        `;
      }

      // Refund note for cancelled
      const refundHTML = order.status === 'Cancelled' && order.refundNote
        ? `<div class="refund-note">${order.refundNote}</div>`
        : '';

      // Meta text
      let metaText = `${order.items ? order.items.length : 0} item${order.items && order.items.length !== 1 ? 's' : ''}`;
      if (order.status === 'Delivered' && order.deliveredOn)
        metaText += ` · Delivered ${order.deliveredOn}`;
      if (order.status === 'Shipped' && order.eta)
        metaText += ` · ETA: ${order.eta}`;
      if (order.status === 'Cancelled')
        metaText += ` · Refund processed ✓`;

      // Action buttons
      let btnsHTML = '';
      if (order.status === 'Delivered') {
        btnsHTML = `
          <div class="order-btns">
            <button class="btn-reorder"
              onclick="reorderItems(${JSON.stringify(order.items).replace(/"/g,'&quot;')})">
              🔄 Reorder
            </button>
            <a class="btn-view-detail" href="#">
              View details →
            </a>
          </div>`;
      } else if (order.status === 'Shipped') {
        btnsHTML = `
          <div class="order-btns">
            <button class="btn-reorder">📍 Track</button>
            <a class="btn-view-detail" href="#">
              View details →
            </a>
          </div>`;
      } else {
        btnsHTML = `
          <div class="order-btns">
            <a class="btn-view-detail" href="#">
              View details →
            </a>
          </div>`;
      }

      return `
        <div class="order-card">
          <div class="order-top">
            <div>
              <div class="order-id">#${order.id} 🌸</div>
              <div class="order-date">
                Placed: ${order.date} · ${order.time}
              </div>
            </div>
            ${badgeHTML}
          </div>

          <div class="order-thumbs">${thumbsHTML}</div>

          ${progressHTML}
          ${refundHTML}

          <div class="order-footer">
            <div class="order-total-info">
              <span class="order-total">
                $${(order.total || 0).toFixed(2)}
              </span>
              <span class="order-meta">${metaText}</span>
            </div>
            ${btnsHTML}
          </div>
        </div>
      `;
    }).join('');
  }
}

// ─── UPDATE STATS ────────────────────────
function updateStats(orders) {
  const totalSpent    = orders.reduce((s, o) => s + (o.total || 0), 0);
  const deliveredCount= orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount= orders.filter(o => o.status === 'Cancelled').length;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('statTotal',     orders.length);
  set('statSpent',     `$${totalSpent.toFixed(0)}`);
  set('statDelivered', deliveredCount);
  set('statCancelled', cancelledCount);
}

// ─── FILTER ORDERS ───────────────────────
function filterOrders(filter, btn) {
  currentFilter = filter;

  document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const realOrders = JSON.parse(localStorage.getItem('petalshop_orders')) || [];
  const allOrders  = [...realOrders, ...demoOrders];
  renderOrders(allOrders);
}

// ─── REORDER ─────────────────────────────
function reorderItems(items) {
  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  items.forEach(function(item) {
    const existing = cart.find(c => c.name === item.name);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push({
        id:       item.id || Math.random(),
        name:     item.name,
        price:    item.price,
        image:    item.image,
        emoji:    item.emoji,
        bgColor:  item.bgColor,
        category: item.category || 'flowers',
        quantity: item.quantity
      });
    }
  });
  localStorage.setItem('petalshop_cart', JSON.stringify(cart));
  window.location.href = 'cart.html';
}

// ─── UPDATE CART COUNT ───────────────────
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el    = document.getElementById('cartCount');
  if (el) el.textContent = total;
}