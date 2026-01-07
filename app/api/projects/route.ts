import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';

// 1. GET: Fetch all projects from the database
export async function GET() {
  await dbConnect();
  try {
    // Sort by 'createdAt' so the newest ones appear first (-1)
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();

    // Map legacy 'image' to 'images' array if needed
    const mappedProjects = projects.map((p: any) => ({
      ...p,
      images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
    }));

    return NextResponse.json({ success: true, data: mappedProjects });
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


// 3. PUT: Update a project
export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const updatedProject = await Project.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

// 4. DELETE: Remove a project by ID
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