import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Load your identity
export async function GET() {
  const defaultProfile = {
    alias: "Chilly",
    designation: "Software Engineer",
    bioLong: "My name is Sharaf Hazem, and I am a software engineering student with experience in web development and a passion for learning new technologies in Gaza, aged 20. I convert ideas into well-designed digital products using JavaScript, React, React Native, TypeScript, Next.js, and PHP programming languages.",
    avatar: "/images/home avatar.png",
    aboutImage: "/images/about avatar.png",
    missionBriefing: "I am a creative Software Engineer with a passion for building immersive digital experiences. My journey began with a curiosity for how things work, which quickly evolved into an obsession with clean code and futuristic UI design.\n\nWhen I'm not coding, I'm exploring new tech, designing 3D assets, or leveling up in the latest RPGs.",
    experienceLog: [
      { title: "Senior Developer", type: "Tech Corp", desc: "Leading frontend architecture and 3D web implementations." },
      { title: "Web Designer", type: "Creative Studio", desc: "Designed and developed award-winning portfolio sites." },
      { title: "Freelancer", type: "Self-Employed", desc: "Full-stack development for international clients." }
    ],
  };

  try {
    await dbConnect();
    let profile = await Profile.findOne({});
    
    // If no profile exists yet in the DB, create/use default
    if (!profile) {
      try {
        profile = await Profile.create(defaultProfile);
      } catch (createError) {
        console.error("Failed to create initial profile, using static:", createError);
        profile = defaultProfile;
      }
    }
    
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    // REGIONAL OUTAGE FALLBACK:
    // If DB connection fails (e.g. AWS Middle East outage), 
    // return the default static profile so the website still loads.
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Database connection failed, using static fallback. Error:", errorMessage);
    
    return NextResponse.json({ 
      success: true, 
      data: defaultProfile,
      isFallback: true,
      error: errorMessage,
      info: "Regional database outage detected. Using local cache." 
    }, { status: 200 }); // Explicitly return 200 to avoid console noise
  }
}

// PUT: Update your identity
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Update the ONE profile that exists (upsert: true creates it if missing)
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, 
      { ...body, lastSync: new Date() }, 
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in PUT /api/profile:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}