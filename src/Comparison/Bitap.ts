import IComparisonResult from "../Model/IComparisonResult"
import { ObjectLiteral } from "../Utility/JsonUtility"
import { getRelativeRelevance, sigmoidPositive } from "../Utility/MathUtils"

//Fantastic Japanese wiki article on Bitap (shift-and, shift-or):
//https://ja.m.wikipedia.org/wiki/Bitapアルゴリズム
//Wu & Mander's implementation for reference:
//https://dl.acm.org/doi/pdf/10.1145/135239.135244
//Navarro's implementation for reference:
//https://www.researchgate.net/publication/2437209_A_Faster_Algorithm_for_Approximate_String_Matching
//Myer's implementation for reference:
//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.332.9395&rep=rep1&type=pdf

/**
 * Creates a bit mask of the context based on the position of characters found in the term.
 * @param {string} term - The term to be matched
 * @param {string} context - The context to search
 * @return {object} - A bit mask map where the keys are the characters in the term.
 */
const generateBitMask = (term: string, context: string) => {
	const characterMap: ObjectLiteral = {}
	const seen: ObjectLiteral = {}
	const termLength = term.length
	for (let i = 0; i < termLength; i++) {
		const character = term.charAt(i)
		seen[character] = 1
		characterMap[character] = (characterMap[character] || 0) | (1 << i)
	}
	const characterLength = context.length
	for (let i = 0; i < characterLength; i++) {
		const character = context.charAt(i)
		!seen[character] && (characterMap[character] = 0) && (seen[character] = 1)
	}
	return characterMap
}

/**
 * Calculates the tween value to be used for determining the relative relevance.
 * @param {termLength} term - Length of the term
 * @param {contextLength} context - Length of the context
 * @param {index} context - Index of the match
 * @param {isPositionRelevant} context - Is the position of the match relevant?
 * @param {isContextSizeRelevant} context - Is the size of the context relevant?
 * @return {number} - A tween divider number.
 */
const getScorePenaltyValue = (
	termLength: number,
	contextLength: number,
	index: number,
	isPositionRelevant: boolean,
	isContextSizeRelevant: boolean
): number => {
	let tweenValue = 0
	isPositionRelevant && (tweenValue = tweenValue + index - (termLength - 1))
	tweenValue < 0 && (tweenValue = 0)
	isContextSizeRelevant && (tweenValue = tweenValue + (contextLength - termLength))
	return tweenValue
}

/**
 * Finds a match of the term contained in the context that is within the given levenshtein distance.
 * @param {unknown} termIn - The term to be matched
 * @param {unknown} contextIn - The context to search
 * @param {boolean} caseSensitive - Is the search case sensitive?
 * @param {boolean} isFullScan - Should the entire context be scanned for the absolute best possible match?
 * @param {number} maxErrors - Maximum levenshtein distance (integer). Default is -1 which results in an automatic value based on the term length
 * @param {boolean} isPositionRelevant - If true relevance will secondarily be based on term's absolute vicinity to index 0 in context
 * @param {boolean} isContextSizeRelevant - If true relevance will secondarily be based on context absolue size. Smaller is more relevant.
 * @return {number} - Resulting score. Score is primarily based on the levenshtein distance.
 */
export const BITAP = (
	termIn: unknown,
	contextIn: unknown,
	caseSensitive = true,
	isFullScan = true,
	maxErrors = -1,
	isPositionRelevant = true,
	isContextSizeRelevant = true
): number | IComparisonResult => {
	if (typeof termIn !== "string" || typeof contextIn !== "string") {
		return 0
	}
	const term = (caseSensitive ? termIn : termIn.toUpperCase()).substr(0, 32)
	const context = caseSensitive ? contextIn : contextIn.toUpperCase()
	const contextLength = context.length
	const termLength = term.length
	if (maxErrors === -1) {
		if (termLength <= 2) {
			maxErrors = 0
		} else if (termLength <= 5) {
			maxErrors = 1
		} else {
			maxErrors = 2
		}
	}
	if (termLength - maxErrors > contextLength) {
		return 0
	}
	let numberOfStates = maxErrors + 1 //+1 is the 0 state (no errors!)
	const bitMask = generateBitMask(term, context)
	const finish = 1 << (termLength - 1)

	if (maxErrors === 0) {
		//This basically becomes a contains search, which is much faster
		let r = 0
		for (let i = 0; i < contextLength; i++) {
			r = ((r << 1) | 1) & bitMask[context.charAt(i)]
			if ((r & finish) === finish) {
				if (!isPositionRelevant && !isContextSizeRelevant) {
					return { score: 1, k: 0, matchIndex: i }
				}
				return {
					score: getRelativeRelevance(
						numberOfStates,
						0 + 1,
						1 - sigmoidPositive(getScorePenaltyValue(termLength, contextLength, i, isPositionRelevant, isContextSizeRelevant))
					),
					k: 0,
					matchIndex: i
				}
			}
		}
		return 0
	}

	//Fuzzy search
	const state = new Array(numberOfStates).fill(0)
	let matchKDepth = null
	let matchIndex = null
	search: for (let i = 0; i < contextLength; i++) {
		let rStringMask = 0
		for (let j = 0; j < numberOfStates; j++) {
			//Sacrificing a bit of readbility in the name of performance
			let nextRString = state[j] //Handle Insertion
			state[j] = (state[j] << 1) | 1
			nextRString |= state[j] //Handle Replacement
			state[j] &= bitMask[context.charAt(i)]
			state[j] |= rStringMask
			nextRString |= (state[j] << 1) | 1
			rStringMask = nextRString //Handle Removal
		}
		if (!isFullScan && matchKDepth !== null && (state[maxErrors] & finish) !== finish) {
			break search
		} else if ((state[maxErrors] & finish) === finish) {
			matchKDepth = maxErrors
			matchIndex = i
			maxErrors--
			numberOfStates--
			if (numberOfStates === 0) {
				break search
			}
		}
	}

	if (matchKDepth !== null && matchIndex !== null && termLength - matchKDepth > 1) {
		return {
			score:
				isPositionRelevant || isContextSizeRelevant
					? getRelativeRelevance(
						state.length,
						matchKDepth + 1,
						1 - sigmoidPositive(getScorePenaltyValue(termLength, contextLength, matchIndex, isPositionRelevant, isContextSizeRelevant))
					  )
					: getRelativeRelevance(state.length, matchKDepth + 1, 1),
			k: matchKDepth,
			matchIndex
		}
	}
	return 0
}

BITAP._jhaystack = {
	dependencies: {
		[generateBitMask.name]: generateBitMask,
		[getRelativeRelevance.name]: getRelativeRelevance,
		[sigmoidPositive.name]: sigmoidPositive,
		[getScorePenaltyValue.name]: getScorePenaltyValue
	}
}
