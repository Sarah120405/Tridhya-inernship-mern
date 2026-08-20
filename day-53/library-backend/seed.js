// scripts/seed.js
import { sequelize } from "./src/config/db.js";
import { Author, Book, Member, BorrowRecord } from "./src/models/index.js";

async function seed() {
  await sequelize.authenticate();
  console.log("Connected to MySQL");

  // Clear existing data — order matters, due to foreign key constraints
  // (children must be deleted before their referenced parents)
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

  await BorrowRecord.destroy({ where: {}, truncate: true });
  await Book.destroy({ where: {}, truncate: true });
  await Member.destroy({ where: {}, truncate: true });
  await Author.destroy({ where: {}, truncate: true });

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Cleared existing data");

  // --- Authors ---
  const orwell = await Author.create({
    name: "George Orwell",
    bio: "English novelist and essayist, known for 1984 and Animal Farm.",
  });
  const austen = await Author.create({
    name: "Jane Austen",
    bio: "English novelist known for romantic fiction set among the landed gentry.",
  });
  const tolkien = await Author.create({
    name: "J.R.R. Tolkien",
    bio: "English writer and philologist, author of The Lord of the Rings.",
  });

  console.log("Authors created");

  // --- Books --- (one with copies_available: 1, to test the "no copies left" case)
  const book1984 = await Book.create({
    title: "1984",
    author_id: orwell.id,
    genre: "Dystopian",
    published_year: 1949,
    copies_available: 3,
  });
  const animalFarm = await Book.create({
    title: "Animal Farm",
    author_id: orwell.id,
    genre: "Satire",
    published_year: 1945,
    copies_available: 2,
  });
  const prideAndPrejudice = await Book.create({
    title: "Pride and Prejudice",
    author_id: austen.id,
    genre: "Romance",
    published_year: 1813,
    copies_available: 1, // only one copy — good for testing the capacity limit
  });
  const hobbit = await Book.create({
    title: "The Hobbit",
    author_id: tolkien.id,
    genre: "Fantasy",
    published_year: 1937,
    copies_available: 0, // zero copies — good for testing the "no copies available" rejection
  });

  console.log("Books created");

  // --- Members ---
  const alice = await Member.create({
    name: "Alice",
    email: "alice@example.com",
  });
  const bob = await Member.create({ name: "Bob", email: "bob@example.com" });

  console.log("Members created");

  // --- Borrow Records ---
  // Alice currently has 1984 borrowed (not yet returned) — tests the "already borrowed" check
  await BorrowRecord.create({
    book_id: book1984.id,
    member_id: alice.id,
    borrowed_at: new Date("2026-08-01"),
    returned: false,
  });

  // Bob previously borrowed and returned Animal Farm — tests that borrowing again after returning works
  await BorrowRecord.create({
    book_id: animalFarm.id,
    member_id: bob.id,
    borrowed_at: new Date("2026-07-10"),
    return_date: new Date("2026-07-24"),
    returned: true,
  });

  console.log("Borrow records created");

  console.log("\nSeed complete. Test scenarios ready:");
  console.log(
    `- Try borrowing "1984" (id: ${book1984.id}) as Alice (id: ${alice.id}) — should fail, already borrowed`,
  );
  console.log(
    `- Try borrowing "The Hobbit" (id: ${hobbit.id}) as anyone — should fail, 0 copies available`,
  );
  console.log(
    `- Try borrowing "Pride and Prejudice" (id: ${prideAndPrejudice.id}) as Bob (id: ${bob.id}) — should succeed`,
  );
  console.log(
    `- Try returning Bob's already-returned Animal Farm record — should fail, already returned`,
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
