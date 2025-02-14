import { NextRequest, NextResponse } from "next/server"
import otpGenerator from "otp-generator"
import { prisma } from "@/lib/utils"
import { sendMail } from "@/lib/sendMail"

export async function POST(req: NextRequest) {
	const { email } = await req.json()

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 })
	}

	// Generate a 6-digit numeric OTP
	const otp = otpGenerator.generate(6, {
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	})

	const expiry = new Date()
	expiry.setMinutes(expiry.getMinutes() + 10) // OTP expires in 10 minutes

	try {
		// Upsert OTP record in the database
		await prisma.oTP.upsert({
			where: { email }, // ✅ Correct way to use a unique field
			update: { otp, expiry, attempts: 0 },
			create: { email, otp, expiry, attempts: 0 },
		})

		// Send the OTP email
		await sendMail(email, otp)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error("Error sending OTP:", error)
		return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
	}
}
