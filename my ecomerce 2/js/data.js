const categories = [
  { id: 'natural', name: 'Natural Soap', icon: '🌿' },
  { id: 'herbal', name: 'Herbal Soap', icon: '🌱' },
  { id: 'aroma', name: 'Aromatherapy Soap', icon: '🌸' }
];

const scents = ['Lavender', 'Rose', 'Citrus', 'Eucalyptus', 'Vanilla', 'Tea Tree', 'Jasmine', 'Sandalwood'];
const formulas = ['Classic', 'Organic', 'Sensitive Skin', 'Exfoliating', 'Moisturizing'];
const sizes = ['100g', '150g', '200g', '300ml', '500ml'];

const productNames = {
  natural: ['Pure Olive Oil', 'Honey & Oatmeal', 'Coconut Cream', 'Aloe Vera Fresh', 'Milk & Honey', 'Avocado Rich'],
  herbal: ['Green Tea Detox', 'Turmeric Glow', 'Neem & Tulsi', 'Charcoal Purifying', 'Lemongrass Fresh', 'Mint & Tea Tree'],
  aroma: ['Lavender Dreams', 'Rose Petal Bliss', 'Citrus Burst', 'Eucalyptus Spa', 'Vanilla Warmth', 'Sandalwood Serenity']
};

const firstNames = ['สมชาย', 'สมหญิง', 'มานี', 'ปิติ', 'ดารา', 'วิชัย', 'กุลณา', 'ธนากร', 'สิริมา', 'อรรถพล'];
const lastNames = ['ใจดี', 'รักดี', 'เก่งกล้า', 'สุขสันต์', 'ศรีสุข', 'มหาศาล', 'ทองดี', 'บุญมา'];
const streetNames = ['สุขุมวิท', 'พหลโยธิน', 'รัชดาภิเษก', 'เพชรบุรี', 'สาทร', 'สีลม'];
const districts = ['บางรัก', 'ปทุมวัน', 'คลองเตย', 'จตุจักร', 'ดินแดง', 'ห้วยขวาง'];
const cities = ['กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'นนทบุรี'];

const paymentMethods = ['Bank Transfer', 'Credit/Debit Card', 'PromptPay', 'Cash on Delivery'];
const orderStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProducts(count = 18) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const cat = categories[i % 3];
    const name = productNames[cat.id][Math.floor(i / 3) % productNames[cat.id].length];
    const basePrice = randomInt(80, 350);
    products.push({
      id: `PRD-${String(i + 1).padStart(3, '0')}`,
      name: name + ' Soap',
      category: cat.id,
      categoryName: cat.name,
      description: `${name} soap — handcrafted with natural ingredients for a gentle and refreshing cleanse.`,
      price: basePrice,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: randomInt(10, 200),
      scent: randomPick(scents),
      availableScents: [randomPick(scents), randomPick(scents), randomPick(scents)],
      formula: randomPick(formulas),
      availableFormulas: [randomPick(formulas), randomPick(formulas)],
      size: randomPick(sizes),
      availableSizes: [randomPick(sizes), randomPick(sizes), randomPick(sizes)],
      stock: randomInt(5, 60),
      image: `image/thai.JPG`
    });
  }
  return products;
}

