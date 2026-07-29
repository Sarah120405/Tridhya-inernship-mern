import { NextResponse } from "next/server";
import { getComments, addComment } from "@/lib/commentsDb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return NextResponse.json(
      { error: "postSlug is required" },
      { status: 400 },
    );
  }

  return NextResponse.json(getComments(postSlug));
}

export async function POST(request) {
  const body = await request.json();

  if (!body.postSlug || !body.author || !body.text) {
    return NextResponse.json(
      { error: "postSlug, author, and text are required" },
      { status: 400 },
    );
  }

  const comment = addComment(body.postSlug, body.author, body.text);
  return NextResponse.json(comment, { status: 201 });
}
