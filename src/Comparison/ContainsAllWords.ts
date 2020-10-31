/**
 * Checks if all words in the term exist within the context.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown): number => {
	let found = 0
	const termWords = `${term}`.toUpperCase().split(" ")
	const contextWords = `${context}`.toUpperCase().split(" ")
	termWords.forEach(termWord => {
		if (contextWords.indexOf(termWord) > -1) {
			found++
		}
	})
	return found === termWords.length ? 1 : 0
}
