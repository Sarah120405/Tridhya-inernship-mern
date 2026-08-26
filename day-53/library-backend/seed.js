// scripts/seed.js
import { sequelize } from "./src/config/db.js";
import { Author, Book, Member, BorrowRecord } from "./src/models/index.js";

async function seed() {
  await sequelize.authenticate();
  console.log("Connected to MySQL");

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await BorrowRecord.destroy({ where: {}, truncate: true });
  await Book.destroy({ where: {}, truncate: true });
  await Member.destroy({ where: {}, truncate: true });
  await Author.destroy({ where: {}, truncate: true });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Cleared existing data");

  // --- Authors ---
  const authors = await Author.bulkCreate([
    {
      name: "George Orwell",
      bio: "English novelist and essayist, known for 1984 and Animal Farm.",
    },
    {
      name: "Jane Austen",
      bio: "English novelist known for romantic fiction set among the landed gentry.",
    },
    {
      name: "J.R.R. Tolkien",
      bio: "English writer and philologist, author of The Lord of the Rings.",
    },
    {
      name: "Agatha Christie",
      bio: "English writer known for detective novels, especially Hercule Poirot.",
    },
    {
      name: "Isaac Asimov",
      bio: "American writer and professor, known for science fiction and popular science.",
    },
    {
      name: "Toni Morrison",
      bio: "American novelist and Nobel laureate, known for Beloved and Song of Solomon.",
    },
  ]);
  console.log(`${authors.length} authors created`);

  const [orwell, austen, tolkien, christie, asimov, morrison] = authors;

  // --- Books ---
  const books = await Book.bulkCreate([
    {
      title: "1984",
      author_id: orwell.id,
      genre: "Dystopian",
      published_year: 1949,
      copies_available: 4,
    },
    {
      title: "Animal Farm",
      author_id: orwell.id,
      genre: "Satire",
      published_year: 1945,
      copies_available: 3,
    },
    {
      title: "Pride and Prejudice",
      author_id: austen.id,
      genre: "Romance",
      published_year: 1813,
      copies_available: 2,
    },
    {
      title: "Emma",
      author_id: austen.id,
      genre: "Romance",
      published_year: 1815,
      copies_available: 2,
    },
    {
      title: "The Hobbit",
      author_id: tolkien.id,
      genre: "Fantasy",
      published_year: 1937,
      copies_available: 1,
    },
    {
      title: "The Fellowship of the Ring",
      author_id: tolkien.id,
      genre: "Fantasy",
      published_year: 1954,
      copies_available: 2,
    },
    {
      title: "Murder on the Orient Express",
      author_id: christie.id,
      genre: "Mystery",
      published_year: 1934,
      copies_available: 3,
    },
    {
      title: "And Then There Were None",
      author_id: christie.id,
      genre: "Mystery",
      published_year: 1939,
      copies_available: 0,
    },
    {
      title: "Foundation",
      author_id: asimov.id,
      genre: "Science Fiction",
      published_year: 1951,
      copies_available: 2,
    },
    {
      title: "I, Robot",
      author_id: asimov.id,
      genre: "Science Fiction",
      published_year: 1950,
      copies_available: 3,
    },
    {
      title: "Beloved",
      author_id: morrison.id,
      genre: "Literary Fiction",
      published_year: 1987,
      copies_available: 1,
    },
    // Morrison's second book deliberately never borrowed, to test "no book borrowed" reports
    {
      title: "Song of Solomon",
      author_id: morrison.id,
      genre: "Literary Fiction",
      published_year: 1977,
      copies_available: 2,
    },
  ]);
  console.log(`${books.length} books created`);

  const [
    b1984,
    animalFarm,
    pride,
    emma,
    hobbit,
    fellowship,
    murder,
    andThenNone,
    foundation,
    iRobot,
    beloved,
  ] = books;

  // --- Members ---
  const members = await Member.bulkCreate([
    { name: "Alice Johnson", email: "alice@example.com" },
    { name: "Bob Smith", email: "bob@example.com" },
    { name: "Carla Mendes", email: "carla@example.com" },
    { name: "David Lee", email: "david@example.com" },
    { name: "Emma Wilson", email: "emma@example.com" },
  ]);
  console.log(`${members.length} members created`);

  const [alice, bob, carla, david, emma_member] = members;

  // --- Borrow Records ---
  // Mix of: currently overdue (>14 days, not returned), currently active (within 14 days),
  // and returned (on-time and late), spread across recent months for trend data
  const borrowRecords = await BorrowRecord.bulkCreate([
    // Overdue (borrowed 20-30 days ago, still not returned)
    {
      book_id: b1984.id,
      member_id: alice.id,
      borrowed_at: daysAgo(25),
      returned: false,
    },
    {
      book_id: pride.id,
      member_id: bob.id,
      borrowed_at: daysAgo(30),
      returned: false,
    },
    {
      book_id: murder.id,
      member_id: carla.id,
      borrowed_at: daysAgo(21),
      returned: false,
    },

    // Active, within the 14-day window (not overdue)
    {
      book_id: hobbit.id,
      member_id: david.id,
      borrowed_at: daysAgo(5),
      returned: false,
    },
    {
      book_id: foundation.id,
      member_id: emma_member.id,
      borrowed_at: daysAgo(2),
      returned: false,
    },
    {
      book_id: animalFarm.id,
      member_id: alice.id,
      borrowed_at: daysAgo(8),
      returned: false,
    },

    // Returned on time
    {
      book_id: emma.id,
      member_id: bob.id,
      borrowed_at: daysAgo(60),
      return_date: daysAgo(50),
      returned: true,
    },
    {
      book_id: iRobot.id,
      member_id: carla.id,
      borrowed_at: daysAgo(45),
      return_date: daysAgo(40),
      returned: true,
    },
    {
      book_id: beloved.id,
      member_id: david.id,
      borrowed_at: daysAgo(90),
      return_date: daysAgo(85),
      returned: true,
    },

    // Returned late (was overdue at the time, now resolved)
    {
      book_id: fellowship.id,
      member_id: emma_member.id,
      borrowed_at: daysAgo(70),
      return_date: daysAgo(40),
      returned: true,
    },

    // Older records for monthly trend variety
    {
      book_id: b1984.id,
      member_id: carla.id,
      borrowed_at: daysAgo(110),
      return_date: daysAgo(100),
      returned: true,
    },
    {
      book_id: animalFarm.id,
      member_id: david.id,
      borrowed_at: daysAgo(140),
      return_date: daysAgo(130),
      returned: true,
    },
    {
      book_id: pride.id,
      member_id: alice.id,
      borrowed_at: daysAgo(170),
      return_date: daysAgo(160),
      returned: true,
    },
  ]);
  console.log(`${borrowRecords.length} borrow records created`);

  console.log("\nSeed complete.");
  console.log("Test scenarios ready:");
  console.log(
    `- Overdue: 1984/Alice, Pride and Prejudice/Bob, Murder on the Orient Express/Carla`,
  );
  console.log(
    `- And Then There Were None has 0 copies available (test full-capacity rejection)`,
  );
  console.log(
    `- Song of Solomon has never been borrowed (test "no book borrowed" reports)`,
  );

  process.exit(0);
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
