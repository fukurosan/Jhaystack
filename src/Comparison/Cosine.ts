import { ObjectLiteral } from "../Utility/JsonUtility"

/**
 * Determines the cosine distance between two strings based on their n grams
 * @param {unknown} term - The term to be matched
 * @param {unknown} context - The context to searched
 * @param {unknown} threshold - Threshold for what is considered a match
 * @param {boolean} n - How large grams should the input strings be split into?
 * @return {number} - Resulting score
 */
export const COSINE = (term: unknown, context: unknown, threshold = 0.2, n = 3): number => {
	if (typeof term !== "string" || typeof context !== "string") {
		return 0
	}
	if (term.length < n || context.length < n) {
		return 0
	}
	if (term === context) {
		return 1
	}

	const termGrams: ObjectLiteral = {}
	const contextGrams: ObjectLiteral = {}
	const grams = new Set()
	for (let i = 0; i < term.length - n; i++) {
		const gram = term.substr(i, n)
		grams.add(gram)
		termGrams[gram] = termGrams[gram] ? termGrams[gram] + 1 : 1
	}
	for (let i = 0; i < context.length - n; i++) {
		const gram = context.substr(i, n)
		grams.add(gram)
		contextGrams[gram] = contextGrams[gram] ? contextGrams[gram] + 1 : 1
	}

	const termVector: number[] = []
	const contextVector: number[] = []
	grams.forEach(gram => {
		termVector.push(termGrams[<string>gram] ? termGrams[<string>gram] : 0)
		contextVector.push(contextGrams[<string>gram] ? contextGrams[<string>gram] : 0)
	})

	let dotProduct = 0
	let magnitudeTerm = 0
	let magnitudeContext = 0

	for (let i = 0; i < termVector.length; i++) {
		if (termVector[i] && contextVector[i]) {
			dotProduct += termVector[i] * contextVector[i]
		}
		magnitudeTerm += Math.pow(termVector[i], 2)
		magnitudeContext += Math.pow(contextVector[i], 2)
	}

	const score = dotProduct / Math.sqrt(magnitudeTerm * magnitudeContext)
	return score > threshold ? score : 0
}
