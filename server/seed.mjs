// Populates the dev database with realistic, persistent test data spanning every
// category: multiple shops, products across categories, events, coupons, orders in
// different statuses, and a pending withdraw request. Safe to re-run — it deletes any
// previously seeded records (by their fixed emails) before recreating them.
//
// Run with: node seed.mjs

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.js";
import Shop from "./models/Shop.js";
import Product from "./models/Product.js";
import Event from "./models/Event.js";
import Coupon from "./models/Coupon.js";
import Order from "./models/Order.js";
import Withdraw from "./models/Withdraw.js";

await mongoose.connect(process.env.MONGO_URI);

const img = (seed) => [{ public_id: `seed_${seed}`, url: `https://picsum.photos/seed/${seed}/500/500` }];

// ---------- clean slate for previously seeded data ----------
const seedShopEmails = ["techhub@seed.test", "stylecraft@seed.test"];
const seedUserEmails = ["buyer@seed.test", "admin@seed.test"];

const oldShops = await Shop.find({ email: { $in: seedShopEmails } });
for (const shop of oldShops) {
  await Product.deleteMany({ shopId: shop._id });
  await Event.deleteMany({ shopId: shop._id });
  await Coupon.deleteMany({ shopId: shop._id });
  await Order.deleteMany({ shopId: shop._id });
  await Withdraw.deleteMany({ shopId: shop._id });
}
await Shop.deleteMany({ email: { $in: seedShopEmails } });
await User.deleteMany({ email: { $in: seedUserEmails } });

// ---------- shops ----------
const techhub = await Shop.create({
  name: "TechHub Electronics",
  email: "techhub@seed.test",
  password: "password123",
  description: "Your one-stop shop for computers, phones, and gaming gear.",
  address: "42 Circuit Ave, San Francisco, CA",
  phoneNumber: 4155551234,
  zipCode: 94105,
  avatar: { public_id: "seed_techhub_avatar", url: "https://picsum.photos/seed/techhub-avatar/200/200" },
  availableBalance: 342.5,
  withdrawMethod: { bankName: "Chase Bank", accountHolder: "TechHub Electronics LLC", accountNumber: "000987654321" },
  transactions: [{ amount: 342.5, status: "Processing", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }],
});

const stylecraft = await Shop.create({
  name: "StyleCraft Boutique",
  email: "stylecraft@seed.test",
  password: "password123",
  description: "Curated clothing, shoes, and accessories for every season.",
  address: "17 Fashion Row, New York, NY",
  phoneNumber: 2125557890,
  zipCode: 10001,
  avatar: { public_id: "seed_stylecraft_avatar", url: "https://picsum.photos/seed/stylecraft-avatar/200/200" },
  availableBalance: 0,
});

// ---------- users ----------
const buyer = await User.create({
  name: "Alex Buyer",
  email: "buyer@seed.test",
  password: "password123",
  phoneNumber: "5551234567",
  avatar: { public_id: "seed_buyer_avatar", url: "https://picsum.photos/seed/buyer-avatar/200/200" },
  addresses: [
    { country: "US", city: "CA", address1: "123 Main St", address2: "Apt 4B", zipCode: 94107, addressType: "Home" },
    { country: "US", city: "NY", address1: "456 Office Blvd", zipCode: 10002, addressType: "Office" },
  ],
});

await User.create({
  name: "Admin User",
  email: "admin@seed.test",
  password: "password123",
  role: "admin",
  avatar: { public_id: "seed_admin_avatar", url: "https://picsum.photos/seed/admin-avatar/200/200" },
});

// ---------- products (spread across real categories) ----------
const productDefs = [
  { shop: techhub, name: "UltraBook Pro 14", category: "Computers and Laptops", description: "14-inch laptop with a full-day battery and a crisp 2K display.", originalPrice: 1299, discountPrice: 999, stock: 12, sold_out: 34, img: "ultrabook" },
  { shop: techhub, name: "Mechanical Keyboard RGB", category: "Computers and Laptops", description: "Hot-swappable mechanical keyboard with per-key RGB lighting.", originalPrice: 129, discountPrice: 89, stock: 40, sold_out: 61, img: "keyboard" },
  { shop: techhub, name: "NovaPhone X5", category: "Mobile and Tablets", description: "6.5-inch OLED phone with a 108MP camera and 5G.", originalPrice: 899, discountPrice: 749, stock: 8, sold_out: 120, img: "novaphone" },
  { shop: techhub, name: "Tablet Air 11", category: "Mobile and Tablets", description: "Lightweight 11-inch tablet, great for note-taking and streaming.", originalPrice: 599, discountPrice: 499, stock: 0, sold_out: 15, img: "tablet" },
  { shop: techhub, name: "Wireless Gaming Headset", category: "Music and Gaming", description: "Low-latency wireless headset with 7.1 surround sound.", originalPrice: 149, discountPrice: 99, stock: 25, sold_out: 88, img: "headset" },
  { shop: techhub, name: "Pro Gaming Controller", category: "Music and Gaming", description: "Customizable controller with swappable thumbsticks.", originalPrice: 79, discountPrice: 59, stock: 30, sold_out: 42, img: "controller" },
  { shop: stylecraft, name: "Classic Leather Jacket", category: "Cloths", description: "Genuine leather jacket with a timeless cut.", originalPrice: 249, discountPrice: 189, stock: 15, sold_out: 27, img: "jacket" },
  { shop: stylecraft, name: "Everyday Cotton Tee (3-pack)", category: "Cloths", description: "Soft, breathable cotton tees in classic colors.", originalPrice: 45, discountPrice: 29, stock: 60, sold_out: 205, img: "tshirt" },
  { shop: stylecraft, name: "Trail Running Shoes", category: "Shoes", description: "Lightweight trail shoes with grippy rubber soles.", originalPrice: 139, discountPrice: 109, stock: 20, sold_out: 73, img: "shoes" },
  { shop: stylecraft, name: "Minimalist Leather Wallet", category: "Accesories", description: "Slim bifold wallet, RFID-blocking, full-grain leather.", originalPrice: 59, discountPrice: 39, stock: 50, sold_out: 96, img: "wallet" },
  { shop: stylecraft, name: "Hydrating Face Serum", category: "cosmetics and body care", description: "Vitamin C + hyaluronic acid serum for daily glow.", originalPrice: 38, discountPrice: 28, stock: 5, sold_out: 150, img: "serum" },
  { shop: stylecraft, name: "Ceramic Dog Bowl Set", category: "Pet Care", description: "Non-slip ceramic bowls, dishwasher safe, set of 2.", originalPrice: 34, discountPrice: 24, stock: 22, sold_out: 18, img: "dogbowl" },
];

