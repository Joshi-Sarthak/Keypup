import { multiplayerResults, result } from "@/lib/types/types"
import React from "react"

interface ProfileComponentProps {
	data: result[] | multiplayerResults
	type: "multiplayer" | "all" | "recent"
	heading: string
}

function isResultArray(data: result[] | multiplayerResults): data is result[] {
	return Array.isArray(data)
}

function findDetails(data: result[], toFind: string): number | null {
	for (let i = 0; i < data.length; i++) {
		if (data[i].subType === toFind) {
			return data[i].wpm
		}
	}
	return null
}

function ProfileComponent({ data, type, heading }: ProfileComponentProps) {
	return (
		<div className="w-full">
			<h2 className="text-2xl tracking-widest text-stone-500 dark:text-neutral-500 text-center mt-4 mb-2">
				{heading}
			</h2>
			<div className="w-11/12 bg-neutral-300 dark:bg-stone-900 flex flex-row justify-between px-12 py-4 mx-10 rounded-2xl border border-neutral-400 dark:border-stone-950">
				{heading === "Recents" &&
					Array.from({ length: 5 }).map((_, index) => {
						return (
							<div key={index}>
								<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
									{isResultArray(data) && data[index] ? (
										<>
											{data[index].type}-{data[index].subType}
										</>
									) : (
										<>game {index + 1}</>
									)}
								</div>
								<div className="text-center font-medium text-purple-700 tracking-wider">
									{isResultArray(data) && data[index] ? (
										<>{data[index].wpm} wpm</>
									) : (
										<>--</>
									)}
								</div>
							</div>
						)
					})}
				{heading === "Multiplayer" && (
					<>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								wins
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{!isResultArray(data) ? <>{data.wins}</> : <>0</>}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								losses
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{!isResultArray(data) ? <>{data.losses}</> : <>0</>}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								avg wpm
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{!isResultArray(data) && data.averageWPM !== 0 ? (
									<>{data.averageWPM}</>
								) : (
									<>--</>
								)}
							</div>
						</div>
					</>
				)}
				{heading === "Time" && (
					<>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								15s
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "15")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								30s
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "30")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								60s
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "60")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								120s
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "120")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
					</>
				)}
				{heading === "Words" && (
					<>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								10
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "10")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								25
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "25")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								50
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "50")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								100
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) && findDetails(data, "100")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
					</>
				)}
				{heading === "Quotes" && (
					<>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								small
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) &&
										findDetails(data, "small")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								medium
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) &&
										findDetails(data, "medium")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
						<div>
							<div className="text-stone-500 dark:text-neutral-500 tracking-wider font-medium text-center">
								large
							</div>
							<div className="text-center font-medium text-purple-700 tracking-wider">
								{(() => {
									const res =
										isResultArray(data) &&
										findDetails(data, "large")
									return res ? <>{res}</> : <>--</>
								})()}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ProfileComponent
