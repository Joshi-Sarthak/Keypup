import {redirect} from "next/navigation"
import {auth} from "@/auth"
import {ProfileForm} from "@/components/client/ProfileForm"


const Page = async () => {
	const session = await auth()
	if (!session?.user) redirect("/login")
		
	const email= session?.user.email

	return <ProfileForm email={email as string}/>
}

export default Page
