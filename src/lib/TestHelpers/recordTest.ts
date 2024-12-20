import { useTestStore } from "../store"

const handleBackspace = (activeLetter: HTMLSpanElement | null) => {
	const {
		typedWord,
		currWordIndex,
		setChar
	} = useTestStore.getState()

	if (typedWord.length > 0) {
		// Remove the last character from the typedWord
		setChar(typedWord.slice(0, -1))

		if (activeLetter && activeLetter.parentElement) {
			const spanElements = activeLetter.parentElement.querySelectorAll("span")
			const lastSpan = spanElements[typedWord.length]
			if (lastSpan) {
				lastSpan.classList.remove("correct", "wrong")
			}
		}
	} else if (currWordIndex > 0) {
		const prevWordIndex = currWordIndex - 1
		useTestStore.setState((state) => ({
			currWordIndex: prevWordIndex,
			typedWord: state.typedWords[prevWordIndex] || "",
			typedWords: state.typedWords.slice(0, -1),
			currWord: state.initialWords[prevWordIndex],
		}))
	}

	if (activeLetter) {
		activeLetter.classList.remove("correct", "wrong")
	}
}

export const RecordTest = (key: string, activeLetter: HTMLSpanElement | null) => {
	const setChar = useTestStore.getState().setChar
	const changeWord = useTestStore.getState().changeWord
	const typedWord = useTestStore.getState().typedWord

	switch (key) {
		case "Backspace":
			handleBackspace(activeLetter)
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
}
