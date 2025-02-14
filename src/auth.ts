import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./lib/utils" // Ensure correct import

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			authorize: async (credentials) => {
				const email = credentials?.email as string
				const password = credentials?.password as string

				if (!email || !password) {
					throw new CredentialsSignin({ cause: "Please provide both email and password" })
				}

				const user = await prisma.user.findUnique({
					where: { email },
				})

				if (!user || !user.password) {
					throw new CredentialsSignin({ cause: "Invalid Credentials" })
				}

				const isMatch = await compare(password, user.password)

				if (!isMatch) {
					throw new CredentialsSignin({ cause: "Invalid Credentials" })
				}

				return { id: user.id, name: user.name, email: user.email }
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			if (account?.provider === "google") {
				try {
					const { email, name, image, id } = user

					const alreadyUser = await prisma.user.findUnique({ where: { email: email! } })

					if (!alreadyUser) {
						await prisma.user.create({
							data: { email: email!, name: name!, image: image!, googleId: id! },
						})
					}

					return true
				} catch (error) {
					throw new AuthError("Error while creating user")
				}
			} else if (account?.provider === "credentials") {
				return true
			}
			return false
		},
	},
})
