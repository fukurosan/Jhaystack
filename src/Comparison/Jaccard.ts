/**
 * Determines a score based on the Jaccard distance between a given term and context
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} threshold - Threshold for what is considered a match
 * @param {boolean} n - How large grams should the input strings be split into?
 * @return {number} - Resulting score
 */
export const JACCARD = (term: unknown, context: unknown, threshold = 0.2, n = 3): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (term.length < n || context.length < n) {
		return 0
	}
	if (term === context) {
		return 1
	}

	const termGrams = new Set()
	const contextGrams = new Set()
	const grams = new Set()
	for (let i = 0; i < term.length - n; i++) {
		const gram = term.substr(i, n)
		grams.add(gram)
		termGrams.add(gram)
	}
	for (let i = 0; i < context.length - n; i++) {
		const gram = context.substr(i, n)
		grams.add(gram)
		contextGrams.add(gram)
	}

	let intersectionCount = 0
	grams.forEach(gram => {
		if (termGrams.has(gram) && contextGrams.has(gram)) {
			intersectionCount++
		}
	})
	const score = intersectionCount / grams.size
	return score > threshold ? score : 0
}
