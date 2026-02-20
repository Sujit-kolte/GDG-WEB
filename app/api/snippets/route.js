import { NextResponse } from "next/server"; // ✅ Added missing import
import dbConnect from "@/lib/db";
import { Snippet } from "@/models/Snippet";

export async function GET() {
  try {
    await dbConnect();
    const snippets = await Snippet.find().sort({ _id: -1 }).lean();

    // Using NextResponse for consistency across methods
    return NextResponse.json({ success: true, data: snippets });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch snippets" },
      { status: 500 },
    );
  }
}

// POST create snippet
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation to prevent saving empty data
    if (!body.title || !body.code) {
      return NextResponse.json(
        { success: false, error: "Title and Code are required" },
        { status: 400 },
      );
    }

    const snippet = await Snippet.create({
      title: body.title,
      code: body.code,
    });

    return NextResponse.json({ success: true, data: snippet }, { status: 201 });
  } catch (error) {
    console.error("POST snippet error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create snippet" },
      { status: 500 },
    );
  }
}
