import { nGram } from "../Utility/ngram"

/**
 * Calculates a score based on the number of non-intersecting ngram vectors in two strings.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} containsSearch - If true the score will be based on the substring character count relative to the length of the term, rather than both the length of the term and context. (default false)
 * @param {number} q - The size of the ngrams vectors in characters
 * @param {number} threshold - Threshold for what is considered a match
 * @return {number} - Resulting score
 */
export const QGRAM = (term: unknown, context: unknown, q = 3, containsSearch = false, threshold = 0.2): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (term.length < q || context.length < q) {
		return 0
	}
	if (term === context) {
		return 1
	}
	const termGrams = nGram(term, q)
	const contextGrams = nGram(context, q)
	let intersection = 0
	termGrams.forEach(gram => {
		contextGrams.has(gram) && intersection++
	})
	let score
	if (containsSearch) {
		score = intersection / termGrams.size
	} else {
		score = (intersection * 2) / (termGrams.size + contextGrams.size)
	}
	return score > threshold ? score : 0
}
QGRAM._jhaystack = {
	dependencies: { nGram }
}