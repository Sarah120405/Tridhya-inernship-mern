import { NextResponse } from "next/server";
import { getTodos, addTodo } from "@/lib/db";

export async function GET() {
  const todos = getTodos();
  return NextResponse.json(todos);
}

export async function POST(request) {
  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const newTodo = addTodo(body.title);
  return NextResponse.json(newTodo, { status: 201 });
}
