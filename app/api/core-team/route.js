import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CoreTeam } from "@/models/Member";

// GET all core team groups
export async function GET() {
  try {
    await dbConnect();
    const members = await CoreTeam.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: members });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// POST create core team group
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // ✅ Accept image from: images / image / photo
    const imagesArray = Array.isArray(body.images)
      ? body.images
      : body.image
      ? [body.image]
      : body.photo
      ? [body.photo]
      : [];

    // ✅ Accept membersList from: membersList / members
    const membersListValue = body.membersList || body.members || "";

    // ✅ Validation
    if (!body.title || !membersListValue) {
      return NextResponse.json(
        { success: false, error: "Title and members list are required" },
        { status: 400 }
      );
    }

    if (imagesArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload at least 1 image" },
        { status: 400 }
      );
    }

    const newCoreTeam = await CoreTeam.create({
      title: body.title,
      subtitle: body.subtitle || "",
      membersList: membersListValue,
      image: imagesArray, // ✅ MUST be array because schema is [String]
    });

    return NextResponse.json(
      { success: true, data: newCoreTeam },
      { status: 201 }
    );
  } catch (err) {
    console.log("POST CORE TEAM ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
