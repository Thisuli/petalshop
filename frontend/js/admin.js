// ================================
// PETALSHOP — ADMIN JS
// ================================

// ─── ADMIN PRODUCTS DATA ─────────────────
const adminProducts = [
  { id:1, name:'Red Rose Bouquet (12 pcs)',  code:'#PRD-001',
    cat:'Roses',      price:24.99, stock:28, status:'instock',
    image:'../../images/rose-red.jpg',      emoji:'🌹', bg:'#FFF0F3' },
  { id:2, name:'Sunny Day Arrangement',      code:'#PRD-002',
    cat:'Sunflowers', price:18.99, stock:4,  status:'lowstock',
    image:'../../images/sunflower.jpg',     emoji:'🌻', bg:'#FFFBEB' },
  { id:3, name:'Pink Tulip Bundle (20 pcs)', code:'#PRD-003',
    cat:'Tulips',     price:29.99, stock:0,  status:'outstock',
    image:'../../images/tulip-pink.jpg',    emoji:'🌷', bg:'#F0FFF4' },
  { id:4, name:'Cherry Blossom Special',     code:'#PRD-004',
    cat:'Seasonal',   price:49.99, stock:16, status:'instock',
    image:'../../images/cherry-blossom.jpg',emoji:'🌸', bg:'#FFF0F8' },
  { id:5, name:'Mixed Spring Bouquet',       code:'#PRD-005',
    cat:'Bouquets',   price:39.99, stock:11, status:'instock',
    image:'../../images/bouquet-spring.jpg',emoji:'💐', bg:'#FFF8E1' },
  { id:6, name:'Luxury Gift Bouquet',        code:'#PRD-006',
    cat:'Bouquets',   price:59.99, stock:8,  status:'lowstock',
    image:'../../images/bouquet-luxury.jpg',emoji:'🎁', bg:'#FFF0E6' },
  { id:7, name:'White Rose Elegance',        code:'#PRD-007',
    cat:'Roses',      price:29.99, stock:15, status:'instock',
    image:'../../images/rose-white.jpg',    emoji:'🌹', bg:'#FFF5F5' },
  { id:8, name:'White Daisy Garden Box',     code:'#PRD-008',
    cat:'Seasonal',   price:22.99, stock:22, status:'instock',
    image:'../../images/daisy-white.jpg',   emoji:'🌼', bg:'#F0F8FF' },
];

// ─── ADMIN ORDERS DATA ───────────────────
const adminOrders = [
  {
    id:'PS-2025-0058', date:'May 5, 2025', time:'10:32 AM',
    customer:{ name:'Thisuli G.', email:'thisuli@example.com',
               initials:'TG', color:'#F5C518' },
    items:[
      { emoji:'🌹', bg:'#FFF0F3', image:'../../images/rose-red.jpg' },
      { emoji:'🌻', bg:'#FFFBEB', image:'../../images/sunflower.jpg' },
      { emoji:'🌸', bg:'#FFF0F8', image:'../../images/cherry-blossom.jpg' },
    ],
    total:92.95, payment:'paid', status:'New'
  },
  {
    id:'PS-2025-0057', date:'May 5, 2025', time:'9:15 AM',
    customer:{ name:'Amaya K.', email:'amaya@example.com',
               initials:'AK', color:'#DBEAFE' },
    items:[
      { emoji:'🌷', bg:'#F0FFF4', image:'../../images/tulip-pink.jpg' },
      { emoji:'💐', bg:'#FFF8E1', image:'../../images/bouquet-spring.jpg' },
    ],
    total:69.98, payment:'paid', status:'Processing'
  },
  {
    id:'PS-2025-0056', date:'May 4, 2025', time:'4:45 PM',
    customer:{ name:'Nimal P.', email:'nimal@example.com',
               initials:'NP', color:'#F0FFF4' },
    items:[
      { emoji:'🌹', bg:'#FFF0F3', image:'../../images/rose-red.jpg' },
    ],
    total:24.99, payment:'pending', status:'Shipped'
  },
  {
    id:'PS-2025-0055', date:'May 4, 2025', time:'11:20 AM',
    customer:{ name:'Sithumi R.', email:'sithumi@example.com',
               initials:'SR', color:'#FEE2E2' },
    items:[
      { emoji:'🌻', bg:'#FFFBEB', image:'../../images/sunflower.jpg' },
      { emoji:'🌸', bg:'#FFF0F8', image:'../../images/cherry-blossom.jpg' },
    ],
    total:68.98, payment:'paid', status:'Delivered'
  },
  {
    id:'PS-2025-0054', date:'May 3, 2025', time:'3:10 PM',
    customer:{ name:'Kavya M.', email:'kavya@example.com',
               initials:'KM', color:'#EEF2FF' },
    items:[
      { emoji:'💐', bg:'#FFF8E1', image:'../../images/bouquet-spring.jpg' },
    ],
    total:39.99, payment:'paid', status:'Cancelled'
  },
];

