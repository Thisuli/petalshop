// ================================
// PETALSHOP — PRODUCT DETAIL JS
// ================================

// Current quantity selected
let quantity = 1;

// The product being viewed
let currentProduct = null;

// ---- LOAD PRODUCT ON PAGE START ----
document.addEventListener('DOMContentLoaded', function() {

  // Update cart count in navbar
  updateCartCount();

  // Get the product ID saved by the products page
  const productId = parseInt(localStorage.getItem('selectedProductId'));

  // Find the product from our data (in products.js)
  currentProduct = allProducts.find(p => p.id === productId);

  // If no product found, go back to products page
  if (!currentProduct) {
    window.location.href = 'products.html';
    return;
  }

  // Now fill in all the page details
  loadProductDetails(currentProduct);
});

// ---- FILL PAGE WITH PRODUCT DATA ----
function loadProductDetails(product) {

  // --- BREADCRUMB ---
  document.getElementById('bcCategory').textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);
  document.getElementById('bcName').textContent = product.name;

  // --- MAIN IMAGE ---
  const mainImg   = document.getElementById('mainImg');
  const mainEmoji = document.getElementById('mainEmoji');
  const mainBox   = document.getElementById('mainImgBox');

  mainBox.style.background = product.bgColor;
  mainImg.src = product.image;
  mainImg.alt = product.name;
  mainEmoji.textContent   = product.emoji;

  // --- BADGE ---
  const badge = document.getElementById('detailBadge');
  if (product.badge) {
    badge.textContent = product.badge;
    badge.style.display = 'inline-block';
    // Apply badge colour based on type
    if (product.badgeType === 'badge-pop') {
      badge.style.background = '#F5C518';
      badge.style.color      = '#1a1a1a';
    } else if (product.badgeType === 'badge-new') {
      badge.style.background = '#1a1a1a';
      badge.style.color      = '#F5C518';
    } else if (product.badgeType === 'badge-sale') {
      badge.style.background = '#EF4444';
      badge.style.color      = '#ffffff';
    }
  }

  // --- THUMBNAILS ---
  // We show the main image + 3 extra placeholder thumbs
  const thumbsRow = document.getElementById('thumbsRow');
  const thumbImages = [
    { src: product.image, label: 'Main' },
    { src: product.image, label: 'Side' },
    { src: product.image, label: 'Detail' },
    { src: product.image, label: 'Pack' },
  ];

  thumbsRow.innerHTML = thumbImages.map((thumb, index) => `
    <div class="thumb ${index === 0 ? 'active' : ''}"
         onclick="switchMainImage('${thumb.src}', this, '${product.emoji}')">
      <img
        src="${thumb.src}"
        alt="${thumb.label}"
        onerror="this.style.display='none';
                 this.nextElementSibling.style.display='flex'"
      />
      <div class="thumb-emoji" style="display:none">${product.emoji}</div>
    </div>
  `).join('');

  // --- CATEGORY ---
  document.getElementById('detailCat').textContent =
    product.category.toUpperCase() + ' · Premium Collection';

  // --- TITLE ---
  document.getElementById('detailTitle').textContent = product.name;

  // --- RATING ---
  const fullStars = Math.floor(product.rating);
  document.getElementById('detailStars').textContent =
    '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  document.getElementById('detailScore').textContent   = product.rating;
  document.getElementById('detailReviews').textContent =
    `(${product.reviews} reviews)`;
  document.getElementById('reviewCount').textContent   = product.reviews;

  // Fake sold count (10x reviews)
  document.getElementById('detailSold').textContent =
    `${(product.reviews * 10).toLocaleString()} sold`;

  // --- PRICE ---
  document.getElementById('detailPrice').textContent =
    `$${product.price.toFixed(2)}`;
  document.getElementById('buyNowPrice').textContent =
    `$${product.price.toFixed(2)}`;

  if (product.oldPrice) {
    document.getElementById('detailOldPrice').textContent =
      `$${product.oldPrice.toFixed(2)}`;
    const saved = (product.oldPrice - product.price).toFixed(2);
    const saveBadge = document.getElementById('detailSaveBadge');
    saveBadge.textContent  = `Save $${saved}`;
    saveBadge.style.display = 'inline-block';
  }

  // --- STOCK ---
  document.getElementById('stockCount').textContent = product.stock;
  const stockBadge = document.getElementById('stockBadge');
  if (product.stock <= 5) {
    stockBadge.textContent = `⚠️ Only ${product.stock} left — order soon!`;
    stockBadge.classList.add('low');
  }

  // --- DESCRIPTION ---
  document.getElementById('detailDescription').textContent =
    product.description;

  // --- OCCASION TAGS ---
  const tagsContainer = document.getElementById('occasionTags');
  if (product.occasion && product.occasion.length > 0) {
    // Map of occasion labels to emojis
    const emojiMap = {
      'Birthday':    '🎂',
      'Anniversary': '💍',
      'Romance':     '💑',
      'Wedding':     '👰',
      'Sympathy':    '🕊️',
    };
    tagsContainer.innerHTML = product.occasion.map(occ => `
      <span class="occasion-tag">
        ${emojiMap[occ] || '🌸'} ${occ}
      </span>
    `).join('');
  }

  // --- PAGE TITLE ---
  document.title = `PetalShop — ${product.name}`;
}

