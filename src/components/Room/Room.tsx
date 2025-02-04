"use client"

import React, { useState } from "react"
import { socket } from "@/lib/sockets"
import { useRouter } from "next/navigation"
import { useMultiplayerstore } from "@/lib/zustand/multiplayerstore"

function Room({ name }: { name: string }) {
	const [roomCode, setRoomCode] = useState<string | null>(null)
	const [inputMessage, setInputMessage] = useState<string>("")
	const [error, setError] = useState<string>("")
	const router = useRouter()

	function generateRoomCode() {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		let result = ""
		for (let i = 0; i < 5; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length))
		}
		return result
	}

	function handleCreateRoom() {
		if (!socket.connected) {
			socket.connect()
			const GenroomCode = generateRoomCode()
			setRoomCode(GenroomCode)
			useMultiplayerstore.getState().setisHost(true)
			useMultiplayerstore.getState().setisInWaitingRoom(true)
			useMultiplayerstore.setState({ inResult: false })
			useMultiplayerstore.setState({ inGame: false })
			console.log("oshjd")
			socket.emit("create_room", GenroomCode, name)
			router.push(`/multiplayer/${GenroomCode}`)
		} else {
			console.log("Already connected!")
			socket.disconnect()
			socket.connect()
			const GenroomCode = generateRoomCode()
			setRoomCode(GenroomCode)
			useMultiplayerstore.getState().setisHost(true)
			useMultiplayerstore.getState().setisInWaitingRoom(true)
			useMultiplayerstore.setState({ inResult: false })
			useMultiplayerstore.setState({ inGame: false })
			console.log("oshjd")
			socket.emit("create_room", GenroomCode, name)
			router.push(`/multiplayer/${GenroomCode}`)
		}
	}

	function handleJoinRoom() {
		if (!socket.connected) {
			socket.connect()
			useMultiplayerstore.getState().setisInWaitingRoom(true)
			useMultiplayerstore.setState({ inResult: false })
			useMultiplayerstore.setState({ inGame: false })
			socket.emit("check_room", inputMessage)
			console.log("here")
			socket.on("room_exists", (data: boolean) => {
				if (data) {
					router.push(`/multiplayer/${inputMessage}`)
				} else {
					console.log("Room does not exist!")
					setError("Room does not exist!")
				}
			})
		} else {
			console.log("Already connected!")
			socket.disconnect()
			socket.connect()
			useMultiplayerstore.getState().setisInWaitingRoom(true)
			useMultiplayerstore.setState({ inResult: false })
			useMultiplayerstore.setState({ inGame: false })
			socket.emit("check_room", inputMessage)
			console.log("here2")
			socket.on("room_exists", (data: boolean) => {
				if (data) {
					router.push(`/multiplayer/${inputMessage}`)
				} else {
					console.log("Room does not exist!")
					setError("Room does not exist!")
				}
			})
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInputMessage(e.target.value)
	}

	return (
		<div className="w-full flex flex-row justify-center items-center">
			<div className="flex flex-col w-1/3 items-center h-96 mr-8">
				<h2 className="text-center tracking-widest text-3xl mb-4 text-stone-500 dark:text-neutral-500 mt-16">
					Create a Room
				</h2>
				<span className="text-stone-500 dark:text-neutral-400 text-lg tracking-widest text-center mt-4">
					Create a room and invite others to play with you
				</span>
				<div className="w-2/3 flex flex-row items-center">
					<div className="w-full text-stone-500 dark:text-neutral-400 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent text-center mt-8">
						Copy room code and share to play!
					</div>
				</div>
				<button
					className="font-medium text-stone-500 w-1/4 mt-8 py-2 rounded-2xl flex justify-center items-center tracking-wide bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
					onClick={handleCreateRoom}
				>
					Create room
				</button>
			</div>
			<div className="my-28 bg-stone-600 h-[400px] rounded-full border dark:border-stone-600 border-neutral-400"></div>
			<div className="flex flex-col w-1/3 items-center h-96">
				<h2 className="text-center tracking-widest text-3xl mb-4 text-stone-500 dark:text-neutral-500 mt-16">
					Join a room
				</h2>
				<span className="text-stone-500 dark:text-neutral-400 text-lg tracking-widest text-center mt-4">
					Join an existing room and start playing
				</span>
				<input
					type="text"
					className="w-2/3 text-stone-500 dark:text-neutral-300 font-thin tracking-wider px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500 bg-transparent mt-8"
					onChange={handleChange}
				/>
				{error && (
					<div className="w-2/3 text-red-500 font-thin tracking-wider mt-4 text-center">
						{error}
					</div>
				)}
				<button
					className="font-medium text-stone-500 w-1/4 mt-8 py-2 rounded-2xl flex justify-center items-center tracking-wide bg-transparent hover:dark:border-stone-400 border dark:border-stone-800 border-neutral-100 hover:border-stone-600 hover:text-stone-600 dark:text-neutral-500 hover:dark:text-neutral-100 transition-all duration-400"
					onClick={handleJoinRoom}
				>
					Join room
				</button>
			</div>
		</div>
	)
}

export default Room
