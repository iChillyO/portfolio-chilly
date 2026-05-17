import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SkillCategory from '@/models/SkillCategory';

export const dynamic = 'force-dynamic';

// Default seed data (used if DB is empty or unreachable)
const defaultCategories = [
  {
    title: "Frontend",
    icon: "FaCode",
    iconColor: "text-cerulean",
    description: "Beautiful, responsive interfaces",
    order: 0,
    visible: true,
    skills: [
      { name: "React", icon: "FaReact", level: "Expert", color: "text-sky-400", order: 0 },
      { name: "Next.js", icon: "SiNextdotjs", level: "Expert", color: "text-pearl", order: 1 },
      { name: "TypeScript", icon: "SiTypescript", level: "Advanced", color: "text-blue-400", order: 2 },
      { name: "Tailwind CSS", icon: "SiTailwindcss", level: "Expert", color: "text-sky-400", order: 3 },
    ],
  },
  {
    title: "Backend",
    icon: "FaServer",
    iconColor: "text-gold",
    description: "Scalable server-side solutions",
    order: 1,
    visible: true,
    skills: [
      { name: "Node.js", icon: "FaNodeJs", level: "Advanced", color: "text-green-400", order: 0 },
      { name: "Python", icon: "FaPython", level: "Intermediate", color: "text-yellow-400", order: 1 },
      { name: "GraphQL", icon: "SiGraphql", level: "Advanced", color: "text-pink-400", order: 2 },
      { name: "REST APIs", icon: "FaServer", level: "Expert", color: "text-orange-400", order: 3 },
    ],
  },
  {
    title: "Database",
    icon: "FaDatabase",
    iconColor: "text-lilac",
    description: "Data modeling and management",
    order: 2,
    visible: true,
    skills: [
      { name: "MongoDB", icon: "SiMongodb", level: "Expert", color: "text-green-500", order: 0 },
      { name: "PostgreSQL", icon: "SiPostgresql", level: "Advanced", color: "text-blue-300", order: 1 },
      { name: "Firebase", icon: "SiFirebase", level: "Advanced", color: "text-amber-400", order: 2 },
    ],
  },
  {
    title: "DevOps",
    icon: "FaTools",
    iconColor: "text-green-400",
    description: "Shipping code efficiently",
    order: 3,
    visible: true,
    skills: [
      { name: "Git", icon: "FaGitAlt", level: "Expert", color: "text-orange-500", order: 0 },
      { name: "Docker", icon: "FaDocker", level: "Intermediate", color: "text-blue-400", order: 1 },
      { name: "Vercel", icon: "SiVercel", level: "Expert", color: "text-pearl", order: 2 },
    ],
  },
  {
    title: "Design",
    icon: "FaPalette",
    iconColor: "text-pink-400",
    description: "Concept to pixel-perfect",
    order: 4,
    visible: true,
    skills: [
      { name: "Figma", icon: "FaFigma", level: "Advanced", color: "text-purple-400", order: 0 },
      { name: "Photoshop", icon: "SiAdobephotoshop", level: "Advanced", color: "text-blue-500", order: 1 },
      { name: "Blender", icon: "SiBlender", level: "Learning", color: "text-orange-400", order: 2 },
    ],
  },
  {
    title: "Mobile",
    icon: "FaMobileAlt",
    iconColor: "text-cerulean",
    description: "Cross-platform apps",
    order: 5,
    visible: true,
    skills: [
      { name: "React Native", icon: "FaReact", level: "Intermediate", color: "text-cyan-400", order: 0 },
    ],
  },
];

// GET: Fetch all skill categories (sorted by order)
export async function GET() {
  try {
    await dbConnect();
    let categories = await SkillCategory.find({}).sort({ order: 1 });

    // Seed default data if empty
    if (categories.length === 0) {
      categories = await SkillCategory.insertMany(defaultCategories);
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("GET /api/skills error:", msg);
    // Fallback to defaults if DB fails
    return NextResponse.json({ success: true, data: defaultCategories, isFallback: true });
  }
}

// POST: Create a new skill category
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Auto-set order to end
    const count = await SkillCategory.countDocuments();
    const newCategory = await SkillCategory.create({
      ...body,
      order: body.order ?? count,
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("POST /api/skills error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PUT: Update an existing skill category (by _id in body)
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "Missing _id" }, { status: 400 });
    }

    const updated = await SkillCategory.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("PUT /api/skills error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Remove a skill category (by ?id= query param)
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id param" }, { status: 400 });
    }

    const deleted = await SkillCategory.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DELETE /api/skills error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
