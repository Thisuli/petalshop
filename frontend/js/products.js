// ================================
// PETALSHOP — PRODUCTS PAGE JS
// Now with real images!
// ================================

const allProducts = [
  {
    id: 1,
    name: "Red Rose Bouquet (12 pcs)",
    category: "roses",
    price: 24.99,
    oldPrice: 34.99,
    rating: 4.9,
    reviews: 312,
    badge: "Popular",
    badgeType: "badge-pop",
    image: "../images/rose-red.jpg",
    emoji: "🌹",
    bgColor: "#FFF0F3",
    stock: 28,
    occasion: ["Birthday", "Anniversary", "Romance"],
    description: "Our premium Red Rose Bouquet features 12 hand-selected, long-stem red roses. Perfect for birthdays, anniversaries, or just to say I love you. Freshly cut and arranged by our expert florists, guaranteed fresh for 7+ days."
  },
  {
    id: 2,
    name: "White Rose Elegance",
    category: "roses",
    price: 29.99,
    oldPrice: null,
    rating: 4.7,
    reviews: 145,
    badge: "New",
    badgeType: "badge-new",
    image: "../images/rose-white.jpg",
    emoji: "🌹",
    bgColor: "#FFF5F5",
    stock: 15,
    occasion: ["Wedding", "Anniversary"],
    description: "Elegant white roses symbolizing purity and new beginnings. Perfect for weddings and anniversaries. Each stem is hand-picked and arranged beautifully."
  },
  {
    id: 3,
    name: "Sunny Day Arrangement",
    category: "sunflowers",
    price: 18.99,
    oldPrice: null,
    rating: 4.5,
    reviews: 89,
    badge: "New",
    badgeType: "badge-new",
    image: "../images/sunflower.jpg",
    emoji: "🌻",
    bgColor: "#FFFBEB",
    stock: 4,
    occasion: ["Birthday"],
    description: "Bright and cheerful sunflower arrangement that brings sunshine into any room. These gorgeous sunflowers will brighten anyone's day instantly."
  },
  {
    id: 4,
    name: "Pink Tulip Bundle (20 pcs)",
    category: "tulips",
    price: 29.99,
    oldPrice: 44.99,
    rating: 4.8,
    reviews: 201,
    badge: "Sale",
    badgeType: "badge-sale",
    image: "../images/tulip-pink.jpg",
    emoji: "🌷",
    bgColor: "#F0FFF4",
    stock: 12,
    occasion: ["Birthday", "Romance"],
    description: "Beautiful bundle of 20 fresh pink tulips. These delicate blooms are perfect for romantic occasions and birthdays. Stay fresh for 7+ days."
  },
  {
    id: 5,
    name: "Mixed Spring Bouquet",
    category: "bouquets",
    price: 39.99,
    oldPrice: null,
    rating: 4.9,
    reviews: 158,
    badge: null,
    badgeType: null,
    image: "../images/bouquet-spring.jpg",
    emoji: "💐",
    bgColor: "#FFF8E1",
    stock: 20,
    occasion: ["Birthday", "Wedding"],
    description: "A gorgeous mix of seasonal spring flowers hand-arranged into a stunning bouquet. Every bouquet is unique and full of vibrant color."
  },
  {
    id: 6,
    name: "Luxury Gift Bouquet",
    category: "bouquets",
    price: 59.99,
    oldPrice: 79.99,
    rating: 5.0,
    reviews: 87,
    badge: "Sale",
    badgeType: "badge-sale",
    image: "../images/bouquet-luxury.jpg",
    emoji: "🎁",
    bgColor: "#FFF0E6",
    stock: 8,
    occasion: ["Anniversary", "Wedding"],
    description: "Our most premium bouquet for the most special occasions. Luxurious flowers beautifully arranged with premium wrapping and ribbon."
  },
  {
    id: 7,
    name: "Cherry Blossom Special",
    category: "seasonal",
    price: 49.99,
    oldPrice: 65.00,
    rating: 4.9,
    reviews: 445,
    badge: "Popular",
    badgeType: "badge-pop",
    image: "../images/cherry-blossom.jpg",
    emoji: "🌸",
    bgColor: "#FFF0F8",
    stock: 16,
    occasion: ["Birthday", "Romance"],
    description: "Our limited seasonal cherry blossom arrangement. Delicate and breathtaking, these blossoms are available for a short time only. Order now!"
  },
  {
    id: 8,
    name: "White Daisy Garden Box",
    category: "seasonal",
    price: 22.99,
    oldPrice: null,
    rating: 4.4,
    reviews: 73,
    badge: null,
    badgeType: null,
    image: "../images/daisy-white.jpg",
    emoji: "🌼",
    bgColor: "#F0F8FF",
    stock: 22,
    occasion: ["Sympathy", "Birthday"],
    description: "A charming box of fresh white daisies. Simple, pure, and elegant. Perfect for brightening up any space or sending as a sympathy gift."
  }
];

