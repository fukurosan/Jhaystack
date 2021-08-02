import SearchResult from "../Model/SearchResult"
import { getRelativeRelevance } from "./MathUtils"
import Document from "../Model/Document"
import Declaration from "../Model/Declaration"
import IComparison from "../Model/IComparison"
import IComparisonResult from "../Model/IComparisonResult"

interface IComparisonMatch {
	declaration: Declaration | null
	comparisonScore: number
	weightedComparisonScore: number
	metaData: IComparisonResult | null
}

/**
 * Finds all documents in the given document array with matching declarations. Always finds the best matching declaration.
 * @param {Document[]} documentArray - Array of documents to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison[]} comparisonStrategy - Function to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FULL_SCAN = (documentArray: Document[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[][] = []
	let numberOfFound = 0
	comparisonStrategy.forEach(() => matches.push([]))
	traversal: for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
		const comparisonFunction = comparisonStrategy[strategyIndex]
		for (let documentIndex = 0; documentIndex < documentArray.length; documentIndex++) {
			const doc = documentArray[documentIndex]
			const foundDeclaration = doc.declarations.reduce(
				(bestMatch: IComparisonMatch, declaration) => {
					const comparisonResult = comparisonFunction(searchValue, declaration.value)
					const comparisonScore =
						typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
					const weightedComparisonScore = comparisonScore * declaration.normalizedWeight
					if (weightedComparisonScore > bestMatch.weightedComparisonScore) {
						return {
							declaration,
							comparisonScore,
							weightedComparisonScore,
							metaData: typeof comparisonResult === "object" ? comparisonResult : null
						}
					}
					return bestMatch
				},
				{ comparisonScore: 0, weightedComparisonScore: 0, declaration: null, metaData: null }
			)
			if (foundDeclaration.comparisonScore) {
				matches[strategyIndex].push(
					new SearchResult(
						doc.origin,
						doc.originIndex,
						foundDeclaration.declaration!.path,
						foundDeclaration.declaration!.originValue,
						getRelativeRelevance(comparisonStrategy.length, strategyIndex + 1, foundDeclaration.weightedComparisonScore),
						foundDeclaration.comparisonScore,
						strategyIndex,
						foundDeclaration.declaration!.weight,
						foundDeclaration.declaration!.normalizedWeight,
						foundDeclaration.metaData
					)
				)
				numberOfFound++
				if (limit && numberOfFound >= limit) {
					break traversal
				}
			}
		}
	}
	let result: SearchResult[] = []
	matches.forEach(hitArray => {
		result = [...result, ...hitArray]
	})
	return result
}
