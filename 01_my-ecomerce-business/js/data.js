const soapTypes = ['Bar Soap', 'Liquid Soap', 'Body Soap'];
const barSoapNames = ['ครีมมี่ โรส การ์เด้น', 'ลาวเวนเดอร์ ดรีม', 'ชาร์โคล พรีเมียม', 'น้ำผึ้ง มิลค์ โกลด์', 'ทีทรี เฟรช', 'กุหลาบเปอร์เซีย', 'มะนาว อิตาเลี่ยน', 'นมโคขาว'];
const liquidSoapNames = ['อโลเวร่า เจนเทิล', 'วิตามิน อี พรีเมียม', 'เชียร์ บัตเตอร์ ลักซ์', 'อาซาอิ เบอร์รี่', 'โจโจบ้า โกลด์', 'มาคาเดเมีย ซิลค์'];
const bodySoapNames = ['ซิตรัส เฟรสซ์', 'สมุนไพรเลอ valeur', 'วานิลลา บลังค์', 'กรีนที คลาสสิก', 'มินต์ ชิล', 'ยูคาลิปตัส สปา'];
const tagPool = ['ออร์แกนิค', 'วีแกน', 'อ่อนโยน', 'หอมธรรมชาติ', 'พรีเมียม', 'สูตรเข้มข้น', 'ไม่มีสารกันเสีย', 'ลดอาการแพ้', 'มอยส์เจอร์ไรซ์', 'ดีท็อกซ์'];
const ingredientsList = [
  'Shea Butter, Coconut Oil, Olive Oil, Vitamin E, Essential Oils',
  'Jojoba Oil, Argan Oil, Rosehip Extract, Glycerin, Natural Fragrance',
  'Almond Oil, Cocoa Butter, Aloe Vera, Collagen, Vitamin B5',
  'Macadamia Oil, Honey Extract, Oatmeal, Silk Protein, Vitamin C',
  'Green Tea Extract, Chamomile, Cucumber, Glycerin, Aloe Vera'
];
const firstNames = ['สมชาย', 'สมหญิง', 'มานี', 'ปิติ', 'ดารา', 'วิชัย', 'กุลณา', 'ธนากร', 'สิริมา', 'อรรถพล', 'จินตนา', 'ประวิทย์', 'นภาพร', 'วรวิทย์', 'กนกพร'];
const lastNames = ['ใจดี', 'รักดี', 'เก่งกล้า', 'สุขสันต์', 'ศรีสุข', 'มหาศาล', 'ทองดี', 'บุญมา', 'สุขใจ', 'รุ่งเรือง'];
const streetNames = ['สุขุมวิท', 'พหลโยธิน', 'รัชดาภิเษก', 'พระราม 9', 'เพชรบุรี', 'สาทร', 'สีลม', 'เจริญกรุง'];
const districts = ['บางรัก', 'ปทุมวัน', 'คลองเตย', 'จตุจักร', 'ดินแดง', 'ห้วยขวาง', 'พระโขนง', 'ลาดพร้าว'];
const cities = ['กรุงเทพฯ', 'เชียงใหม่', 'ภูเก็ต', 'ชลบุรี', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];
const paymentMethods = ['โอนเงินผ่านธนาคาร', 'บัตรเครดิต/เดบิต', 'TrueMoney Wallet', 'พร้อมเพย์', 'เก็บเงินปลายทาง'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProductId(index) {
  const prefix = ['BAR', 'LIQ', 'BDY'];
  const typeIdx = index < 4 ? 0 : index < 8 ? 1 : 2;
  return `${prefix[typeIdx]}-${String(index + 1).padStart(3, '0')}`;
}

function generateProducts(count = 18) {
  const products = [];
  for (let i = 0; i < count; i++) {
    let type, nameSource;
    if (i < 6) { type = 'bar'; nameSource = barSoapNames[i % barSoapNames.length]; }
    else if (i < 12) { type = 'liquid'; nameSource = liquidSoapNames[i % liquidSoapNames.length]; }
    else { type = 'body'; nameSource = bodySoapNames[i % bodySoapNames.length]; }

    const weights = { bar: '120g', liquid: '300ml', body: '250ml' };
    const netWeights = { bar: '115g', liquid: '290ml', body: '240ml' };
    const priceRanges = { bar: [120, 350], liquid: [180, 450], body: [150, 390] };

    const tagCount = randomInt(2, 3);
    const shuffledTags = [...tagPool].sort(() => Math.random() - 0.5);
    products.push({
      id: generateProductId(i),
      name: nameSource + ' ' + (type === 'bar' ? 'สบู่ก้อน' : type === 'liquid' ? 'สบู่เหลว' : 'สบู่เหลวอาบน้ำ'),
      type: type === 'bar' ? 'สบู่ก้อน' : type === 'liquid' ? 'สบู่เหลว' : 'สบู่เหลวอาบน้ำ',
      typeEn: type,
      price: randomInt(priceRanges[type][0], priceRanges[type][1]),
      weight: weights[type],
      netWeight: netWeights[type],
      ingredients: randomPick(ingredientsList),
      expirationDate: `${randomInt(12, 36)} เดือนนับจากวันที่ผลิต`,
      description: `${nameSource} สูตรพรีเมียม อ่อนโยนต่อผิว ให้ความชุ่มชื่น พร้อมกลิ่นหอมระดับพรีเมียมจากธรรมชาติแท้`,
      tags: shuffledTags.slice(0, tagCount),
      stock: randomInt(5, 50),
      image: `https://placehold.co/300x300/e2e8f0/64748b?text=${encodeURIComponent(nameSource)}`
    });
  }
  return products;
}

function generateCustomers(count = 15) {
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
      address: `${randomInt(1, 999)}/${randomInt(1, 500)} ถ.${street} แขวง${district} เขต${district} จ.${city} ${String(randomInt(10000, 10900))}`,
      phone: `08${String(randomInt(10000000, 99999999))}`
    });
  }
  return customers;
}

function generateOrders(products, customers, count = 20) {
  const orders = [];
  const statuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  for (let i = 0; i < count; i++) {
    const customer = randomPick(customers);
    const itemCount = randomInt(1, 5);
    const items = [];
    let total = 0;
    const selectedIds = new Set();
    for (let j = 0; j < itemCount; j++) {
      let product;
      do { product = randomPick(products); } while (selectedIds.has(product.id));
      selectedIds.add(product.id);
      const qty = randomInt(1, 3);
      items.push({ productId: product.id, productName: product.name, price: product.price, quantity: qty });
      total += product.price * qty;
    }
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - randomInt(0, 30));
    orders.push({
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      items: items,
      total: total,
      paymentMethod: randomPick(paymentMethods),
      status: randomPick(statuses),
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
