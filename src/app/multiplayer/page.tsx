import { auth } from "@/auth"
import Room from "@/components/Room/Room"
import { redirect } from "next/navigation"
import React from "react"

const Page = async () => {
	const session = await auth()
	if (!session?.user) redirect("/login")
	return <Room />
}

export default Page
