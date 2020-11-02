import { ObjectLiteral } from "../Utility/JsonUtility"

/* -------------------------------------
 * BITAP
 * ------------------------------------*/

/**
 * Creates a bit mask of the context based on the position of characters found in the term.
 * @param {string} term - The term to be matched
 * @param {string} context - The context to search
 * @return {object} - A bit mask map where the keys are the characters in the term.
 */
export const bitapGenerateBitMask = (term: string, context: string) => {
	const characterMap: ObjectLiteral = {}
	context.split("").forEach(contextCharacter => {
		characterMap[contextCharacter] = 0
	})
	for (let i = 0; i < term.length; i++) {
		characterMap[term.charAt(i)] = (characterMap[term.charAt(i)] || 0) | (1 << i)
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
export const bitapGetTweenValue = (
	termLength: number,
	contextLength: number,
	index: number,
	isPositionRelevant: boolean,
	isContextSizeRelevant: boolean
): number => {
	let tweenValue = 0
	isPositionRelevant && (tweenValue = tweenValue + index - (termLength - 1))
	isContextSizeRelevant && (tweenValue = tweenValue + (contextLength - termLength))
	return tweenValue
}
