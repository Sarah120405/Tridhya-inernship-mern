// scripts/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User, Event, Booking, Favorite } from "./src/models/index.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Clear existing data — comment these out if you want to keep existing data
  await User.deleteMany({});
  await Event.deleteMany({});
  await Booking.deleteMany({});
  await Favorite.deleteMany({});
  console.log("Cleared existing data");

  // --- Users ---
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await User.create({
    name: "Admin Sarah",
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });

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

  console.log("Users created (login with password: password123)");

  // --- Events ---
  const events = await Event.create([
    {
      title: "React Summit 2026",
      description:
        "A full day conference on React and the modern frontend ecosystem.",
      date: new Date("2026-09-15"),
      location: "Bangalore",
      capacity: 100,
      price: 1500,
      category: "Tech",
      createdBy: admin._id,
    },
    {
      title: "Indie Music Night",
      description: "Live performances from up-and-coming local indie artists.",
      date: new Date("2026-08-30"),
      location: "Mumbai",
      capacity: 50,
      price: 500,
      category: "Music",
      createdBy: admin._id,
    },
    {
      title: "City Marathon",
      description:
        "Annual 10K run through the city center, open to all skill levels.",
      date: new Date("2026-10-05"),
      location: "Ahmedabad",
      capacity: 2,
      price: 0,
      category: "Sports",
      createdBy: admin._id,
    },
    {
      title: "Startup Founders Meetup",
      description:
        "Networking event for early-stage startup founders and investors.",
      date: new Date("2026-09-01"),
      location: "Delhi",
      capacity: 30,
      price: 200,
      category: "Tech",
      createdBy: admin._id,
    },
  ]);

  console.log(`${events.length} events created`);

  // --- Bookings ---
  await Booking.create([
    { bookedBy: alice._id, event: events[0]._id }, // Alice booked React Summit
    { bookedBy: alice._id, event: events[1]._id }, // Alice booked Music Night
    { bookedBy: bob._id, event: events[0]._id }, // Bob booked React Summit
    { bookedBy: bob._id, event: events[2]._id }, // Bob booked Marathon (capacity: 2, now full since 1 spot left)
  ]);

  console.log("Bookings created");

  // --- Favorites ---
  await Favorite.create([
    { user: alice._id, event: events[2]._id }, // Alice favorited Marathon
    { user: alice._id, event: events[3]._id }, // Alice favorited Founders Meetup
    { user: bob._id, event: events[1]._id }, // Bob favorited Music Night
  ]);

  console.log("Favorites created");

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
