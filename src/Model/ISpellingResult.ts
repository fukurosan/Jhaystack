interface ISpellingCorrection {
	word: string
	suggestion: string
}

export interface ISpellingResult {
	result: string
	corrections: ISpellingCorrection[]
}
