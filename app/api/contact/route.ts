import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Configure the transporter
        // NOTE: These environment variables must be set in .env.local
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: "sharafhazem123@gmail.com",
            subject: `New Work Queue Request from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
            html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #020617; color: white;">
          <h2 style="color: #22d3ee; border-bottom: 2px solid #22d3ee; padding-bottom: 10px;">NEURAL LINK TRANSMISSION</h2>
          <p><strong>OPERATOR NAME:</strong> ${name}</p>
          <p><strong>COMMS FREQUENCY:</strong> ${email}</p>
          <div style="background-color: #0a1128; padding: 15px; border-radius: 8px; border: 1px solid #1e293b; margin-top: 20px;">
            <p style="text-transform: uppercase; color: #64748b; font-size: 10px; letter-spacing: 2px;">Mission Briefing:</p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 30px; color: #475569; font-size: 12px; font-style: italic;">System Status: Operational</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Transmission received." });
    } catch (error: any) {
        console.error("Email transmission error:", error);
        return NextResponse.json({ success: false, error: error.message || "Uplink failure." }, { status: 500 });
    }
}
