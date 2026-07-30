function saveOrders() {
  localStorage.setItem('soapShopOrders', JSON.stringify(orders));
}

function saveCart() {
  localStorage.setItem('soapShopCart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('soapShopCart');
  if (saved) {
    try { cart = JSON.parse(saved); } catch (e) { cart = []; }
  }
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function addToCart(productId, qty = 1, scent, formula, size) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  qty = Math.max(1, Math.min(qty, product.stock));
  const key = `${productId}-${scent || ''}-${formula || ''}-${size || ''}`;
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, product.stock);
  } else {
    cart.push({
      key,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: qty,
      scent: scent || product.scent,
      formula: formula || product.formula,
      size: size || product.size,
      image: product.image
    });
  }
  updateCartBadge();
  saveCart();
  showToast(`Added "${product.name}" (x${qty}) to cart`);
}

function removeFromCart(key) {
  cart = cart.filter(item => item.key !== key);
  updateCartBadge();
  saveCart();
  renderCart();
}

function updateQuantity(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(key);
    return;
  }
  renderCart();
  updateCartBadge();
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const summaryContainer = document.getElementById('cartSummary');
  const emptyMsg = document.getElementById('emptyCart');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    if (summaryContainer) summaryContainer.innerHTML = '';
    if (emptyMsg) emptyMsg.classList.remove('hidden');
    return;
  }
  if (emptyMsg) emptyMsg.classList.add('hidden');

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.productName}">
      <div class="cart-item-info">
        <h4>${item.productName}</h4>
        <p class="cart-item-variant">${item.scent} | ${item.formula} | ${item.size}</p>
        <p>฿${item.price.toLocaleString()} each</p>
        <div class="qty-control">
          <button onclick="updateQuantity('${item.key}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.key}', 1)">+</button>
          <button class="btn btn-sm btn-remove" onclick="removeFromCart('${item.key}')">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">฿${(item.price * item.quantity).toLocaleString()}</div>
    </div>
  `).join('');

  if (summaryContainer) {
    const subtotal = getCartTotal();
    const shipping = subtotal >= 500 ? 0 : 40;
    const total = subtotal + shipping;
    summaryContainer.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>฿${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '฿' + shipping}</span></div>
      <div class="summary-row total"><span>Total</span><span>฿${total.toLocaleString()}</span></div>
      <p class="shipping-note">Free shipping on orders over ฿500</p>
      <button class="btn btn-primary btn-block" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
  }
}

function renderProductCards(productsList, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  if (productsList.length === 0) {
    grid.innerHTML = '<p class="empty-state">No products found.</p>';
    return;
  }
  grid.innerHTML = productsList.map(p => `
    <div class="product-card" onclick="location.href='product-detail.html?id=${p.id}'">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-card-body">
        <div class="product-category">${p.categoryName}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">★ ${p.rating} (${p.reviewCount})</div>
        <div class="product-price">฿${p.price}</div>
        <button class="btn btn-primary btn-block" onclick="event.stopPropagation(); addToCart('${p.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function renderCategoryCards() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = categories.map(c => `
    <div class="category-card" onclick="location.href='products.html?category=${c.id}'">
      <div class="category-icon">${c.icon}</div>
      <div class="category-name">${c.name}</div>
    </div>
  `).join('');
}

function renderFeatured() {
  const featured = products.slice(0, 4);
  renderProductCards(featured, 'featuredGrid');
}

function renderRecommended() {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  const recommended = shuffled.slice(0, 4);
  renderProductCards(recommended, 'recommendedGrid');
}

function renderProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = products.find(p => p.id === id);
  if (!product) {
    document.querySelector('.product-detail') && (document.querySelector('.product-detail').innerHTML = '<p>Product not found.</p>');
    return;
  }

  document.getElementById('detailImage').src = product.image;
  document.getElementById('detailImage').alt = product.name;
  document.getElementById('detailName').textContent = product.name;
  document.getElementById('detailCategory').textContent = product.categoryName;
  document.getElementById('detailDescription').textContent = product.description;
  document.getElementById('detailPrice').textContent = `฿${product.price.toLocaleString()}`;
  document.getElementById('detailStock').textContent = product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock';
  document.getElementById('detailStock').className = product.stock > 0 ? 'stock-in' : 'stock-out';
  document.getElementById('detailRating').textContent = `★ ${product.rating} (${product.reviewCount} reviews)`;

  const scentSelect = document.getElementById('detailScent');
  if (scentSelect) {
    scentSelect.innerHTML = product.availableScents.map(s => `<option value="${s}" ${s === product.scent ? 'selected' : ''}>${s}</option>`).join('');
  }
  const formulaSelect = document.getElementById('detailFormula');
  if (formulaSelect) {
    formulaSelect.innerHTML = product.availableFormulas.map(f => `<option value="${f}" ${f === product.formula ? 'selected' : ''}>${f}</option>`).join('');
  }
  const sizeSelect = document.getElementById('detailSize');
  if (sizeSelect) {
    sizeSelect.innerHTML = product.availableSizes.map(s => `<option value="${s}" ${s === product.size ? 'selected' : ''}>${s}</option>`).join('');
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  renderProductCards(related, 'relatedGrid');

  document.getElementById('addToCartBtn').onclick = function () {
    const qty = parseInt(document.getElementById('detailQty').value) || 1;
    const scent = document.getElementById('detailScent').value;
    const formula = document.getElementById('detailFormula').value;
    const size = document.getElementById('detailSize').value;
    addToCart(product.id, qty, scent, formula, size);
  };

  document.getElementById('detailQty').addEventListener('change', function () {
    if (parseInt(this.value) < 1) this.value = 1;
    if (parseInt(this.value) > product.stock) this.value = product.stock;
  });
}

function renderFilters() {
  const container = document.getElementById('filterCategory');
  if (!container) return;
  container.innerHTML = categories.map(c => `
    <label class="filter-option">
      <input type="checkbox" value="${c.id}" onchange="applyFilters()"> ${c.name}
    </label>
  `).join('');

  const scentContainer = document.getElementById('filterScent');
  if (scentContainer) {
    scentContainer.innerHTML = scents.map(s => `
      <label class="filter-option">
        <input type="checkbox" value="${s}" onchange="applyFilters()"> ${s}
      </label>
    `).join('');
  }

  const formulaContainer = document.getElementById('filterFormula');
  if (formulaContainer) {
    formulaContainer.innerHTML = formulas.map(f => `
      <label class="filter-option">
        <input type="checkbox" value="${f}" onchange="applyFilters()"> ${f}
      </label>
    `).join('');
  }

  const sizeContainer = document.getElementById('filterSize');
  if (sizeContainer) {
    sizeContainer.innerHTML = sizes.map(s => `
      <label class="filter-option">
        <input type="checkbox" value="${s}" onchange="applyFilters()"> ${s}
      </label>
    `).join('');
  }
}

function applyFilters() {
  const selectedCategories = [...document.querySelectorAll('#filterCategory input:checked')].map(el => el.value);
  const selectedScents = [...document.querySelectorAll('#filterScent input:checked')].map(el => el.value);
  const selectedFormulas = [...document.querySelectorAll('#filterFormula input:checked')].map(el => el.value);
  const selectedSizes = [...document.querySelectorAll('#filterSize input:checked')].map(el => el.value);

  const minPrice = parseInt(document.getElementById('priceMin').value) || 0;
  const maxPrice = parseInt(document.getElementById('priceMax').value) || Infinity;

  let filtered = [...products];

  if (selectedCategories.length > 0) {
    filtered = filtered.filter(p => selectedCategories.includes(p.category));
  }
  if (selectedScents.length > 0) {
    filtered = filtered.filter(p => selectedScents.includes(p.scent));
  }
  if (selectedFormulas.length > 0) {
    filtered = filtered.filter(p => selectedFormulas.includes(p.formula));
  }
  if (selectedSizes.length > 0) {
    filtered = filtered.filter(p => selectedSizes.includes(p.size));
  }
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  renderProductCards(filtered, 'productGrid');

  const urlParams = new URLSearchParams(window.location.search);
  const catFromUrl = urlParams.get('category');
  if (catFromUrl) {
    const catFiltered = filtered.filter(p => p.category === catFromUrl);
    if (catFiltered.length > 0 || filtered.length > 0) {
      if (catFiltered.length > 0) renderProductCards(catFiltered, 'productGrid');
    }
  }
}

function proceedToCheckout() {
  if (!currentUser) {
    showToast('Please login first');
    window.location.href = 'login.html?redirect=cart.html';
    return;
  }
  window.location.href = 'checkout.html';
}

function placeOrder() {
  if (cart.length === 0) { showToast('Cart is empty'); return; }
  const name = document.getElementById('checkoutName')?.value;
  const phone = document.getElementById('checkoutPhone')?.value;
  const address = document.getElementById('checkoutAddress')?.value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value;

  if (!name || !phone || !address) { showToast('Please fill in all fields'); return; }
  if (!payment) { showToast('Please select a payment method'); return; }

  orders.push({
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    customerName: name,
    customerEmail: currentUser.email || '',
    customerAddress: address,
    customerPhone: phone,
    items: [...cart],
    total: getCartTotal(),
    paymentMethod: payment,
    status: 'pending',
    statusIndex: 0,
    createdAt: new Date().toISOString().split('T')[0]
  });

  cart = [];
  updateCartBadge();
  saveCart();
  saveOrders();
  showToast('Order placed successfully!');
  setTimeout(() => window.location.href = 'tracking.html?id=' + orders[orders.length - 1].id, 1000);
}

function renderOrderTracking() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const order = orders.find(o => o.id === id);
  if (!order) {
    document.getElementById('trackingContent') && (document.getElementById('trackingContent').innerHTML = '<p>Order not found.</p>');
    return;
  }

  document.getElementById('orderId').textContent = order.id;
  document.getElementById('orderDate').textContent = order.createdAt;
  document.getElementById('orderCustomer').textContent = order.customerName;
  document.getElementById('orderPhone').textContent = order.customerPhone;
  document.getElementById('orderAddress').textContent = order.customerAddress;
  document.getElementById('orderPayment').textContent = order.paymentMethod;
  document.getElementById('orderTotal').textContent = `฿${order.total.toLocaleString()}`;

  const itemsContainer = document.getElementById('orderItems');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <div class="track-item">
        <span>${item.productName} x${item.quantity}</span>
        <span>฿${(item.price * item.quantity).toLocaleString()}</span>
      </div>
    `).join('');
  }

  const statusLabels = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipping', 'Delivered'];
  const timeline = document.getElementById('trackingTimeline');
  if (timeline) {
    timeline.innerHTML = statusLabels.map((label, i) => `
      <div class="timeline-step ${i <= order.statusIndex ? 'completed' : ''} ${i === order.statusIndex ? 'current' : ''}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-label">${label}</div>
          ${i === order.statusIndex ? '<div class="timeline-status">Current</div>' : ''}
        </div>
      </div>
    `).join('');
  }
}

