import {
  activeMembers,
  createMember,
  editMember,
  getAllMembers,
  getMemberBorrowSummary,
  getMemberById,
} from "./member.service.js";

export async function createMemberController(req, res) {
  try {
    const member = await createMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getAllMembersController(req, res) {
  try {
    const members = await getAllMembers();
    res.status(200).json(members);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getMemberByIdController(req, res) {
  try {
    const member = await getMemberById(req.params.id);
    res.status(200).json(member);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getMemberBorrowSummaryController(req, res) {
  try {
    const borrowSummary = await getMemberBorrowSummary(req.params.memberId);
    res.status(200).json(borrowSummary);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function activeMembersController(req, res) {
  try {
    const members = await activeMembers();
    res.status(200).json(members);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function editMemberController(req, res) {
  try {
    const member = await editMember(req.params.id, req.body);
    res.status(200).json(member);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
