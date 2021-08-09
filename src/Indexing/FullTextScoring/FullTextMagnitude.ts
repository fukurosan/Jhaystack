import { IIndexVector } from "../../Model/IFullTextScoring"

/**
 * Evaluates the combined magnitude score of two vectors
 * @param {IIndexVector} vector1 - Vector 1
 * @param {IIndexVector} vector2 - Vector 2
 */
export const FULLTEXT_MAGNITUDE = (vector1: IIndexVector, vector2: IIndexVector): number => {
	let score = 0
	for (let i = 0; i < vector1.vector.length; i++) {
		score += vector1.vector[i]
		score += vector2.vector[i]
	}
	score = score / vector1.vector.length
	return score
}
