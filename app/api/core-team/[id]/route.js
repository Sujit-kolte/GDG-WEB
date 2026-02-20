import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { CoreTeam } from "@/models/Member";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params; // ✅ IMPORTANT FIX

    const deletedCoreTeam = await CoreTeam.findByIdAndDelete(id);

    if (!deletedCoreTeam) {
      return NextResponse.json(
        { success: false, error: "Core Team not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
