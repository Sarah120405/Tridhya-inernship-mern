// scripts/seedShop.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Product from "./src/models/Product.js";
import Order from "./src/models/Order.js";
import Cart from "./src/models/Cart.js";
import User from "./src/models/User.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  await Order.deleteMany({});
  await Cart.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared existing data");

  // --- Users ---
  const passwordHash = "password123";

  const alice = await User.create({
    name: "Alice",
    email: "alice@example.com",
    passwordHash,
    role: "user",
  });
  const bob = await User.create({
    name: "Bob",
    email: "bob@example.com",
    passwordHash,
    role: "user",
  });
  const admin = await User.create({
    name: "Admin Sarah",
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });

  console.log("Users created (login with password: password123)");

  // --- Products ---
  const products = await Product.create([
    {
      name: "Wireless Mouse",
      description:
        "An ergonomic wireless mouse with a 2.4GHz USB receiver, adjustable DPI, and up to 12 months of battery life on two AA batteries.",
      category: "Electronics",
      price: 799,
      stock: 50,
      image: "https://placehold.co/400x400/e0e7ff/4338ca?text=Wireless+Mouse",
    },
    {
      name: "Bluetooth Headphones",
      description:
        "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and a foldable design for easy travel.",
      category: "Electronics",
      price: 2499,
      stock: 30,
      image: "https://placehold.co/400x400/e0e7ff/4338ca?text=Headphones",
    },
    {
      name: "USB-C Charging Cable",
      description:
        "A durable 1-meter braided USB-C cable supporting fast charging and data transfer, compatible with most modern phones and laptops.",
      category: "Electronics",
      price: 299,
      stock: 100,
      image: "https://placehold.co/400x400/e0e7ff/4338ca?text=USB-C+Cable",
    },
    {
      name: "Cotton T-Shirt",
      description:
        "A soft, breathable 100% cotton t-shirt in a relaxed regular fit, pre-shrunk and available in classic solid colors.",
      category: "Clothing",
      price: 599,
      stock: 80,
      image: "https://placehold.co/400x400/fce7f3/9d174d?text=T-Shirt",
    },
    {
      name: "Denim Jacket",
      description:
        "A classic blue denim jacket with a button-front closure, chest pockets, and a slightly worn-in wash for everyday wear.",
      category: "Clothing",
      price: 2199,
      stock: 25,
      image: "https://placehold.co/400x400/fce7f3/9d174d?text=Denim+Jacket",
    },
    {
      name: "Running Shoes",
      description:
        "Lightweight, breathable running shoes with cushioned soles and a mesh upper, designed for everyday training and long-distance runs.",
      category: "Clothing",
      price: 3499,
      stock: 40,
      image: "https://placehold.co/400x400/fce7f3/9d174d?text=Running+Shoes",
    },
    {
      name: "The Midnight Library",
      description:
        "A bestselling novel following a woman who finds herself in a library between life and death, exploring the lives she could have lived.",
      category: "Books",
      price: 399,
      stock: 60,
      image: "https://placehold.co/400x400/fef3c7/92400e?text=Midnight+Library",
    },
    {
      name: "Atomic Habits",
      description:
        "A practical, research-backed guide to building good habits and breaking bad ones, using small, incremental changes.",
      category: "Books",
      price: 449,
      stock: 55,
      image: "https://placehold.co/400x400/fef3c7/92400e?text=Atomic+Habits",
    },
    {
      name: "Silver Necklace",
      description:
        "A delicate sterling silver chain necklace with a minimalist pendant, suitable for everyday wear or special occasions.",
      category: "Jewellery",
      price: 1899,
      stock: 15,
      image: "https://placehold.co/400x400/d1fae5/065f46?text=Silver+Necklace",
    },
    {
      name: "Gold-Plated Earrings",
      description:
        "Elegant gold-plated stud earrings with a subtle geometric design, lightweight and hypoallergenic for daily wear.",
      category: "Jewellery",
      price: 1299,
      stock: 20,
      image: "https://placehold.co/400x400/d1fae5/065f46?text=Earrings",
    },
    {
      name: "Notebook Set",
      description:
        "A pack of three A5 ruled notebooks with sturdy hardcover binding, 120 pages each, ideal for journaling or note-taking.",
      category: "Stationery",
      price: 249,
      stock: 90,
      image: "https://placehold.co/400x400/ede9fe/5b21b6?text=Notebooks",
    },
    {
      name: "Fountain Pen",
      description:
        "A premium fountain pen with a smooth stainless steel nib, comes with two ink cartridges and a converter for refillable use.",
      category: "Stationery",
      price: 899,
      stock: 35,
      image: "https://placehold.co/400x400/ede9fe/5b21b6?text=Fountain+Pen",
    },
  ]);

  console.log(`${products.length} products created`);

  const [
    mouse,
    headphones,
    cable,
    tshirt,
    jacket,
    shoes,
    book1,
    book2,
    necklace,
    earrings,
    notebooks,
    pen,
  ] = products;

  // --- Orders — spread across months, statuses, users, with some price snapshots differing from current price ---
  const orders = await Order.create([
    {
      user: alice._id,
      items: [
        {
          product: headphones._id,
          productName: headphones.name,
          price: 2399,
          quantity: 1,
        }, // was cheaper then
        {
          product: cable._id,
          productName: cable.name,
          price: cable.price,
          quantity: 2,
        },
      ],
      totalAmount: 2399 + cable.price * 2,
      status: "delivered",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-05-12"),
    },
    {
      user: bob._id,
      items: [
        {
          product: mouse._id,
          productName: mouse.name,
          price: mouse.price,
          quantity: 1,
        },
      ],
      totalAmount: mouse.price,
      status: "delivered",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-05-20"),
    },
    {
      user: alice._id,
      items: [
        {
          product: tshirt._id,
          productName: tshirt.name,
          price: tshirt.price,
          quantity: 3,
        },
        {
          product: jacket._id,
          productName: jacket.name,
          price: jacket.price,
          quantity: 1,
        },
      ],
      totalAmount: tshirt.price * 3 + jacket.price,
      status: "shipped",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-06-05"),
    },
    {
      user: bob._id,
      items: [
        {
          product: book1._id,
          productName: book1.name,
          price: book1.price,
          quantity: 2,
        },
      ],
      totalAmount: book1.price * 2,
      status: "delivered",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-06-15"),
    },
    {
      user: alice._id,
      items: [
        {
          product: shoes._id,
          productName: shoes.name,
          price: shoes.price,
          quantity: 1,
        },
      ],
      totalAmount: shoes.price,
      status: "cancelled",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-06-22"),
    },
    {
      user: bob._id,
      items: [
        {
          product: necklace._id,
          productName: necklace.name,
          price: necklace.price,
          quantity: 1,
        },
        {
          product: earrings._id,
          productName: earrings.name,
          price: earrings.price,
          quantity: 1,
        },
      ],
      totalAmount: necklace.price + earrings.price,
      status: "delivered",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-07-02"),
    },
    {
      user: alice._id,
      items: [
        {
          product: headphones._id,
          productName: headphones.name,
          price: headphones.price,
          quantity: 1,
        },
      ],
      totalAmount: headphones.price,
      status: "delivered",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-07-10"),
    },
    {
      user: bob._id,
      items: [
        {
          product: notebooks._id,
          productName: notebooks.name,
          price: notebooks.price,
          quantity: 5,
        },
      ],
      totalAmount: notebooks.price * 5,
      status: "pending",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-07-18"),
    },
    {
      user: alice._id,
      items: [
        {
          product: mouse._id,
          productName: mouse.name,
          price: mouse.price,
          quantity: 2,
        },
        {
          product: pen._id,
          productName: pen.name,
          price: pen.price,
          quantity: 1,
        },
      ],
      totalAmount: mouse.price * 2 + pen.price,
      status: "shipped",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-07-25"),
    },
    {
      user: bob._id,
      items: [
        {
          product: book2._id,
          productName: book2.name,
          price: book2.price,
          quantity: 1,
        },
      ],
      totalAmount: book2.price,
      status: "delivered",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-08-01"),
    },
    {
      user: alice._id,
      items: [
        {
          product: headphones._id,
          productName: headphones.name,
          price: headphones.price,
          quantity: 1,
        },
      ],
      totalAmount: headphones.price,
      status: "delivered",
      shippingAddress: "123 MG Road, Bangalore",
      createdAt: new Date("2026-08-05"),
    },
    {
      user: bob._id,
      items: [
        {
          product: shoes._id,
          productName: shoes.name,
          price: shoes.price,
          quantity: 1,
        },
      ],
      totalAmount: shoes.price,
      status: "pending",
      shippingAddress: "45 Park Street, Kolkata",
      createdAt: new Date("2026-08-10"),
    },
  ]);

  console.log(`${orders.length} orders created`);

  // --- One cart, for alice, showing live-referenced items (no snapshot) ---
  await Cart.create({
    user: alice._id,
    items: [
      { product: pen._id, quantity: 2 },
      { product: notebooks._id, quantity: 1 },
    ],
  });

  console.log("Cart created for Alice");

  console.log("\nSeed complete. Test accounts:");
  console.log("  admin@example.com / password123 (admin)");
  console.log("  alice@example.com / password123 (user)");
  console.log("  bob@example.com / password123 (user)");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
