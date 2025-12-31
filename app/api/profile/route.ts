import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

// GET: Load your identity
export async function GET() {
  await dbConnect();
  try {
    let profile = await Profile.findOne({});
    
    // If no profile exists yet, create a default one with the original static data
    if (!profile) {
      const defaultProfile = {
        alias: "Chilly",
        designation: "Software Engineer",
        bioLong: "My name is Sharaf Hazem, and I am a software engineering student with experience in web development and a passion for learning new technologies in Gaza, aged 20. I convert ideas into well-designed digital products using JavaScript, React, React Native, TypeScript, Next.js, and PHP programming languages.",
        avatar: "/images/lucial-avatar1.png",
        aboutImage: "/images/lucial-avatar1.png",
        missionBriefing: "I am a creative Software Engineer with a passion for building immersive digital experiences. My journey began with a curiosity for how things work, which quickly evolved into an obsession with clean code and futuristic UI design.\n\nWhen I'm not coding, I'm exploring new tech, designing 3D assets, or leveling up in the latest RPGs.",
        experienceLog: [
          { title: "Senior Developer", type: "Tech Corp", desc: "Leading frontend architecture and 3D web implementations." },
          { title: "Web Designer", type: "Creative Studio", desc: "Designed and developed award-winning portfolio sites." },
          { title: "Freelancer", type: "Self-Employed", desc: "Full-stack development for international clients." }
        ],
      };
      profile = await Profile.create(defaultProfile);
    }
    
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    // A more specific error log
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// PUT: Update your identity
export async function PUT(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    
    // Update the ONE profile that exists (upsert: true creates it if missing)
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, 
      { ...body, lastSync: new Date() }, 
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    // A more specific error log
    console.error("Error in PUT /api/profile:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}