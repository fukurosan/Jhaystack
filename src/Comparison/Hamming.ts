/**
 * Calculates the number of positions with same symbols in both strings/numbers.
 * This only works for strings/numbers of same length, and positive numbers.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} threshold - Threshold for what is considered a match
 * @return {number} - Resulting score
 */
export const HAMMING = (term: unknown, context: unknown, threshold = 0.2): number => {
	if (term === context) {
		return 1
	}
	if (typeof term === "string" && typeof context === "string" && term.length === context.length) {
		let result = 0
		for (let i = 0; i < term.length; i++) {
			if (term[i] !== context[i]) {
				result++
			}
		}
		const score = 1 - result / term.length
		return score > threshold ? score : 0
	} else if (typeof term === "number" && typeof context === "number") {
		let result = 0
		let temp = term ^ context
		while (temp > 0) {
			result += temp & 1
			temp >>= 1
		}
		return result === 0 ? 1 : result
	}
	return 0
}
