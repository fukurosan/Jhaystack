import { getTweenedRelevance } from "../Utility/Mathematics"
import { bitapGenerateBitMask, bitapGetTweenValue } from "./Common"

/**
 * Finds the best match of the term contained in the context that is within the given levenshtein distance.
 * @param {unknown} termIn - The term to be matched
 * @param {unknown} contextIn - The context to search
 * @param {number} maxErrors - Maximum levenshtein distance (integer)
 * @param {boolean} isPositionRelevant - If true relevance will secondarily be based on term's absolute vicinity to index 0 in context
 * @return {number} - Resulting score. Score is primarily based on the levenshtein distance.
 */
export default (termIn: unknown, contextIn: unknown, maxErrors = 2, isPositionRelevant = true, isContextSizeRelevant = true): number => {
	const term = `${termIn}`.toUpperCase()
	const context = `${contextIn}`.toUpperCase()
	const contextLength = context.length
	const termLength = term.length
	if (termLength - maxErrors > contextLength) {
		return 0
	}
	const numberOfStates = maxErrors + 1 //+1 is the 0 state (no errors!)
	const bitMask = bitapGenerateBitMask(term, context)
	const finish = 1 << (termLength - 1)

	if (maxErrors === 0) {
		//This basically becomes a contains search, which is much faster
		let r = 0
		for (let i = 0; i < contextLength; i++) {
			r = ((r << 1) | 1) & bitMask[context.charAt(i)]
			if ((r & finish) === finish) {
				if (!isPositionRelevant && !isContextSizeRelevant) {
					return 1
				}
				return getTweenedRelevance(0, bitapGetTweenValue(termLength, contextLength, i, isPositionRelevant, isContextSizeRelevant))
			}
		}
		return 0
	}

	//Search
	const state = new Array(numberOfStates).fill(0)
	let tempMatchKDepth = null
	let tempMatchDistance = null
	let matchKDepth = null
	let matchDistance = null
	search: for (let i = 0; i < contextLength; i++) {
		let rStringMask = 0
		for (let j = 0; j < state.length; j++) {
			//Sacrificing a bit of readbility in the name of performance
			let nextRString = state[j] //Handle Insertion
			state[j] = (state[j] << 1) | 1
			nextRString |= state[j] //Handle Replacement
			state[j] &= bitMask[context.charAt(i)]
			state[j] |= rStringMask
			nextRString |= (state[j] << 1) | 1
			rStringMask = nextRString //Handle Removal
		}
		if (tempMatchKDepth !== null) {
			tempMatchKDepth--
			let found = false
			if ((state[tempMatchKDepth] & finish) !== finish || tempMatchKDepth === -1) {
				//Last cycle was the best match
				tempMatchKDepth++
				found = true
			} else if (i === contextLength - 1) {
				found = true
			}
			if (found) {
				if (matchKDepth === null || matchKDepth > tempMatchKDepth) {
					matchKDepth = tempMatchKDepth
					matchDistance = tempMatchDistance
					if (matchKDepth === 0) {
						break search
					}
				}
				tempMatchKDepth = null
			}
		} else if ((state[maxErrors] & finish) === finish) {
			tempMatchKDepth = maxErrors
			tempMatchDistance = i - (termLength - 1) - tempMatchKDepth
			if (matchKDepth === null && matchDistance === null) {
				matchKDepth = maxErrors
				matchDistance = i - (termLength - 1) - tempMatchKDepth
			}
		}
	}

	if (matchKDepth !== null && matchDistance !== null) {
		return isPositionRelevant || isContextSizeRelevant
			? getTweenedRelevance(matchKDepth, bitapGetTweenValue(termLength, contextLength, matchDistance, isPositionRelevant, isContextSizeRelevant))
			: 1 / (matchKDepth + 1)
	}

	return 0
}
