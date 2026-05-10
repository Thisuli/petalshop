// ================================
// PRODUCT DETAIL — EXACT FIGMA JS
// ================================

let quantity       = 1;
let currentProduct = null;

// Thumbnail emoji fallbacks
const thumbFallbacks = ['🌹','📦','🎀','🌿'];

document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();

  const productId  = parseInt(localStorage.getItem('selectedProductId'));
  currentProduct   = allProducts.find(p => p.id === productId);

  if (!currentProduct) {
    window.location.href = 'products.html';
    return;
  }

  loadProductDetails(currentProduct);
});

// ─────────────────────────────────────────
function loadProductDetails(p) {

  // Page title
  document.title = `PetalShop — ${p.name}`;

  // Breadcrumb
  document.getElementById('bcCategory').textContent =
    p.category.charAt(0).toUpperCase() + p.category.slice(1);
  document.getElementById('bcName').textContent = p.name;

  // Main image
  const mainImg   = document.getElementById('mainImg');
  const mainEmoji = document.getElementById('mainEmoji');
  const mainBox   = document.getElementById('mainImgBox');

  mainBox.style.background = p.bgColor;
  mainImg.src = p.image;
  mainImg.alt = p.name;
  mainEmoji.textContent = p.emoji;

  // Badges — exactly two like Figma
  const badgeLeft  = document.getElementById('badgeLeft');
  const badgeRight = document.getElementById('badgeRight');

  // Always show "New arrival" on left
  badgeLeft.style.display = 'inline-block';

  // Show "Popular" on right only if badge is Popular
  if (p.badge === 'Popular') {
    badgeRight.textContent      = '⭐ Popular';
    badgeRight.style.display    = 'inline-block';
    badgeRight.style.background = '#F5C518';
    badgeRight.style.color      = '#1a1a1a';
  } else if (p.badge === 'Sale') {
    badgeRight.textContent      = 'Sale';
    badgeRight.style.display    = 'inline-block';
    badgeRight.style.background = '#EF4444';
    badgeRight.style.color      = '#ffffff';
  } else if (p.badge === 'New') {
    badgeRight.textContent      = 'New';
    badgeRight.style.display    = 'inline-block';
    badgeRight.style.background = '#22C55E';
    badgeRight.style.color      = '#ffffff';
  }

  // Thumbnails — 4 boxes like Figma
  const thumbsRow = document.getElementById('thumbsRow');
  thumbsRow.innerHTML = thumbFallbacks.map((emoji, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}"
         onclick="switchThumb('${p.image}', this, '${emoji}')">
      <img
        src="${p.image}"
        alt="view ${i+1}"
        onerror="this.style.display='none';
                 this.nextElementSibling.style.display='flex'"
      />
      <div class="thumb-emoji" style="display:none">${emoji}</div>
    </div>
  `).join('');

  // Category tag
  document.getElementById('detailCat').innerHTML =
    `🌹 ${p.category.toUpperCase()} · PREMIUM COLLECTION`;

  // Title
  document.getElementById('detailTitle').textContent = p.name;

  // Stars
  const full = Math.floor(p.rating);
  document.getElementById('detailStars').textContent =
    '★'.repeat(full) + '☆'.repeat(5 - full);

  // Score + reviews
  document.getElementById('detailScore').textContent   = p.rating;
  document.getElementById('detailReviews').textContent =
    `(${p.reviews} reviews)`;
  document.getElementById('reviewCount').textContent   = p.reviews;

  // Sold count
  document.getElementById('detailSold').textContent =
    `${(p.reviews * 9).toLocaleString()} sold`;

  // Price
  document.getElementById('detailPrice').textContent =
    `$${p.price.toFixed(2)}`;
  document.getElementById('buyNowPrice').textContent =
    `$${p.price.toFixed(2)}`;

  // Old price + save badge
  if (p.oldPrice) {
    document.getElementById('detailOldPrice').textContent =
      `$${p.oldPrice.toFixed(2)}`;
    const saved = (p.oldPrice - p.price).toFixed(0);
    const sb    = document.getElementById('detailSaveBadge');
    sb.textContent   = `Save $${saved}`;
    sb.style.display = 'inline-block';
  }

  // Stock
  document.getElementById('stockCount').textContent = p.stock;
  if (p.stock <= 5) {
    const sb = document.getElementById('stockBadge');
    sb.textContent = `⚠️ Only ${p.stock} left — order soon!`;
    sb.classList.add('low');
  }

  // Description
  document.getElementById('detailDescription').textContent =
    p.description;

  // Occasion tags — exactly like Figma
  const emojiMap = {
    'Birthday':    '🎂',
    'Anniversary': '💍',
    'Romance':     '💑',
    'Wedding':     '👰',
    'Sympathy':    '🕊️',
    'Long-lasting':'🌿',
    'Gift-ready':  '🎁',
  };

  // Add Long-lasting and Gift-ready to every product
  const allTags = [...(p.occasion || []), 'Long-lasting', 'Gift-ready'];

  document.getElementById('occasionTags').innerHTML =
    allTags.map(tag => `
      <span class="occasion-tag">
        ${emojiMap[tag] || '🌸'} ${tag}
      </span>
    `).join('');
}

// ─── Switch thumbnail ───────────────────
function switchThumb(src, el, emoji) {
  const mainImg   = document.getElementById('mainImg');
  const mainEmoji = document.getElementById('mainEmoji');

  mainImg.src = src;
  mainImg.style.display   = 'block';
  mainEmoji.style.display = 'none';

  document.querySelectorAll('.thumb')
    .forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ─── Quantity ───────────────────────────
function changeQty(change) {
  quantity += change;
  if (quantity < 1)  quantity = 1;
  if (quantity > 20) quantity = 20;
  document.getElementById('qtyVal').textContent = quantity;
}

// ─── Add to cart ────────────────────────
function addToCartDetail() {
  if (!currentProduct) return;

  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const existing = cart.find(i => i.id === currentProduct.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id:       currentProduct.id,
      name:     currentProduct.name,
      price:    currentProduct.price,
      image:    currentProduct.image,
      emoji:    currentProduct.emoji,
      bgColor:  currentProduct.bgColor,
      category: currentProduct.category,
      quantity: quantity
    });
  }

  localStorage.setItem('petalshop_cart', JSON.stringify(cart));
  updateCartCount();

  // Button feedback
  const btn = document.querySelector('.btn-atc');
  const orig = btn.innerHTML;
  btn.innerHTML  = '✓ Added to cart!';
  btn.style.background = '#22C55E';
  btn.style.color      = '#fff';
  btn.style.border     = '1.5px solid #22C55E';
  setTimeout(() => {
    btn.innerHTML        = orig;
    btn.style.background = '';
    btn.style.color      = '';
    btn.style.border     = '';
  }, 2000);
}

// ─── Buy now ────────────────────────────
function buyNow() {
  addToCartDetail();
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 400);
}

// ─── Wishlist ───────────────────────────
function toggleWishDetail() {
  const btn = document.getElementById('wishBtn');
  if (btn.textContent.trim() === '🤍') {
    btn.textContent = '❤️';
    btn.classList.add('active');
  } else {
    btn.textContent = '🤍';
    btn.classList.remove('active');
  }
}

// ─── Tabs ───────────────────────────────
function switchTab(name, btn) {
  ['tabDescription','tabCare','tabReviews'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.querySelectorAll('.tab')
    .forEach(t => t.classList.remove('active'));

  document.getElementById(
    name === 'description' ? 'tabDescription' :
    name === 'care'        ? 'tabCare'        : 'tabReviews'
  ).style.display = 'block';

  btn.classList.add('active');
}

// ─── Cart count ─────────────────────────
function updateCartCount() {
  const cart  = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el    = document.getElementById('cartCount');
  if (el) el.textContent = total;
}