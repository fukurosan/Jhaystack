/**
 * Checks if the context matches a given regular expression. Note that this strategy only is compatible with regular expression terms.
 * @param {RegExp} term - The regular expression to be tested
 * @param {unknown} context - The context to tested
 * @return {number} - Resulting score
 */
export default (term: RegExp, context: unknown) => {
	return term.test(`${context}`) ? 1 : 0
}