// ---- CURRENT FILTER STATE ----
let currentCategory = 'all';
let currentMaxPrice = 100;
let currentSort     = 'featured';

// ---- RENDER PRODUCTS ----
function renderProducts() {

  let filtered = allProducts.filter(function(product) {
    if (currentCategory === 'all') return true;
    return product.category === currentCategory;
  });

  filtered = filtered.filter(function(product) {
    return product.price <= currentMaxPrice;
  });

  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const countEl   = document.getElementById('productCount');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    countEl.textContent = '0';
    return;
  }

  noResults.style.display = 'none';
  countEl.textContent = filtered.length;

  grid.innerHTML = filtered.map(function(product) {

    const discountHTML = product.oldPrice
      ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>
         <span class="product-discount">
           -${Math.round((1 - product.price / product.oldPrice) * 100)}%
         </span>`
      : '';

    const badgeHTML = product.badge
      ? `<span class="product-badge ${product.badgeType}">${product.badge}</span>`
      : '';

    const lowStockHTML = product.stock <= 5
      ? `<p class="low-stock">⚠️ Only ${product.stock} left!</p>`
      : '';

    const fullStars = Math.floor(product.rating);
    const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

    return `
      <div class="product-card" onclick="goToDetail(${product.id})">
        <div class="product-img-box" style="background:${product.bgColor}">

          <!-- REAL IMAGE — with emoji fallback if image not found -->
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-img"
            onerror="this.style.display='none';
                     this.nextElementSibling.style.display='flex'"
          />
          <!-- Emoji fallback (shown if image fails to load) -->
          <div class="product-emoji-fallback" style="display:none">
            ${product.emoji}
          </div>

          ${badgeHTML}
          <button class="wishlist-btn"
            onclick="toggleWishlist(event, ${product.id})">🤍</button>
        </div>
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <p class="product-name">${product.name}</p>
          <div class="product-rating">
            <span class="stars">${starsHTML}</span>
            <span class="review-count">(${product.reviews})</span>
          </div>
          <div class="product-price-row">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            ${discountHTML}
          </div>
          ${lowStockHTML}
          <button class="btn-add-to-cart"
            onclick="addToCart(event, ${product.id})">
            Add to cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ---- FILTER BY CATEGORY ----
function filterByCategory(category, clickedElement) {
  currentCategory = category;

  document.querySelectorAll('.pill').forEach(function(pill) {
    pill.classList.remove('active');
  });
  document.querySelectorAll('.sb-item').forEach(function(item) {
    item.classList.remove('active');
  });
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
  renderProducts();
}

// ---- FILTER BY PRICE ----
function filterByPrice(value) {
  currentMaxPrice = parseFloat(value);
  const display = document.getElementById('priceDisplay');
  if (display) display.textContent = `$0 – $${currentMaxPrice}`;
  renderProducts();
}

// ---- SORT ----
function sortProducts(value) {
  currentSort = value;
  renderProducts();
}

// ---- GO TO DETAIL ----
function goToDetail(productId) {
  localStorage.setItem('selectedProductId', productId);
  window.location.href = 'product-detail.html';
}

// ---- ADD TO CART ----
function addToCart(event, productId) {
  event.stopPropagation();

  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      image:    product.image,
      emoji:    product.emoji,
      bgColor:  product.bgColor,
      category: product.category,
      quantity: 1
    });
  }

  localStorage.setItem('petalshop_cart', JSON.stringify(cart));
  updateCartCount();

  event.target.textContent = '✓ Added!';
  event.target.style.background = '#22C55E';
  event.target.style.color = '#fff';
  setTimeout(function() {
    event.target.textContent = 'Add to cart';
    event.target.style.background = '';
    event.target.style.color = '';
  }, 1500);
}

// ---- TOGGLE WISHLIST ----
function toggleWishlist(event, productId) {
  event.stopPropagation();
  const btn = event.target;
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

// ---- UPDATE CART COUNT ----
function updateCartCount() {
  const cart    = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total   = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = total;
}

// ---- PAGE LOAD ----
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartCount();
});