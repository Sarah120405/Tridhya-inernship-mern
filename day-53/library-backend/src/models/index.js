import { Author } from "./Author.js";
import { Book } from "./Books.js";
import { Member } from "./Memebers.js";
import { BorrowRecord } from "./Borrow_Records.js";

Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });

Book.hasMany(BorrowRecord, { foreignKey: "book_id" });
BorrowRecord.belongsTo(Book, { foreignKey: "book_id" });

Member.hasMany(BorrowRecord, { foreignKey: "member_id" });
BorrowRecord.belongsTo(Member, { foreignKey: "member_id" });

export { Author, Book, Member, BorrowRecord };
