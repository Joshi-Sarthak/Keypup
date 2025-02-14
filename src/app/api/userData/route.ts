import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils"; // Import Prisma client
import { getUser } from "@/lib/getUser";
import { User as typeUser } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        const { email } = (await getUser()) as typeUser;
        console.log(email);

        if (!email) {
            return NextResponse.json({ success: false, error: "User email not found" }, { status: 400 });
        }

        // Fetch user from Prisma instead of Mongoose
        const user = await prisma.user.findUnique({
            where: { email },
            select: { name: true, password: true }, // Select only needed fields
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Failed to get user data" }, { status: 500 });
    }
}
