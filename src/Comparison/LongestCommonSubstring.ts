/**
 * Determines a score based on the longest common substring.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} containsSearch - If true the score will be based on the substring character count relative to the length of the term, rather than both the length of the term and context. (default false)
 * @param {unknown} threshold - Threshold for what is considered a match
 * @return {number} - Resulting score
 */
export const LONGEST_COMMON_SUBSTRING = (term: unknown, context: unknown, containsSearch = false, threshold = 0.3): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (!term || !context) {
		return 0
	}
	if (term === context) {
		return 1
	}

	const matrix = []
	for (let i = 0; i <= term.length; i++) {
		for (let j = 0; j <= context.length; j++) {
			matrix.push(new Array(context.length + 1).fill(0))
		}
	}
	let score = 0
	for (let i = 0; i <= term.length; i++) {
		for (let j = 0; j <= context.length; j++) {
			if (i === 0 || j === 0) {
				matrix[i][j] = 0
			} else if (term[i - 1] === context[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1] + 1
				score = Math.max(score, matrix[i][j])
			} else {
				matrix[i][j] = 0
			}
		}
	}
	if (containsSearch) {
		const result = score / term.length
		return result > threshold ? result : 0
	}
	const result = (score * 2) / (term.length + context.length)
	return result > threshold ? result : 0
}
