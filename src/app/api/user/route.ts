import { getUser } from "@/lib/getUser"
import { prisma } from "@/lib/utils" // Prisma client import
import { User as Usertype } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		const { email } = (await getUser()) as Usertype

		if (!email) {
			return NextResponse.json({ error: "User email not found" }, { status: 400 })
		}

		// Fetch user from Prisma instead of Mongoose
		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 })
		}

		return NextResponse.json(user)
	} catch (error) {
		console.error("Error:", error)
		return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
	}
}
