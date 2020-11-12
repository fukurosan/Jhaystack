/**
 * Checks if the context contains the term (case sensitive!).
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export default (term: unknown, context: unknown, caseSensitive = true): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	return caseSensitive ? (context.indexOf(term) > -1 ? 1 : 0) : context.toUpperCase().indexOf(term.toUpperCase()) > -1 ? 1 : 0
}