// ---- SWITCH MAIN IMAGE (when thumbnail clicked) ----
function switchMainImage(src, thumbEl, emoji) {

  // Update main image
  const mainImg   = document.getElementById('mainImg');
  const mainEmoji = document.getElementById('mainEmoji');
  mainImg.src     = src;
  mainImg.style.display = 'block';
  mainEmoji.style.display = 'none';

  // Update active thumbnail
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

// ---- QUANTITY CONTROL ----
function changeQty(change) {
  quantity = quantity + change;

  // Min 1, max 20
  if (quantity < 1)  quantity = 1;
  if (quantity > 20) quantity = 20;

  document.getElementById('qtyVal').textContent = quantity;
}

// ---- ADD TO CART FROM DETAIL PAGE ----
function addToCartDetail() {
  if (!currentProduct) return;

  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const existingItem = cart.find(item => item.id === currentProduct.id);

  if (existingItem) {
    existingItem.quantity += quantity;
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
  btn.textContent = '✓ Added to cart!';
  btn.style.background = '#22C55E';
  btn.style.color = '#fff';
  setTimeout(function() {
    btn.textContent = '🛒 Add to cart';
    btn.style.background = '';
    btn.style.color = '';
  }, 2000);
}

// ---- BUY NOW ----
function buyNow() {
  // Add to cart first then go to checkout
  addToCartDetail();
  setTimeout(function() {
    window.location.href = 'checkout.html';
  }, 500);
}

// ---- TOGGLE WISHLIST ----
function toggleWishDetail() {
  const btn = document.getElementById('wishBtn');
  if (btn.textContent === '🤍') {
    btn.textContent = '❤️';
    btn.classList.add('active');
  } else {
    btn.textContent = '🤍';
    btn.classList.remove('active');
  }
}

// ---- SWITCH TABS ----
function switchTab(tabName, clickedBtn) {

  // Hide all tab content panels
  document.getElementById('tabDescription').style.display = 'none';
  document.getElementById('tabCare').style.display        = 'none';
  document.getElementById('tabReviews').style.display     = 'none';

  // Remove active from all tab buttons
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // Show the selected tab
  if (tabName === 'description') {
    document.getElementById('tabDescription').style.display = 'block';
  } else if (tabName === 'care') {
    document.getElementById('tabCare').style.display = 'block';
  } else if (tabName === 'reviews') {
    document.getElementById('tabReviews').style.display = 'block';
  }

  // Mark clicked button as active
  clickedBtn.classList.add('active');
}

// ---- UPDATE CART COUNT ----
function updateCartCount() {
  const cart    = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total   = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = total;
}