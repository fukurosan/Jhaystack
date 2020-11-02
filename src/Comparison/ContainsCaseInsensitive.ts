/**
 * Checks if the context contains the term (not case sensitive!).
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown): number => {
	return `${context}`.toUpperCase().indexOf(`${term}`.toUpperCase()) > -1 ? 1 : 0
}
