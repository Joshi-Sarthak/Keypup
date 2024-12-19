import { useTestStore } from "../store"

const handleBackspace = () => {}

export const RecordTest = (key: string) => {
	const setChar = useTestStore.getState().setChar
	const changeWord = useTestStore.getState().changeWord
	const typedWord = useTestStore.getState().typedWord

	switch (key) {
		case "Backspace":
			handleBackspace()
			break
		case " ":
			if (typedWord !== "") {
				changeWord()
			}
			break
		default:
			setChar(typedWord + key)
			break
	}
	console.log(useTestStore.getState())
}
