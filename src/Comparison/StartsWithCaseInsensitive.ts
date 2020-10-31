/**
 * Checks if the context starts with the term (case sensitive!).
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown): number => {
	return `${context}`.toUpperCase().startsWith(`${term}`.toUpperCase()) ? 1 : 0
}
