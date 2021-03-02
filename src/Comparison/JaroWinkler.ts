/**
 * Determines a score based on the Jaro-Winkler distance between a given term and context
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} matchThreshold - Threshold for what is considered a match
 * @param {unknown} winklerThreshold - Threshold for a Jaro score where Winkler should be applied.
 * @param {unknown} prefixLength - Threshold for the string prefix (1-4)
 * @param {unknown} scalingFactor - Scaling factor for the prefix boost (0-0.25)
 * @return {number} - Resulting score
 */
export const JARO_WINKLER = (term: unknown, context: unknown, matchThreshold = 0.6, winklerThreshold = 0.7, prefixLength = 4, scalingFactor = 0.1): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (term.length === 0 && context.length === 0) {
		return 0
	}
	if (term === context) {
		return 1
	}
	if (winklerThreshold > 1 || winklerThreshold < 0.7 || prefixLength > 4 || prefixLength < 1) {
		console.error("Invalid winkler-threshold or prefixLength passed to the JaroWinkler function.")
		return 0
	}

	const jaro = (term: string, context: string) => {
		const termLength = term.length
		const contextLength = context.length

		//Maximum distance for matching
		const range = Math.floor(Math.max(termLength, contextLength) / 2) - 1
		let matches = 0

		//Match hash
		const termMatches = new Array(termLength)
		const contextMatches = new Array(contextLength)

		//Traverse the term
		for (let i = 0; i < termLength; i++) {
			const start = Math.max(i - range, 0)
			const end = Math.min(i + range, contextLength - 1)
			for (let j = start; j <= end; j++) {
				if (term[i] === context[j] && termMatches[i] !== 1 && contextMatches[j] !== 1) {
					termMatches[i] = 1
					contextMatches[j] = 1
					matches++
					break
				}
			}
		}

		if (matches === 0) {
			return 0
		}

		//Number of transpositions
		let transpositions = 0
		let point = 0

		//Determine number of occurances where two characters match but with a third matched character in between
		for (let i = 0; i < termLength; i++) {
			if (termMatches[i] === 1) {
				//Find the next matched character in the context
				while (contextMatches[point] === 0) {
					point++
				}
				if (term[i] !== context[point]) {
					point++
					transpositions++
				} else {
					point++
				}
			}
			transpositions /= 2
		}

		//Return the Jaro-similarity
		return (matches / termLength + matches / contextLength + (matches - transpositions) / matches) / 3
	}

	let jaroDistance = jaro(term, context)
	if (jaroDistance > winklerThreshold) {
		//Find the length of the potential common prefix
		let prefix = 0
		for (let i = 0; i < Math.min(term.length, context.length, prefixLength); i++) {
			if (term[i] !== context[i]) {
				break
			}
			prefix++
		}
		jaroDistance += scalingFactor * prefix * (1 - jaroDistance)
	}
	return jaroDistance > matchThreshold ? jaroDistance : 0
}
