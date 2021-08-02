import ITokenizerResultMap from "../Model/ITokenizerResult"

/**
 * Tokenizes input strings as words separated by space, or a selection of characters passed as arguments.
 * @param {unknown} value - The value to be tokenized
 * @param {string} separator - Optional separator
 * @return {Map<string, ITokenizerResult>} - Resulting tokens
 */
export const WORD = (value: unknown, separator?: string): ITokenizerResultMap => {
	if (typeof value !== "string") {
		return {}
	}
	let point = 0
	return value.split(separator ? separator : " ").reduce((acc: ITokenizerResultMap, value, i) => {
		if (!acc[value]) {
			acc[value] = []
		}
		const token = acc[value]
		token.push({
			offsetStart: point,
			offsetEnd: point + value.length - 1,
			position: i
		})
		point = point + value.length + 1
		return acc
	}, {})
}