// ─── PAGE DETECTION ──────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const isDashboard = document.getElementById('productsTableBody');
  const isOrders    = document.getElementById('ordersTableBody');

  if (isDashboard) renderProductsTable(adminProducts);
  if (isOrders)    renderOrdersTable(adminOrders);

  loadAdminInfo();
});

// ─── LOAD ADMIN INFO ─────────────────────
function loadAdminInfo() {
  const user = JSON.parse(
    localStorage.getItem('petalshop_currentUser')
  );
  if (!user) return;

  const avatarEl = document.getElementById('adminAvatar');
  const nameEl   = document.getElementById('adminName');
  if (!avatarEl || !nameEl) return;

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean).join(' ') || user.name || 'Admin';
  const parts = fullName.split(' ');
  avatarEl.textContent = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : fullName[0];
  nameEl.textContent = `${fullName} · Admin`;
}

// ─── RENDER PRODUCTS TABLE ───────────────
function renderProductsTable(products) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  tbody.innerHTML = products.map(function(p) {
    const stockBadge =
      p.status === 'instock'
        ? `<span class="badge-instock">✅ In stock</span>`
      : p.status === 'lowstock'
        ? `<span class="badge-lowstock">⚠️ Low stock</span>`
        : `<span class="badge-outstock">❌ Out of stock</span>`;

    return `
      <tr>
        <td>
          <div class="prod-cell">
            <div class="prod-thumb" style="background:${p.bg}">
              <img src="${p.image}" alt="${p.name}"
                   onerror="this.style.display='none';
                            this.nextElementSibling.style.display='flex'"/>
              <div class="prod-thumb-emoji"
                   style="display:none">${p.emoji}</div>
            </div>
            <div>
              <div class="prod-name-text">${p.name}</div>
              <div class="prod-id-text">${p.code}</div>
            </div>
          </div>
        </td>
        <td>${p.cat}</td>
        <td><strong>$${p.price.toFixed(2)}</strong></td>
        <td>${p.stock} units</td>
        <td>${stockBadge}</td>
        <td>
          <button class="btn-edit"
            onclick="editProduct(${p.id})">
            ✏️ Edit
          </button>
          <button class="btn-delete"
            onclick="deleteProduct(${p.id})">
            🗑 Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── FILTER PRODUCTS TABLE ───────────────
function filterProducts() {
  const search   = (document.getElementById('productSearch')?.value || '')
                     .toLowerCase();
  const cat      = document.getElementById('catFilter')?.value || '';
  const stockSt  = document.getElementById('stockFilter')?.value || '';

  const filtered = adminProducts.filter(function(p) {
    const matchSearch = p.name.toLowerCase().includes(search)
                     || p.code.toLowerCase().includes(search);
    const matchCat    = !cat      || p.cat.toLowerCase() === cat.toLowerCase();
    const matchStock  = !stockSt  || p.status === stockSt;
    return matchSearch && matchCat && matchStock;
  });

  renderProductsTable(filtered);
}

// ─── EDIT / DELETE PRODUCT ───────────────
function editProduct(id) {
  const p = adminProducts.find(x => x.id === id);
  if (p) alert(`✏️ Edit: ${p.name}\n\n(Backend API will handle this in May 14)`);
}
function deleteProduct(id) {
  const p = adminProducts.find(x => x.id === id);
  if (p && confirm(`🗑 Delete "${p.name}"?\n\nThis will be permanent.`)) {
    alert(`Deleted! (Backend API will handle this in May 15)`);
  }
}

// ─── SHOW ADD FORM ───────────────────────
function showAddForm() {
  alert('➕ Add Product form\n\n(This will connect to the backend API in May 14)');
}

// ─── RENDER ORDERS TABLE ─────────────────
function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  // Status badges map
  const statusBadges = {
    'New':        `<span class="os-new">🆕 New</span>`,
    'Processing': `<span class="os-processing">⏳ Processing</span>`,
    'Shipped':    `<span class="os-shipped">🚚 Shipped</span>`,
    'Delivered':  `<span class="os-delivered">✅ Delivered</span>`,
    'Cancelled':  `<span class="os-cancelled">❌ Cancelled</span>`,
  };

  tbody.innerHTML = orders.map(function(order) {
    const payBadge = order.payment === 'paid'
      ? `<span class="pay-paid">✅ Paid</span>`
      : `<span class="pay-pending">⏳ Pending</span>`;

    const statusBadge = statusBadges[order.status]
      || `<span class="os-processing">${order.status}</span>`;

    const thumbsHTML = order.items.map(function(item) {
      return `
        <div class="it-thumb" style="background:${item.bg}">
          <img src="${item.image}" alt=""
               onerror="this.style.display='none';
                        this.nextElementSibling.textContent='${item.emoji}'"/>
          <span style="font-size:13px"></span>
        </div>
      `;
    }).join('');

    return `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <div class="cust-cell">
            <div class="cust-av"
                 style="background:${order.customer.color}">
              ${order.customer.initials}
            </div>
            <div>
              <span class="cust-name">${order.customer.name}</span>
              <span class="cust-email">${order.customer.email}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="items-thumbs">${thumbsHTML}</div>
        </td>
        <td><strong>$${order.total.toFixed(2)}</strong></td>
        <td>${payBadge}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="color:#1a1a1a;font-size:12px;font-weight:700">
            ${order.date}
          </div>
          <div style="color:#aaa;font-size:11px">${order.time}</div>
        </td>
        <td>
          <button class="btn-view-order"
            onclick="viewOrder('${order.id}')">
            👁 View
          </button>
          <button class="btn-update-order"
            onclick="updateOrder('${order.id}')">
            ✏️ Update
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── FILTER ORDERS (ADMIN) ───────────────
function filterOrdersAdmin() {
  const search = (document.getElementById('orderSearch')?.value || '')
                   .toLowerCase();
  const status = document.getElementById('statusFilter')?.value || '';

  const filtered = adminOrders.filter(function(o) {
    const matchSearch = o.id.toLowerCase().includes(search)
                     || o.customer.name.toLowerCase().includes(search)
                     || o.customer.email.toLowerCase().includes(search);
    const matchStatus = !status || o.status === status;
    return matchSearch && matchStatus;
  });

  renderOrdersTable(filtered);
}

// ─── DATE PILL ───────────────────────────
function setDatePill(type, btn) {
  document.querySelectorAll('.dpill')
    .forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Date filtering would use real dates in backend phase
}

// ─── VIEW / UPDATE ORDER ─────────────────
function viewOrder(id) {
  alert(`👁 View Order #${id}\n\n(Full order details will show here)`);
}
function updateOrder(id) {
  const statuses = ['New','Processing','Shipped','Delivered','Cancelled'];
  const current  = adminOrders.find(o => o.id === id);
  if (!current)  return;
  const newStatus = prompt(
    `Update order #${id}\nCurrent: ${current.status}\n\nNew status (New/Processing/Shipped/Delivered/Cancelled):`,
    current.status
  );
  if (newStatus && statuses.includes(newStatus)) {
    current.status = newStatus;
    renderOrdersTable(adminOrders);
    alert(`✅ Order #${id} updated to: ${newStatus}`);
  }
}