"use server"
import { prisma } from "@/lib/utils"
import { hash } from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	const { email, password } = await req.json()

	try {
		// Hash the new password
		const hashedPassword = await hash(password, 10)

		// Update user password in Prisma
		const updatedUser = await prisma.user.update({
			where: { email },
			data: { password: hashedPassword },
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error changing password:", error)

		const errorMessage =
			error instanceof Error ? error.message : "Failed to change password"

		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
