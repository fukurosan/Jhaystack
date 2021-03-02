/**
 * Extracts n-grams from a string given certain input parameters.
 * If the minimum gram size is configured then the start and end of the term will be parsed
 * into edge grams equivalent to the difference between minGram and maxGram.
 * @param {string} term - String to extract grams from
 * @param {number} maxGram - Maximum size for the grams (default 3)
 * @param {number} minGram - Minimum size for the grams (default 3)
 * @param {boolean} captureSpace - If false all spaces will be removed before parsing (default true)
 * @param {boolean} captureStartEnd - If true the beginning and end of the term will be parsed as a custom character (default false)
 * @return {Set<string>} - A set of grams
 */
export const nGram = (termIn: string, maxGram = 3, minGram = maxGram, captureSpace = true, captureStartEnd = false): Set<string> => {
	if (minGram > maxGram) {
		console.error("Min Gram length can not be larger than Max Gram length.")
		return new Set()
	}
	let term = termIn
	if (!captureSpace) {
		term.replace(/\s/g, "")
	}
	if (captureStartEnd) {
		term = `^${term}$`
	}
	const ngrams = new Set<string>()
	const length = term.length
	if (length < minGram) {
		return new Set()
	}
	if (minGram < maxGram) {
		for (let i = minGram - 1; i < maxGram - 1; i++) {
			ngrams.add(term.substr(0, i + 1))
			ngrams.add(term.substr(length - i - 1))
		}
	}
	for (let i = 0; i < length - maxGram + 1; i++) {
		ngrams.add(term.substr(i, maxGram))
	}
	return ngrams
}

/**
 * Finds and returns a Set of edge grams (starts with grams).
 * @param {string} term - String to extract edge grams from
 * @param {number} n - Maximum number of grams to extract
 * @return {Set<String>} - A set of edge grams
 */
export const edgeGram = (term: string, n = 10): Set<string> => {
	const ngrams = new Set<string>()
	const end = n ? Math.min(term.length, n) : term.length
	for (let i = 0; i < end; i++) {
		ngrams.add(term.substr(0, i + 1))
	}
	return ngrams
}
