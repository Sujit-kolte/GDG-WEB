import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/EventMe";

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find().sort({ year: -1, month: -1, day: -1 });
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate images exist and are full URLs
    const imagesArray = Array.isArray(body.images) ? body.images : [];
    if (imagesArray.length === 0 || !imagesArray[0].startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "Valid Cloudinary image required" },
        { status: 400 },
      );
    }

    const event = await Event.create({
      ...body,
      images: imagesArray,
      day: Number(body.day),
      year: Number(body.year),
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
