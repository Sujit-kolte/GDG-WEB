import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Member } from "@/models/Member";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
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
