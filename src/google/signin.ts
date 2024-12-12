"use server"
import {signIn} from "@/auth"

const googleSignin = async () => {
    console.log("google")
	await signIn("google")
}

export default googleSignin
