"use client"

import Room from "@/components/Room/Room"
import React, { useEffect } from "react"
// import { socket as io } from "../../lib/socket"

const Page = () => {
	// useEffect(() => {
	// 	// Clean up socket connection when the component unmounts
	// 	return () => {
	// 		if (io.connected) {
	// 			io.disconnect()
	// 		}
	// 	}
	// }, [])

	// const handleClick = () => {
	// 	if (!io.connected) {
	// 		io.connect()
	// 		io.on("connect", () => {
	// 			console.log("Connected to the server with ID:", io.id)
	// 		})
	// 		io.on("disconnect", () => {
	// 			console.log("Disconnected from the server")
	// 		})
	// 	} else {
	// 		console.log("Already connected!")
	// 	}
	// }

	return <Room />
}

export default Page
