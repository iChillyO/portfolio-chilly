import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: "Username already taken" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role: 'user', // Default role
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            userId: newUser._id
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
