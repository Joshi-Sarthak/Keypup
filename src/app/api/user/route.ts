import {getUser} from "@/lib/getUser"
import {connectToDatabase} from "@/lib/utils"
import {User} from "@/models/userModel"
import {User as Usertype} from "next-auth"
import {NextRequest, NextResponse} from "next/server"

export async function GET(req: NextRequest) {
	try {
		await connectToDatabase()

		const {email} = (await getUser()) as Usertype

		const user = await User.findOne({email})

		return NextResponse.json({name:user.name})
	} catch (error) {
		console.error("Error :", error)
		return NextResponse.json({error: "Failed to get user"}, {status: 500})
	}
}
