import { findUser } from "@/actions/findUser"
import { auth } from "@/auth"
import WaitingRoom from "@/components/WaitingRoom/WaitingRoom"
import { redirect } from "next/navigation"
import React from "react"

async function page({ params }: { params: { id: string } }) {
	const session = await auth()
	if (!session?.user) redirect("/login")

	const email = session?.user.email
	const { name } = await findUser(email as string)

	const id = params.id
	return (
		<div>
			<WaitingRoom id={id} name={name} />
		</div>
	)
}

export default page
