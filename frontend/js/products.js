// ================================
// PETALSHOP — PRODUCTS PAGE JS
// ================================

// ---- DEMO PRODUCT DATA (JSON) ----
// This is our demo data — later we'll
// fetch this from the real backend API

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
    emoji: "🌹",
    bgColor: "#FFF0F3",
    stock: 28,
    occasion: ["Birthday", "Anniversary", "Romance"]
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
    emoji: "🌹",
    bgColor: "#FFF5F5",
    stock: 15,
    occasion: ["Wedding", "Anniversary"]
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
    emoji: "🌻",
    bgColor: "#FFFBEB",
    stock: 4,
    occasion: ["Birthday"]
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
    emoji: "🌷",
    bgColor: "#F0FFF4",
    stock: 12,
    occasion: ["Birthday", "Romance"]
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
    emoji: "💐",
    bgColor: "#FFF8E1",
    stock: 20,
    occasion: ["Birthday", "Wedding"]
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
    emoji: "🎁",
    bgColor: "#FFF0E6",
    stock: 8,
    occasion: ["Anniversary", "Wedding"]
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
    emoji: "🌸",
    bgColor: "#FFF0F8",
    stock: 16,
    occasion: ["Birthday", "Romance"]
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
    emoji: "🌼",
    bgColor: "#F0F8FF",
    stock: 22,
    occasion: ["Sympathy", "Birthday"]
  }
];

// ---- CURRENT FILTER STATE ----
let currentCategory = 'all';
let currentMaxPrice = 100;
let currentSort     = 'featured';

// ---- RENDER PRODUCTS FUNCTION ----
// This builds the product cards and puts them on the page

function renderProducts() {

  // Step 1: Filter by category
  let filtered = allProducts.filter(function(product) {
    if (currentCategory === 'all') return true;
    return product.category === currentCategory;
  });

  // Step 2: Filter by price
  filtered = filtered.filter(function(product) {
    return product.price <= currentMaxPrice;
  });

  // Step 3: Sort
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Step 4: Get the grid container
  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const countEl   = document.getElementById('productCount');

  // Step 5: Show no results message if empty
  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.style.display = 'block';
    countEl.textContent = '0';
    return;
  }

  noResults.style.display = 'none';
  countEl.textContent = filtered.length;

  // Step 6: Build HTML for each product card
  grid.innerHTML = filtered.map(function(product) {

    // Calculate discount percentage if old price exists
    const discountHTML = product.oldPrice
      ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>
         <span class="product-discount">
           -${Math.round((1 - product.price / product.oldPrice) * 100)}%
         </span>`
      : '';

    // Badge HTML
    const badgeHTML = product.badge
      ? `<span class="product-badge ${product.badgeType}">${product.badge}</span>`
      : '';

    // Low stock warning
    const lowStockHTML = product.stock <= 5
      ? `<p class="low-stock">⚠️ Only ${product.stock} left!</p>`
      : '';

    // Stars (filled based on rating)
    const fullStars  = Math.floor(product.rating);
    const starsHTML  = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

    // Return the full card HTML
    return `
      <div class="product-card" onclick="goToDetail(${product.id})">
        <div class="product-img-box" style="background:${product.bgColor}">
          ${product.emoji}
          ${badgeHTML}
          <button class="wishlist-btn" onclick="toggleWishlist(event, ${product.id})">🤍</button>
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

  // Update active class on pills (hero bar)
  document.querySelectorAll('.pill').forEach(function(pill) {
    pill.classList.remove('active');
  });

  // Update active class on sidebar items
  document.querySelectorAll('.sb-item').forEach(function(item) {
    item.classList.remove('active');
  });

  // Add active to clicked element
  if (clickedElement) {
    clickedElement.classList.add('active');
  }

  renderProducts();
}

// ---- FILTER BY PRICE ----
function filterByPrice(value) {
  currentMaxPrice = parseFloat(value);
  const display = document.getElementById('priceDisplay');
  if (display) {
    display.textContent = `$0 – $${currentMaxPrice}`;
  }
  renderProducts();
}

// ---- SORT PRODUCTS ----
function sortProducts(value) {
  currentSort = value;
  renderProducts();
}

// ---- GO TO PRODUCT DETAIL ----
function goToDetail(productId) {
  // Save the selected product ID to localStorage
  // so the detail page knows which product to show
  localStorage.setItem('selectedProductId', productId);
  window.location.href = 'product-detail.html';
}

// ---- ADD TO CART ----
function addToCart(event, productId) {
  // Stop the click from also triggering goToDetail
  event.stopPropagation();

  // Find the product
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  // Get existing cart from localStorage (or empty array)
  let cart = JSON.parse(localStorage.getItem('petalshop_cart')) || [];

  // Check if product already in cart
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    // Increase quantity
    existingItem.quantity += 1;
  } else {
    // Add new item to cart
    cart.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      emoji:    product.emoji,
      bgColor:  product.bgColor,
      category: product.category,
      quantity: 1
    });
  }

  // Save updated cart back to localStorage
  localStorage.setItem('petalshop_cart', JSON.stringify(cart));

  // Update cart count in navbar
  updateCartCount();

  // Show a small confirmation (change button text briefly)
  event.target.textContent = '✓ Added!';
  event.target.style.background = '#22C55E';
  setTimeout(function() {
    event.target.textContent = 'Add to cart';
    event.target.style.background = '';
  }, 1500);
}

// ---- TOGGLE WISHLIST ----
function toggleWishlist(event, productId) {
  event.stopPropagation();
  const btn = event.target;
  if (btn.textContent === '🤍') {
    btn.textContent = '❤️';
  } else {
    btn.textContent = '🤍';
  }
}

// ---- UPDATE CART COUNT IN NAVBAR ----
function updateCartCount() {
  const cart     = JSON.parse(localStorage.getItem('petalshop_cart')) || [];
  const total    = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl  = document.getElementById('cartCount');
  if (countEl) countEl.textContent = total;
}

// ---- ON PAGE LOAD ----
// Render products and update cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartCount();
});