import { io } from "socket.io-client"

export const socket = io("https://keypupsockets.onrender.com", { autoConnect: false })
