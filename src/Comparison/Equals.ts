/**
 * Checks if the context is equal to the term
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export const EQUALS = (term: unknown, context: unknown, caseSensitive = true): number => {
	return caseSensitive
		? context === term
			? 1
			: 0
		: (typeof context === "string" ? context.toUpperCase() : context) === (typeof term === "string" ? term.toUpperCase() : term)
			? 1
			: 0
}
