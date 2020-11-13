/**
 * Checks if all words in the term exist within the context.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export const CONTAINS_ALL_WORDS = (term: unknown, context: unknown, caseSensitive = true): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	let found = 0
	const termWords = (caseSensitive ? term : term.toUpperCase()).split(" ")
	const contextWords = new Set((caseSensitive ? context : context.toUpperCase()).split(" "))
	termWords.forEach(termWord => {
		if (contextWords.has(termWord)) {
			found++
		}
	})
	return found === termWords.length ? 1 : 0
}