const products = [];
for (const [index, p] of productDefs.entries()) {
  const rating = index % 2 === 0 ? 5 : 4;
  const product = await Product.create({
    name: p.name,
    description: p.description,
    category: p.category,
    tags: p.category,
    originalPrice: p.originalPrice,
    discountPrice: p.discountPrice,
    stock: p.stock,
    sold_out: p.sold_out,
    images: img(p.img),
    shopId: p.shop._id,
    shop: p.shop,
    ratings: rating,
  });
  product.reviews.push({
    user: { _id: buyer._id, name: buyer.name, avatar: buyer.avatar },
    rating,
    comment: "Solid quality, would buy again.",
    productId: product._id.toString(),
  });
  await product.save();
  products.push(product);
}

// ---------- events (currently running flash sales) ----------
await Event.create({
  name: "Laptop Flash Sale",
  description: "24-hour flash sale on select laptops — up to 30% off.",
  category: "Computers and Laptops",
  tags: "sale, laptops",
  originalPrice: 1299,
  discountPrice: 899,
  stock: 10,
  sold_out: 6,
  images: img("event-laptop"),
  shopId: techhub._id,
  shop: techhub,
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  finishDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
});

await Event.create({
  name: "Summer Wardrobe Refresh",
  description: "Refresh your closet — jackets and shoes discounted this week.",
  category: "Cloths",
  tags: "sale, summer",
  originalPrice: 249,
  discountPrice: 159,
  stock: 8,
  sold_out: 11,
  images: img("event-jacket"),
  shopId: stylecraft._id,
  shop: stylecraft,
  startDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
  finishDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
});

// ---------- coupons ----------
await Coupon.create({ name: "TECH10", value: 10, minAmount: 50, shopId: techhub._id });
await Coupon.create({ name: "STYLE20", value: 20, minAmount: 30, maxAmount: 100, shopId: stylecraft._id, selectedProduct: "Classic Leather Jacket" });

// ---------- orders (one per status, spread across both shops) ----------
const laptop = products[0];
const tee = products[7];
const wallet = products[9];

await Order.create({
  cart: [{ product: laptop._id, name: laptop.name, discountPrice: laptop.discountPrice, images: laptop.images, qty: 1 }],
  shippingAddress: { country: "US", city: "CA", address1: "123 Main St", address2: "Apt 4B", zipCode: 94107 },
  user: buyer._id,
  shopId: techhub._id,
  totalPrice: laptop.discountPrice,
  status: "Pending Payment",
});

await Order.create({
  cart: [{ product: tee._id, name: tee.name, discountPrice: tee.discountPrice, images: tee.images, qty: 2 }],
  shippingAddress: { country: "US", city: "CA", address1: "123 Main St", address2: "Apt 4B", zipCode: 94107 },
  user: buyer._id,
  shopId: stylecraft._id,
  totalPrice: tee.discountPrice * 2,
  status: "Processing",
  paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  paymentInfo: { id: "pi_seed_processing", status: "succeeded", type: "Stripe" },
});

await Order.create({
  cart: [{ product: wallet._id, name: wallet.name, discountPrice: wallet.discountPrice, images: wallet.images, qty: 1 }],
  shippingAddress: { country: "US", city: "NY", address1: "456 Office Blvd", zipCode: 10002 },
  user: buyer._id,
  shopId: stylecraft._id,
  totalPrice: wallet.discountPrice,
  status: "Shipped",
  paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  paymentInfo: { id: "pi_seed_shipped", status: "succeeded", type: "Stripe" },
});

const keyboard = products[1];
await Order.create({
  cart: [{ product: keyboard._id, name: keyboard.name, discountPrice: keyboard.discountPrice, images: keyboard.images, qty: 1 }],
  shippingAddress: { country: "US", city: "CA", address1: "123 Main St", zipCode: 94107 },
  user: buyer._id,
  shopId: techhub._id,
  totalPrice: keyboard.discountPrice,
  status: "Delivered",
  paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  deliveredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  paymentInfo: { id: "pi_seed_delivered", status: "succeeded", type: "Stripe" },
});

// ---------- a pending withdraw request for TechHub ----------
await Withdraw.create({ shopId: techhub._id, amount: 150, status: "Processing" });

console.log(`
Seed complete. Log in with any of these (password: password123):

  Buyer:      buyer@seed.test
  Admin:      admin@seed.test
  Seller 1:   techhub@seed.test      (TechHub Electronics — has balance, withdraw method, pending withdraw request)
  Seller 2:   stylecraft@seed.test   (StyleCraft Boutique — zero balance, no withdraw method yet)

${products.length} products across 6 categories, 2 events, 2 coupons (TECH10, STYLE20), 4 orders (one per status).
Re-run this script any time — it deletes and recreates the same seeded records.
`);

await mongoose.disconnect();