function renderAdminStats() {
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card"><div class="stat-num">${products.length}</div><div class="stat-label">Total Products</div></div>
    <div class="stat-card"><div class="stat-num">${orders.length}</div><div class="stat-label">Total Orders</div></div>
    <div class="stat-card"><div class="stat-num">${customers.length}</div><div class="stat-label">Customers</div></div>
    <div class="stat-card"><div class="stat-num">฿${totalRevenue.toLocaleString()}</div><div class="stat-label">Total Revenue</div></div>
  `;
}

function renderAdminOrders() {
  const content = document.getElementById('adminContent');
  if (!content) return;
  if (orders.length === 0) {
    content.innerHTML = '<p>No orders yet.</p>';
    return;
  }
  content.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th>
      </tr></thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td><strong>${o.id}</strong></td>
            <td>${o.customerName}<br><small>${o.customerPhone}</small></td>
            <td>${o.items.map(i => `${i.productName} x${i.quantity}`).join('<br>')}</td>
            <td>฿${o.total.toLocaleString()}</td>
            <td>${o.paymentMethod}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>${o.createdAt}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdminProducts() {
  const content = document.getElementById('adminContent');
  if (!content) return;
  content.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.categoryName}</td>
            <td>฿${p.price}</td>
            <td>${p.stock}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAdminCategories() {
  const content = document.getElementById('adminContent');
  if (!content) return;
  content.innerHTML = `
    <table class="admin-table">
      <thead><tr><th>ID</th><th>Name</th><th>Products</th></tr></thead>
      <tbody>
        ${categories.map(c => `
          <tr>
            <td>${c.id}</td>
            <td>${c.icon} ${c.name}</td>
            <td>${products.filter(p => p.category === c.id).length}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('soapShopUser');
  cart = [];
  saveCart();
  showToast('Logged out');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('soapShopUser');
  if (saved) {
    try { currentUser = JSON.parse(saved); } catch (e) { currentUser = null; }
  }

  const savedOrders = localStorage.getItem('soapShopOrders');
  if (savedOrders) {
    try {
      const parsed = JSON.parse(savedOrders);
      parsed.forEach(o => { if (!orders.find(ex => ex.id === o.id)) orders.push(o); });
    } catch (e) {}
  }

  loadCart();

  const userDisplay = document.getElementById('userDisplay');
  if (userDisplay) {
    if (currentUser) {
      const adminLink = currentUser.email === 'admin@soapstore.com' ? ' <a href="admin.html" style="color:var(--gold);font-size:0.8rem;font-weight:600">Admin</a>' : '';
      userDisplay.innerHTML = `<a href="user.html" class="user-info">${currentUser.name}</a>${adminLink} <a href="#" onclick="logout()" class="logout-link">Logout</a>`;
    } else {
      userDisplay.innerHTML = '<a href="login.html">Login / Register</a>';
    }
  }

  updateCartBadge();

  if (document.getElementById('featuredGrid')) renderFeatured();
  if (document.getElementById('categoryGrid')) renderCategoryCards();
  if (document.getElementById('recommendedGrid')) renderRecommended();

  if (document.getElementById('filterCategory')) {
    renderFilters();
    applyFilters();
  }

  if (document.getElementById('detailName')) renderProductDetail();

  if (document.getElementById('cartItemsContainer')) renderCart();

  if (document.getElementById('checkoutName') && currentUser) {
    document.getElementById('checkoutName').value = currentUser.name || '';
    document.getElementById('checkoutPhone').value = currentUser.phone || '';
    document.getElementById('checkoutAddress').value = currentUser.address || '';
  }

  if (document.getElementById('trackingTimeline')) renderOrderTracking();

  if (document.querySelector('.admin-sidebar')) {
    renderAdminStats();
    renderAdminOrders();
  }
});
