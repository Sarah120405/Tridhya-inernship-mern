import { sequelize } from "../../config/db.js";
import { Member, BorrowRecord, Book } from "../../models/index.js";
import { QueryTypes } from "sequelize";

export async function createMember(memberData) {
  const existing = await Member.findOne({ where: { email: memberData.email } });
  if (existing) {
    const error = new Error("A Member with this email already exists");
    error.status = 409;
    throw error;
  }

  const member = await Member.create(memberData);

  return member;
}

export async function getAllMembers() {
  const members = await Member.findAll({
    attributes: [
      "id",
      "name",
      "email",
      "join_date",
      [
        sequelize.fn("COUNT", sequelize.col("BorrowedRecords.id")),
        "borrow_count",
      ],
    ],
    include: {
      model: BorrowRecord,
      attributes: [],
    },
    group: ["Member.id"],
  });
  return members;
}

export async function getMemberById(id) {
  const member = await Member.findByPk(id, {
    include: {
      model: BorrowRecord,
      include: {
        model: Book,
        attributes: ["id", "title", "genre"],
      },
    },
  });
  if (!member) {
    const error = new Error("Member not found");
    error.status = 404;
    throw error;
  }
  return member;
}

export async function getMemberBorrowSummary(memberId) {
  const [borrowSummary] = await sequelize.query(
    "SELECT * FROM member_borrow_summary WHERE id = :memberId",
    {
      replacements: { memberId },
      type: sequelize.QueryTypes.SELECT,
    },
  );
  return borrowSummary;
}

export async function activeMembers() {
  const members = await sequelize.query(
    `SELECT members.id, members.name, count(borrow_records.id) AS times_borrowed
    FROM members
    JOIN borrow_records on members.id = borrow_records.member_id
    GROUP BY members.id
    ORDER BY times_borrowed DESC
    LIMIT 5
     `,
    { type: sequelize.QueryTypes.SELECT },
  );
  return members;
}
