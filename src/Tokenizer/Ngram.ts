import ITokenizerResultMap from "../Model/ITokenizerResult"
import { nGram } from "../Utility/ngram"

/**
 * Extracts n-grams from a string given certain input parameters.
 * If the minimum gram size is configured then the start and end of the term will be parsed
 * into edge grams equivalent to the difference between minGram and maxGram.
 * @param {unknown} value - String to extract grams from
 * @param {number} maxGram - Maximum size for the grams (default 3)
 * @param {number} minGram - Minimum size for the grams (default 3)
 * @param {boolean} captureSpace - If false all spaces will be removed before parsing (default true)
 * @param {boolean} captureStartEnd - If true the beginning and end of the term will be parsed as a custom character (default false)
 * @return {ITokenizerResultMap} - Resulting tokens
 */
export const NGRAM = (value: unknown, maxGram = 3, minGram = maxGram, captureSpace = true, captureStartEnd = false): ITokenizerResultMap => {
	if (typeof value !== "string") {
		return {}
	}
	const grams = nGram(value, maxGram, minGram, captureSpace, captureStartEnd)
	const result: ITokenizerResultMap = {}
	let lastGram
	let i = 0
	for (const gram of grams.values()) {
		if (lastGram && lastGram.length >= gram.length) {
			i++
		}
		if (!result[gram]) {
			result[gram] = []
		}
		const token = result[gram]
		token.push({
			offsetStart: i,
			offsetEnd: gram.length - 1,
			position: i
		})
		lastGram = gram
	}
	return result
}
