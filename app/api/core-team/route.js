import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CoreTeam } from "@/models/Member";

// ✅ Force Vercel to always fetch fresh data
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const members = await CoreTeam.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, data: members },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Mapping different possible field names to an array for the schema
    const imagesArray = Array.isArray(body.images)
      ? body.images
      : body.image
        ? [body.image]
        : body.photo
          ? [body.photo]
          : [];

    const membersListValue = body.membersList || body.members || "";

    if (!body.title || !membersListValue) {
      return NextResponse.json(
        { success: false, error: "Title and members list are required" },
        { status: 400 },
      );
    }

    if (imagesArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload at least 1 image" },
        { status: 400 },
      );
    }

    const newCoreTeam = await CoreTeam.create({
      title: body.title,
      subtitle: body.subtitle || "",
      membersList: membersListValue,
      image: imagesArray,
    });

    return NextResponse.json(
      { success: true, data: newCoreTeam },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST CORE TEAM ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
