import ITokenizerResultMap from "../Model/ITokenizerResult"

/**
 * Tokenizes input strings as words separated by space, or a selection of characters passed as arguments.
 * Also adds tokens as shingles by a count provided (i.e. "New York" -> ["New", "New York", "York"]).
 * You can configure the tokenizer to only return the actual shingles,
 * @param {unknown} value - The value to be tokenized
 * @param {number} n - Number of shingles
 * @param {string} onlyIncludeShingles - Should only shingles be included?
 * @param {string} separator - Optional separator
 * @return {Map<string, ITokenizerResult>} - Resulting tokens
 */
export const SHINGLE = (value: unknown, n = 2, onlyIncludeShingles = false, separator?: string): ITokenizerResultMap => {
	if (typeof value !== "string" || n < 2) {
		return {}
	}
	let point = 0
	const tokens = value.split(separator ? separator : " ")
	return tokens.reduce((acc: ITokenizerResultMap, value, i) => {
		shingleTraversal: for (let shingleLength = 0; shingleLength < n; shingleLength++) {
			const length = shingleLength + 1
			if (length === 1 && onlyIncludeShingles) {
				continue shingleTraversal
			}
			if (tokens.length >= i + length) {
				let shingle: string | string[] = []
				for (let j = 0; j < length; j++) {
					shingle.push(tokens[i + j])
				}
				shingle = shingle.join(" ")
				if (!acc[shingle]) {
					acc[shingle] = []
				}
				const token = acc[shingle]
				token.push({
					offsetStart: point,
					offsetEnd: point + shingle.length - 1,
					position: i
				})
			} else {
				break shingleTraversal
			}
		}
		point = point + value.length + 1
		return acc
	}, {})
}
