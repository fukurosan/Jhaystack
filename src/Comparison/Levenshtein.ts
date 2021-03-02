/**
 * Determines a score based on the Levenshtein distance between two strings.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} threshold - Threshold for what is considered a match
 * @return {number} - Resulting score
 */
export const LEVENSHTEIN = (term: unknown, context: unknown, threshold = 0.2): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (!term || !context) {
		return 0
	}
	if (term === context) {
		return 1
	}
	let row: number[] = []
	let lastRow = []
	for (let i = 0; i <= term.length; i++) {
		lastRow[i] = i
	}
	for (let i = 1; i <= context.length; i++) {
		row = [i]
		for (let j = 1; j <= context.length; j++) {
			row[j] = term[i - 1] === context[j - 1] ? lastRow[j - 1] : Math.min(lastRow[j - 1], lastRow[j], row[j - 1]) + 1
		}
		lastRow = row
	}
	const score = 1 - row[context.length] / Math.max(term.length, context.length)
	return score > threshold ? score : 0
}
