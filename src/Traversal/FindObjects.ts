import SearchResult from "../Model/SearchResult"
import { getRelativeRelevance } from "../Utility/Relevance"
import Item from "../Model/Item"
import Shard from "../Model/Shard"
import IComparison from "../Model/IComparison"
import IComparisonResult from "../Model/IComparisonResult"

interface IComparisonMatch {
	shard: Shard | null
	comparisonScore: number
	weightedComparisonScore: number
	metaData?: IComparisonResult
}

/**
 * Finds all items in the given item array with matching shards. Always finds the best matching shard.
 * @param {Item[]} itemArray - Array of items to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison[]} comparisonStrategy - Array of functions to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FIND_OBJECTS = (itemArrayIn: Item[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const itemArray = [...itemArrayIn]
	const matches: SearchResult[][] = []
	let numberOfFound = 0
	comparisonStrategy.forEach(() => matches.push([]))
	traversal: for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
		const comparisonFunction = comparisonStrategy[strategyIndex]
		for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
			const item = itemArray[itemIndex]
			const foundShard = item.shards.reduce(
				(bestMatch: IComparisonMatch, shard) => {
					const comparisonResult = comparisonFunction(searchValue, shard.value)
					const comparisonScore =
						typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
					const weightedComparisonScore = comparisonScore * shard.normalizedWeight
					if (weightedComparisonScore > bestMatch.weightedComparisonScore) {
						return {
							shard,
							comparisonScore,
							weightedComparisonScore,
							metaData: typeof comparisonResult === "object" ? comparisonResult : undefined
						}
					}
					return bestMatch
				},
				{ comparisonScore: 0, weightedComparisonScore: 0, shard: null }
			)
			if (foundShard.comparisonScore) {
				const foundItem = itemArray.splice(itemIndex, 1)[0]
				matches[strategyIndex].push(
					new SearchResult(
						foundItem.original,
						foundItem.originalIndex,
						foundShard.shard!.path,
						foundShard.shard!.originalValue,
						getRelativeRelevance(comparisonStrategy.length, strategyIndex + 1, foundShard.weightedComparisonScore),
						foundShard.comparisonScore,
						strategyIndex,
						foundShard.shard!.weight,
						foundShard.shard!.normalizedWeight,
						foundShard.metaData
					)
				)
				numberOfFound++
				itemIndex--
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
