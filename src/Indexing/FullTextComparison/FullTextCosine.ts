import { IIndexVector } from "../../Model/IFullTextScoring"

/**
 * Evaluates the Cosine similarity between two vectors
 * Cosine similarity means the dot product of the provided vectors divided by the multiplied value of the vector lengths.
 * @param {IIndexVector} vector1 - Vector 1
 * @param {IIndexVector} vector2 - Vector 2
 */
export const FULLTEXT_COSINE = (vector1: IIndexVector, vector2: IIndexVector): number => {
	const v1 = vector1.vector
	const v2 = vector2.vector
	const isVector1UnitLength = vector1.isUnitLength
	const isVector2UnitLength = vector2.isUnitLength
	let dotProduct = 0
	let vector1Length = 1
	let vector2Length = 1
	for (let i = 0; i < v1.length; i++) {
		dotProduct += v1[i] * v2[i]
		if (!isVector1UnitLength) {
			vector1Length += v1[i] ** 2
		}
		if (!isVector2UnitLength) {
			vector2Length += v2[i] ** 2
		}
	}
	if (!isVector1UnitLength) {
		vector1Length = Math.sqrt(vector1Length)
	}
	if (!isVector2UnitLength) {
		vector2Length = Math.sqrt(vector2Length)
	}
	return dotProduct / (vector1Length * vector2Length)
}
