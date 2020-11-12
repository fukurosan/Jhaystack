/**
 * Checks if the context matches a given regular expression. Note that this strategy only is compatible with regular expression terms.
 * @param {RegExp} term - The regular expression to be tested
 * @param {unknown} context - The context to tested
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export default (term: RegExp, context: unknown, caseSensitive = true) => {
	return caseSensitive ? (term.test(`${context}`) ? 1 : 0) : term.test(`${context}`.toUpperCase()) ? 1 : 0
}
