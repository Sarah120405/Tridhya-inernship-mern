import { sequelize } from "../../config/db.js";
import { Book, BorrowRecord } from "../../models/index.js";

export async function borrowBook(bookId, memberId) {
  const t = await sequelize.transaction();

  try {
    const book = await Book.findByPk(bookId, { transaction: t });
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }
    if (book.copies_available < 1) {
      const error = new Error("No copies available to borrow");
      error.status = 409;
      throw error;
    }

    const activeBorrow = await BorrowRecord.findOne({
      where: { book_id: bookId, member_id: memberId, returned: false },
      transaction: t,
    });

    if (activeBorrow) {
      const error = new Error("You already have this book borrowed");
      error.status = 409;
      throw error;
    }

    const record = await BorrowRecord.create(
      {
        book_id: bookId,
        member_id: memberId,
        borrowed_at: new Date(),
        returned: false,
      },
      { transaction: t },
    );

    await Book.decrement("copies_available", {
      by: 1,
      where: { id: bookId },
      transaction: t,
    });

    await t.commit();
    return record;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function returnBook(recordId) {
  const t = await sequelize.transaction();

  try {
    const existing = await BorrowRecord.findByPk(recordId, { transaction: t });
    if (!existing) {
      const error = new Error("No borrow record exists");
      error.status = 404;
      throw error;
    }

    if (existing.returned) {
      const error = new Error("Book already returned");
      error.status = 409;
      throw error;
    }
    await BorrowRecord.update(
      { returned: true, return_date: new Date() },
      { where: { id: recordId }, transaction: t },
    );
    await Book.increment("copies_available", {
      by: 1,
      where: { id: existing.book_id },
      transaction: t,
    });

    await t.commit();
    return { message: "Book was successfully returned" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
