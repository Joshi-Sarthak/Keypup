import { useTestStore } from "../zustand/teststore"

const handleBackspace = (
	activeLetter: HTMLSpanElement | null,
	activeWord: HTMLDivElement | null
) => {
	const { typedWord, currWordIndex, setChar } = useTestStore.getState()

	if (typedWord.length > 0) {
		if (activeWord) {
			activeWord.classList.remove("correct", "wrong", "semiWrong")
		}
		// Remove the last character from the typedWord
		setChar(typedWord.slice(0, -1))

		if (activeLetter && activeLetter.parentElement) {
			const spanElements = activeLetter.parentElement.querySelectorAll("span")
			const lastSpan = spanElements[typedWord.length]
			if (lastSpan) {
				lastSpan.classList.remove("correct", "wrong", "semiWrong")
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
		activeLetter.classList.remove("correct", "wrong", "semiWrong")
	}
}

export const RecordTest = (
	key: string,
	activeLetter: HTMLSpanElement | null,
	activeWord: HTMLDivElement | null
) => {
	const setChar = useTestStore.getState().setChar
	const changeWord = useTestStore.getState().changeWord
	const typedWord = useTestStore.getState().typedWord
	const currWord = useTestStore.getState().currWord

	switch (key) {
		case "Backspace":
			handleBackspace(activeLetter, activeWord)
			break
		case " ":
			if (typedWord !== "") {
				if (activeWord && currWord !== typedWord) {
					activeWord?.classList.add("semiWrong")
				}
				changeWord()
			}
			break
		default:
			setChar(typedWord + key)
			break
	}
}