function generateCustomers(count = 10) {
  const customers = [];
  for (let i = 0; i < count; i++) {
    const firstName = randomPick(firstNames);
    const lastName = randomPick(lastNames);
    const street = randomPick(streetNames);
    const district = randomPick(districts);
    const city = randomPick(cities);
    customers.push({
      id: `CUS-${String(i + 1).padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      address: `${randomInt(1, 999)}/${randomInt(1, 500)} ${street} Rd., ${district}, ${city}`,
      phone: `08${String(randomInt(10000000, 99999999))}`
    });
  }
  return customers;
}

function generateOrders(products, customers, count = 15) {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const customer = randomPick(customers);
    const itemCount = randomInt(1, 4);
    const items = [];
    let total = 0;
    const selectedIds = new Set();
    for (let j = 0; j < itemCount; j++) {
      let product;
      do { product = randomPick(products); } while (selectedIds.has(product.id));
      selectedIds.add(product.id);
      const qty = randomInt(1, 3);
      items.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: qty,
        scent: product.scent,
        formula: product.formula,
        size: product.size
      });
      total += product.price * qty;
    }
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - randomInt(0, 20));
    const statusIdx = randomInt(0, orderStatuses.length - 1);
    orders.push({
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      items: items,
      total: total,
      paymentMethod: randomPick(paymentMethods),
      status: orderStatuses[statusIdx],
      statusIndex: statusIdx,
      createdAt: createdDate.toISOString().split('T')[0]
    });
  }
  return orders;
}

const products = generateProducts();
const customers = generateCustomers();
const orders = generateOrders(products, customers);
let currentUser = null;
let cart = [];

function seedDatabase() {
  if (!localStorage.getItem('soapShopUsers')) {
    const users = [
      {
        name: 'John Doe',
        email: 'user@soapstore.com',
        password: 'password123',
        phone: '0812345678',
        address: '123/45 Sukhumvit Rd., Bangkok, Thailand'
      },
      {
        name: 'Admin',
        email: 'admin@soapstore.com',
        password: 'admin123',
        phone: '0898765432',
        address: 'Admin Office, Soap Store HQ, Bangkok'
      }
    ];
    localStorage.setItem('soapShopUsers', JSON.stringify(users));
  }

  if (!localStorage.getItem('soapShopOrders')) {
    const userOrders = [
      {
        id: 'ORD-016',
        customerName: 'John Doe',
        customerEmail: 'user@soapstore.com',
        customerAddress: '123/45 Sukhumvit Rd., Bangkok, Thailand',
        customerPhone: '0812345678',
        items: [
          { productId: products[0].id, productName: products[0].name, price: products[0].price, quantity: 2, scent: products[0].scent, formula: products[0].formula, size: products[0].size },
          { productId: products[2].id, productName: products[2].name, price: products[2].price, quantity: 1, scent: products[2].scent, formula: products[2].formula, size: products[2].size }
        ],
        total: products[0].price * 2 + products[2].price,
        paymentMethod: 'Bank Transfer',
        status: 'delivered',
        statusIndex: 4,
        createdAt: '2026-07-15'
      },
      {
        id: 'ORD-017',
        customerName: 'John Doe',
        customerEmail: 'user@soapstore.com',
        customerAddress: '123/45 Sukhumvit Rd., Bangkok, Thailand',
        customerPhone: '0812345678',
        items: [
          { productId: products[5].id, productName: products[5].name, price: products[5].price, quantity: 3, scent: products[5].scent, formula: products[5].formula, size: products[5].size }
        ],
        total: products[5].price * 3,
        paymentMethod: 'Credit/Debit Card',
        status: 'shipping',
        statusIndex: 3,
        createdAt: '2026-07-22'
      },
      {
        id: 'ORD-018',
        customerName: 'John Doe',
        customerEmail: 'user@soapstore.com',
        customerAddress: '123/45 Sukhumvit Rd., Bangkok, Thailand',
        customerPhone: '0812345678',
        items: [
          { productId: products[1].id, productName: products[1].name, price: products[1].price, quantity: 1, scent: products[1].scent, formula: products[1].formula, size: products[1].size },
          { productId: products[3].id, productName: products[3].name, price: products[3].price, quantity: 2, scent: products[3].scent, formula: products[3].formula, size: products[3].size },
          { productId: products[7].id, productName: products[7].name, price: products[7].price, quantity: 1, scent: products[7].scent, formula: products[7].formula, size: products[7].size }
        ],
        total: products[1].price + products[3].price * 2 + products[7].price,
        paymentMethod: 'PromptPay',
        status: 'pending',
        statusIndex: 0,
        createdAt: '2026-07-28'
      }
    ];
    localStorage.setItem('soapShopOrders', JSON.stringify(userOrders));

    const storedOrders = JSON.parse(localStorage.getItem('soapShopOrders') || '[]');
    orders.push(...storedOrders);
  }
}

seedDatabase();
