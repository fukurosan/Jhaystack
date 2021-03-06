/**
 * Checks if the context starts with the term.
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export const STARTS_WITH = (term: unknown, context: unknown, caseSensitive = true): number => {
	return caseSensitive ? (`${context}`.startsWith(`${term}`) ? 1 : 0) : `${context}`.toUpperCase().startsWith(`${term}`.toUpperCase()) ? 1 : 0
}
