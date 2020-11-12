import IComparisonResult from "../Model/IComparisonResult"

/**
 * Checks if all term characters exists within the context in their given sequence. (not case sensitive!)
 * Score is secondarily based on the total space bewteen the characters.
 * @param {unknown} termIn - The term to be matched
 * @param {unknown} contextIn - The context to searched
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @return {number} - Resulting score
 */
export default (termIn: unknown, contextIn: unknown, caseSensitive = true): IComparisonResult | number => {
	if (typeof termIn !== "string" || typeof contextIn !== "string") {
		return 0
	}
	const term = (caseSensitive ? termIn : termIn.toUpperCase()).replace(/ /g, "")
	const context = (caseSensitive ? contextIn : contextIn.toUpperCase()).replace(/ /g, "")
	const termLength = term.length
	const contextLength = context.length
	let distance = 0
	let counting = false
	if (termLength > contextLength) {
		return 0
	}
	outer: for (let i = 0, j = 0; i < termLength; i++) {
		const termCharacter = term.charAt(i)
		while (j < contextLength) {
			if (context.charAt(j++) === termCharacter) {
				counting = true
				continue outer
			}
			if (counting) {
				distance++
			}
		}
		return 0
	}
	return { score: 1 / (distance + 1), totalDistance: distance }
}
