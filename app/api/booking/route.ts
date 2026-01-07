import { NextResponse } from 'next/server';
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            alias,
            email,
            discord,
            twitter,
            preferredChannel,
            projectCategory,
            budget,
            timeline,
            missionBrief,
            planName,
            planLevel
        } = body;

        // --- DISCORD NOTIFICATION ---
        const WEBHOOK_URL = "https://discord.com/api/webhooks/1457712952994955387/qkWNkXg5vrw2kdFnOlALkreSatSx1sk3vxuzAL-tzpvZpLb5oQic0mR4IkQnG9rDqmx-";
        const FORMSPREE_URL = "https://formspree.io/f/mdakbrrr";

        if (WEBHOOK_URL && !WEBHOOK_URL.includes("PASTE_YOUR_DISCORD")) {
            const discordPayload = {
                embeds: [
                    {
                        title: `🚀 New Mission Parameter: ${planName} (${planLevel})`,
                        color: 3447003,
                        fields: [
                            { name: "Client Alias", value: alias || "N/A", inline: true },
                            { name: "Preferred Channel", value: preferredChannel || "N/A", inline: true },
                            { name: "Email", value: email || "N/A", inline: false },
                            { name: "Discord", value: discord || "N/A", inline: true },
                            { name: "Twitter", value: twitter || "N/A", inline: true },
                            { name: "Project Category", value: projectCategory || "N/A", inline: false },
                            { name: "Allocated Budget", value: `${budget}€` || "N/A", inline: true },
                            { name: "Estimated Timeline", value: timeline || "N/A", inline: true },
                            { name: "Mission Brief", value: missionBrief || "N/A", inline: false },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: "Portfolio Ops Center // Transmission Received",
                        }
                    },
                ],
            };

            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload),
            }).catch(err => console.error("Discord Webhook Error:", err));
        }

        // --- EMAIL NOTIFICATION ---
        if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
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
                subject: `🚀 New Booking Request: ${planName} from ${alias}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; background-color: #020617; color: white; border-radius: 12px; border: 1px solid #1e293b;">
                        <h2 style="color: #22d3ee; border-bottom: 2px solid #22d3ee; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">NEURAL LINK: NEW MISSION</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">PLAN:</strong> ${planName} (${planLevel})</p>
                            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">CLIENT:</strong> ${alias}</p>
                            <p style="margin: 5px 0;"><strong style="color: #22d3ee;">PREFERENCE:</strong> ${preferredChannel}</p>
                        </div>

                        <div style="background-color: #0a1128; padding: 15px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 20px;">
                            <p style="text-transform: uppercase; color: #64748b; font-size: 10px; letter-spacing: 2px; margin-bottom: 10px;">Transmission Details:</p>
                            <table style="width: 100%; border-collapse: collapse; color: #cbd5e1; font-size: 14px;">
                                <tr><td style="padding: 4px 0; width: 40%;"><strong>Email:</strong></td><td>${email || "N/A"}</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Discord:</strong></td><td>${discord || "N/A"}</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Twitter:</strong></td><td>${twitter || "N/A"}</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Category:</strong></td><td>${projectCategory || "N/A"}</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Budget:</strong></td><td>${budget}€</td></tr>
                                <tr><td style="padding: 4px 0;"><strong>Timeline:</strong></td><td>${timeline || "N/A"}</td></tr>
                            </table>
                        </div>

                        <div style="background-color: #0a1128; padding: 15px; border-radius: 8px; border: 1px solid #1e293b;">
                            <p style="text-transform: uppercase; color: #64748b; font-size: 10px; letter-spacing: 2px; margin-bottom: 10px;">Mission Brief:</p>
                            <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${missionBrief || "No details provided."}</p>
                        </div>

                        <p style="margin-top: 30px; color: #475569; font-size: 12px; font-style: italic; border-top: 1px solid #1e293b; pt-10">System Status: Mission Logged via Portfolio Ops Center</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions).catch(err => console.error("Nodemailer Error:", err));
        }

        // --- FORMSPREE NOTIFICATION ---
        if (FORMSPREE_URL) {
            await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(body),
            }).catch(err => console.error("Formspree Error:", err));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

