import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"

export async function POST(req: NextRequest) {
	const { email, otp } = await req.json()

	if (!email || !otp) {
		return NextResponse.json(
			{ error: "Email and OTP are required" },
			{ status: 400 }
		)
	}

	try {
		const otpRecord = await prisma.oTP.findUnique({
			where: { email }, // Ensure email is unique in Prisma schema
		})

		if (!otpRecord) {
			return NextResponse.json(
				{ success: false, error: "OTP not found" },
				{ status: 400 }
			)
		}

		const { expiry, attempts } = otpRecord

		if (new Date() > expiry!) {
			return NextResponse.json(
				{ success: false, error: "OTP expired" },
				{ status: 400 }
			)
		}

		if (attempts! >= 3) {
			return NextResponse.json(
				{ success: false, error: "OTP verification attempts exceeded" },
				{ status: 400 }
			)
		}

		if (otpRecord.otp === otp) {
			// ✅ Delete OTP record after successful verification
			await prisma.oTP.delete({
				where: { email },
			})
			return NextResponse.json({ success: true })
		} else {
			// ✅ Increment attempts if OTP is incorrect
			await prisma.oTP.update({
				where: { email },
				data: { attempts: { increment: 1 } },
			})
			return NextResponse.json(
				{ success: false, error: "Invalid OTP" },
				{ status: 400 }
			)
		}
	} catch (error) {
		console.error("Error verifying OTP:", error)
		return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
	}
}
