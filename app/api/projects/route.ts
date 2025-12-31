import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

// 1. GET: Fetch all projects from the database
export async function GET() {
  await dbConnect();
  try {
    // Sort by 'createdAt' so the newest ones appear first (-1)
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// 2. POST: Add a new project to the database
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 400 });
  }
}


// 3. DELETE: Remove a project by ID
export async function DELETE(req: Request) {
  await dbConnect();
  try {
    // Get the ID from the URL (e.g., /api/projects?id=12345)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    // Delete from MongoDB
    await Project.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}