/**
 * Determines the relevance within a set range, and combines it with a floating point number between 0 - 1
 * @param {number} length - Length of the range
 * @param {number} point - Point in the range, lower is better
 * @param {number} secondaryValue - The secondary score (0.0 - 1.0), higher is better
 * @return {number} - The combined score (0.0 - 1.0)
 */
export const getRelativeRelevance = (length: number, point: number, secondaryValue: number): number => {
    const increment = 1 / length
    const startPosition = increment * (length - point)
    const endPosition = startPosition + increment
    const tween = (increment * secondaryValue) + startPosition
    return tween === endPosition ? (tween - 0.00000001) : tween === startPosition ? (tween + 0.00000001) : tween
}

/**
 * Combines two positive integers into a relevance score of 0 - 1
 * @param {number} primaryScoreIn - Primary score, Lower is better
 * @param {number} secondaryScoreIn - Secondary score, Lower is better
 * @return {number} - Combined score (0.0 - 1.0)
 */
export const getTweenedRelevance = (primaryScoreIn: number, secondaryScoreIn: number): number => {
    let secondaryScore = secondaryScoreIn
    secondaryScore < 0 && (secondaryScore = 0)
    secondaryScore++
    return getStackedRelevance(primaryScoreIn, 1 / secondaryScore)
}

/**
 * Creates a score from one positive integer and one floating point number between 0 and 1
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
    const stackedRelevance = lowestPossibleScore + ((highestPossibleScore - lowestPossibleScore) * secondaryScore)
    return stackedRelevance === highestPossibleScore ? stackedRelevance - 0.00000001 : stackedRelevance === lowestPossibleScore ? stackedRelevance + 0.00000001 : stackedRelevance
}

/**
 * Combines a list of positive integers into a single relevance score
 * @param {number[]} scores - An array of positive numbers, ranked from most important to least important. Lower is better.
 * @return {number} - Combined score (0.0 - 1.0)
 */
export const getCombinedRelevanceScore = (scores: number[]): number => {
    if (scores.length === 0) {
        return 0
    }
    else if (scores.length === 1) {
        if (scores[0] < 0) {
            return 0
        }
        return 1 / (scores[0] + 1)
    }
    return scores.reverse().reduce((accumulatedScore: number, score: number, index: number): number => {
        if (index === 0) {
            accumulatedScore = 1 / (score + 1)
        }
        else {
            accumulatedScore = getStackedRelevance(score, accumulatedScore)
        }
        return accumulatedScore
    }, 0)
}