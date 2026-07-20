import { NextResponse } from "next/server";
import { deleteTodo, updateTodo } from "@/lib/db";

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  if (!body.title && body.done === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updatedTodo = updateTodo(Number(id), body);

  if (!updatedTodo) {
    return NextResponse.json({ error: "Todo not fount" }, { status: 400 });
  }
  return NextResponse.json(updatedTodo, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const deletedTodo = deleteTodo(Number(id));
  if (!deletedTodo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  return NextResponse.json(deletedTodo, { status: 200 });
}
