/**
 * Determines a linear relevance. Uses a point in a set range, and combines it with a floating point number between 0 - 1
 * @param {number} length - Length of the range
 * @param {number} point - Point in the range, lower is better
 * @param {number} secondaryValue - The secondary score (0.0 - 1.0), higher is better
 * @return {number} - The combined score (0.0 - 1.0)
 */
export const getRelativeRelevance = (length: number, point: number, secondaryValue: number): number => {
	const increment = 1 / length
	const startPosition = increment * (length - point)
	const endPosition = startPosition + increment
	const tween = increment * secondaryValue + startPosition
	return tween === endPosition ? tween - 0.00000001 : tween === startPosition ? tween + 0.00000001 : tween
}

/**
 * Determines a non-linear relevance. Combines one primary positive integer and one secondary positive floating point number between 0 and 1 into a relevance score of 0 - 1
 * @param {number} primaryScoreIn - Primary score (integer), Lower is better
 * @param {number} secondaryScoreIn - Secondary score (float 0.0 - 1.0), higher is better
 * @return {number} - Combined score (0.0 - 1.0)
 */
export const getStackedRelevance = (primaryScoreIn: number, secondaryScoreIn: number): number => {
	let primaryScore = primaryScoreIn
	let secondaryScore = secondaryScoreIn
	primaryScore < 0 && (primaryScore = 0)
	secondaryScore < 0 && (secondaryScore = 0)
	primaryScore++
	const lowestPossibleScore = 1 / (primaryScore + 1)
	const highestPossibleScore = 1 / primaryScore
	const stackedRelevance = lowestPossibleScore + (highestPossibleScore - lowestPossibleScore) * secondaryScore
	return stackedRelevance === highestPossibleScore
		? stackedRelevance - 0.00000001
		: stackedRelevance === lowestPossibleScore
			? stackedRelevance + 0.00000001
			: stackedRelevance
}

/**
 * Calculates a logistic sigmoid function. Will not work for very large numbers due to how rounding in JavaScript works, but is fine for its use case.
 * @param {number} z - The number to be plotted
 * @return {number} - number between -1 - 1
 */
export const sigmoid = (z: number): number => {
	return 1 / (1 + Math.exp(-z / 100))
}

/**
 * Calculates a logistic sigmoid function, but for only positive numbers.
 * Good for converting integers that can range up to the hundreds into a score from 0 - 1
 * @param {number} z - The number to be plotted
 * @return {number} - number between 0 - 1
 */
export const sigmoidPositive = (z: number): number => {
	return (sigmoid(z) - 0.5) * 2
}

/**
 * Normalizes a value using minmax
 * @param {number} value - The number to be normalized
 * @param {number} max - Maximum value of the scale
 * @param {number} min - Minimum value of the scale
 * @return {number} - number between 0 - 1
 */
export const minMax = (value: number, max: number, min: number) => {
	return (value - min) / (max - min)
}

/**
 * Generates a random number in a minmax range.
 * @param {number} min - Minimum number in range
 * @param {number} max - Maximum number in range
 */
export const getRandomNumberInRange = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}
