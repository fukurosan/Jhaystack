import { ObjectLiteral } from "../Utility/JsonUtility"

/**
 * Determines a score based on the full Damerau-Levenshtein distance between two strings.
 * Based on the algorithm posted on: http://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} threshold - Threshold for what is considered a match
 * @return {number} - Resulting score
 */
export const DAMERAU = (term: unknown, context: unknown, threshold = 0.3): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (!term || !context) {
		return 0
	}
	if (term === context) {
		return 1
	}
	const score = []
	for (let i = 0; i < term.length + 2; i++) {
		score.push(new Array(context.length + 2))
	}
	const maxDistance = term.length + context.length
	score[0][0] = maxDistance
	const da: ObjectLiteral = {}
	for (let i = 0; i <= term.length; i++) {
		score[i + 1][0] = maxDistance
		score[i + 1][1] = i
		if (!da[term[i]]) {
			da[term[i]] = 0
		}
	}
	for (let j = 0; j <= context.length; j++) {
		score[0][j + 1] = maxDistance
		score[1][j + 1] = j
		if (!da[context[j]]) {
			da[context[j]] = 0
		}
	}
	for (let i = 1; i <= term.length; i++) {
		let db = 0
		for (let j = 1; j <= context.length; j++) {
			const it = da[context[j - 1]]
			const jt = db
			let cost
			if (term[i - 1] === context[j - 1]) {
				cost = 0
				db = j
			} else {
				cost = 1
			}
			score[i + 1][j + 1] = Math.min(
				score[i][j] + cost, //Substitution
				score[i + 1][j] + 1, //Insertion
				score[i][j + 1] + 1, //Deletion
				score[it] ? score[it][jt] + (i - it - 1) + 1 + (j - jt - 1) : Infinity //Transposition
			)
		}
		da[term[i - 1]] = i
	}
	const result = 1 - score[term.length + 1][context.length + 1] / Math.max(term.length, context.length)
	return result > threshold ? result : 0
}
