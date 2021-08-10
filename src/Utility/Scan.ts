import SearchResult from "../Model/SearchResult"
import Document from "../Model/Document"
import Declaration from "../Model/Declaration"
import IComparison from "../Model/IComparison"
import IComparisonResult from "../Model/IComparisonResult"

interface IComparisonMatch {
	declaration: Declaration | null
	score: number
	weightedScore: number
	metaData: IComparisonResult | null
}

/**
 * Finds all documents in the given document array with matching declarations. Always finds the best matching declaration.
 * @param {Document[]} documentArray - Array of documents to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison} comparisonFunction - Function to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FULL_SCAN = (documentArray: Document[], searchValue: any, comparisonFunction: IComparison, limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[] = []
	let numberOfFound = 0
	for (let documentIndex = 0; documentIndex < documentArray.length; documentIndex++) {
		const doc = documentArray[documentIndex]
		const foundDeclaration = doc.declarations.reduce(
			(bestMatch: IComparisonMatch, declaration) => {
				const comparisonResult = comparisonFunction(searchValue, declaration.value)
				const score =
					typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
				const weightedScore = score * declaration.normalizedWeight
				if (weightedScore > bestMatch.weightedScore) {
					return {
						declaration,
						score,
						weightedScore,
						metaData: typeof comparisonResult === "object" ? comparisonResult : null
					}
				}
				return bestMatch
			},
			{ score: 0, weightedScore: 0, declaration: null, metaData: null }
		)
		if (foundDeclaration.score) {
			matches.push(
				new SearchResult(
					doc.origin,
					doc.originIndex,
					foundDeclaration.declaration!.path,
					foundDeclaration.declaration!.originValue,
					foundDeclaration.weightedScore,
					foundDeclaration.score,
					foundDeclaration.declaration!.weight,
					foundDeclaration.declaration!.normalizedWeight,
					foundDeclaration.metaData
				)
			)
			numberOfFound++
			if (limit && numberOfFound >= limit) {
				break
			}
		}
	}
	return matches
}
