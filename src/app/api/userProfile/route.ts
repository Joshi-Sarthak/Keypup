import { getUser } from "@/lib/getUser";
import { prisma } from "@/lib/utils"; // Prisma Client
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password, username } = await req.json();
        const user = await getUser();

        if (!user || email !== user.email) {
            return NextResponse.json(
                { error: "You can only update your profile" },
                { status: 403 }
            );
        }

        // Prepare update object
        const updateData: { name?: string; password?: string } = {};
        if (username && username !== user.name) updateData.name = username;
        if (password && password.trim() !== "") {
            updateData.password = await hash(password, 10);
        }

        // Update user in Prisma
        const updatedUser = await prisma.user.update({
            where: { email },
            data: updateData,
        });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update leaderboard records if username changed
        if (username && username !== user.name) {
          await prisma.topResult.updateMany({
            where: { email },  // ✅ Find all results linked to this user
            data: { playerName: username },  // ✅ Update playerName in TopResult
        });
        
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to Update Profile" }, { status: 500 });
    }
}
