import ITokenizerResultMap from "../Model/ITokenizerResult"
import { edgeGram } from "../Utility/ngram"

/**
 * Tokenizes the input value based on a Set of edge grams (starts with grams).
 * @param {string} value - String to extract edge grams from
 * @param {number} n - Maximum number of grams to extract
 * @return {ITokenizerResultMap} - Resulting tokens
 */
export const EDGE_GRAM = (value: unknown, n = 10): ITokenizerResultMap => {
	if (typeof value !== "string") {
		return {}
	}
	const grams = edgeGram(value, n)
	const result: ITokenizerResultMap = {}
	for (const gram of grams.values()) {
		result[gram] = [
			{
				offsetStart: 0,
				offsetEnd: gram.length - 1,
				position: 0
			}
		]
	}
	return result
}
