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
      image: `https://placehold.co/300x300/d4d4d4/555555?text=${encodeURIComponent(name)}`
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
