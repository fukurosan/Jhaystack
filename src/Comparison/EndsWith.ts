/**
 * Checks if the context ends with the term (case sensitive!).
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown, caseSensitive = true): number => {
	return caseSensitive ? (`${context}`.endsWith(`${term}`) ? 1 : 0) : `${context}`.toUpperCase().endsWith(`${term}`.toUpperCase()) ? 1 : 0
}
