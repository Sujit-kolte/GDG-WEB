import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/EventMe";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;  // ✅ IMPORTANT FIX

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.log("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
