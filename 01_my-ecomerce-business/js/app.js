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

function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  qty = Math.max(1, Math.min(qty, product.stock));
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + qty, product.stock);
  } else {
    cart.push({ productId: product.id, productName: product.name, price: product.price, quantity: qty, image: product.image });
  }
  updateCartBadge();
  showToast(`เพิ่ม "${product.name}" ${qty} ชิ้นในตะกร้าแล้ว`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  updateCartBadge();
  renderCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  renderCart();
  updateCartBadge();
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
      <img src="${item.image || 'https://placehold.co/80x80/e2e8f0/64748b?text=Soap'}" alt="${item.productName}">
      <div class="cart-item-info">
        <h4>${item.productName}</h4>
        <p>฿${item.price.toLocaleString()} ต่อชิ้น</p>
        <div class="qty-control">
          <button onclick="updateQuantity('${item.productId}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.productId}', 1)">+</button>
          <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.productId}')" style="margin-left:0.75rem">ลบ</button>
        </div>
      </div>
      <div style="font-weight:700;font-size:1.1rem">฿${(item.price * item.quantity).toLocaleString()}</div>
    </div>
  `).join('');

  if (summaryContainer) {
    const subtotal = getCartTotal();
    const shipping = subtotal >= 500 ? 0 : 40;
    const total = subtotal + shipping;
    summaryContainer.innerHTML = `
      <h3 style="margin-bottom:1rem">สรุปคำสั่งซื้อ</h3>
      <div class="summary-row"><span>สินค้ารวม</span><span>฿${subtotal.toLocaleString()}</span></div>
      <div class="summary-row"><span>ค่าจัดส่ง</span><span>${shipping === 0 ? 'ฟรี' : '฿' + shipping}</span></div>
      <div class="summary-row total"><span>ยอดรวม</span><span>฿${total.toLocaleString()}</span></div>
      <p style="font-size:0.8rem;color:var(--text-light);margin-bottom:1rem">* จัดส่งฟรีเมื่อสั่งซื้อตั้งแต่ ฿500</p>
      <button class="btn btn-primary btn-block" onclick="proceedToCheckout()">ดำเนินการสั่งซื้อ</button>
    `;
  }
}

function renderProducts(filterType) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const filtered = filterType && filterType !== 'all'
    ? products.filter(p => p.typeEn === filterType)
    : products;

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem">ไม่พบสินค้า</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <div class="product-type">${p.type}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="product-price">฿${p.price} <span>/ ${p.weight}</span></div>
        <div class="product-qty-row">
          <label class="qty-label">จำนวน:</label>
          <input type="number" class="qty-input" id="qty-${p.id}" value="1" min="1" max="${p.stock}">
          <span class="stock-info">เหลือ ${p.stock} ชิ้น</span>
        </div>
      </div>
      <button class="add-to-cart" onclick="addToCart('${p.id}', parseInt(document.getElementById('qty-${p.id}').value) || 1)">เพิ่มลงตะกร้า</button>
    </div>
  `).join('');
}

function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderProducts(this.dataset.filter);
    });
  });
}

function proceedToCheckout() {
  if (!currentUser) {
    showToast('กรุณาเข้าสู่ระบบก่อนสั่งซื้อ');
    window.location.href = 'login.html?redirect=cart.html';
    return;
  }
  window.location.href = 'cart.html#checkout';
}

function placeOrder() {
  if (cart.length === 0) { showToast('ตะกร้าว่าง'); return; }
  const name = document.getElementById('checkoutName')?.value;
  const address = document.getElementById('checkoutAddress')?.value;
  const phone = document.getElementById('checkoutPhone')?.value;
  const payment = document.querySelector('input[name="payment"]:checked')?.value;

  if (!name || !address || !phone) { showToast('กรุณากรอกข้อมูลให้ครบ'); return; }
  if (!payment) { showToast('กรุณาเลือกวิธีการชำระเงิน'); return; }

  orders.push({
    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
    customerName: name,
    customerAddress: address,
    customerPhone: phone,
    items: [...cart],
    total: getCartTotal(),
    paymentMethod: payment,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0]
  });

  cart = [];
  updateCartBadge();
  showToast('สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

function logout() {
  currentUser = null;
  localStorage.removeItem('soapShopUser');
  showToast('ออกจากระบบแล้ว');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
  const saved = localStorage.getItem('soapShopUser');
  if (saved) {
    try { currentUser = JSON.parse(saved); } catch (e) { currentUser = null; }
  }

  const userDisplay = document.getElementById('userDisplay');
  if (userDisplay) {
    if (currentUser) {
      userDisplay.innerHTML = `<span class="user-info">สวัสดี, ${currentUser.name}</span> <a href="#" onclick="logout()" style="color:#ef4444;font-size:0.85rem">ออกจากระบบ</a>`;
    } else {
      userDisplay.innerHTML = '<a href="login.html">เข้าสู่ระบบ</a>';
    }
  }

  updateCartBadge();

  if (document.getElementById('productGrid')) {
    renderProducts('all');
    setupFilterButtons();
  }

  if (document.getElementById('cartItemsContainer')) {
    renderCart();
  }

  if (document.getElementById('checkoutName') && currentUser) {
    document.getElementById('checkoutName').value = currentUser.name || '';
    document.getElementById('checkoutAddress').value = currentUser.address || '';
    document.getElementById('checkoutPhone').value = currentUser.phone || '';
  }
});
