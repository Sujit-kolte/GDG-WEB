import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password, name } = await request.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }
    const admin = await Admin.create({
      email,
      password,
      name
    });

    return NextResponse.json(
      { message: 'Admin created successfully', admin: { id: admin._id, email: admin.email, name: admin.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

