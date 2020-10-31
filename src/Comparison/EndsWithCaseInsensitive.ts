/**
 * Checks if the context ends with the term (not case sensitive!).
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown): number => {
	return `${context}`.toUpperCase().endsWith(`${term}`.toUpperCase()) ? 1 : 0
}
