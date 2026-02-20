import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Member } from "@/models/Member";

export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: members });
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

    // ✅ Accept image from photo OR image OR images[]
    const imagesArray = Array.isArray(body.images)
      ? body.images
      : body.photo
        ? [body.photo]
        : body.image
          ? [body.image]
          : [];

    if (!body.name || !body.domain || !body.tier) {
      return NextResponse.json(
        { success: false, error: "Name, domain and tier are required" },
        { status: 400 },
      );
    }

    if (imagesArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload 1 image" },
        { status: 400 },
      );
    }

    const newMember = await Member.create({
      name: body.name,
      domain: body.domain,
      tier: body.tier,
      linkedin: body.linkedin || "",
      github: body.github || "",
      image: imagesArray, // ✅ MUST be array
    });

    return NextResponse.json(
      { success: true, data: newMember },
      { status: 201 },
    );
  } catch (err) {
    console.log("POST MEMBER ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
