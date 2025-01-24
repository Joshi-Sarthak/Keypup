"use client"

import { useMultiplayerstore } from "@/lib/zustand/multiplayerstore"
import WaitingRoom from "../WaitingRoom/WaitingRoom"
import MultiplayerResults from "../MultiplayerResult/MultiplayerResults"
import MultiplayerMain from "../MultiplayerMain/MultiplayerMain"

function ClientPage({ id, name }: { id: string; name: string }) {
	const multiplayerState = useMultiplayerstore((state) => state)

	return (
		<div>
			{multiplayerState.inWaitingRoom && <WaitingRoom id={id} name={name} />}
			{multiplayerState.inGame && <MultiplayerMain />}
			{multiplayerState.inResult && <MultiplayerResults />}
		</div>
	)
}

export default ClientPage
