import SearchResult from "../Model/SearchResult"
import { getRelativeRelevance } from "../Utility/Relevance"
import Item from "../Model/Item"
import Shard from "../Model/Shard"
import IComparison from "../Model/IComparison"
import IComparisonResult from "../Model/IComparisonResult"

/**
 * Finds all matching shards inside of a given item array.
 * @param {Item[]} itemArray - Array of items to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison[]} comparisonStrategy - Array of functions to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FIND_VALUES = (itemArray: Item[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[][] = []
	let numberOfFound = 0
	const itemRemainingShardMap = new Map<Item, Shard[]>()
	comparisonStrategy.forEach(() => matches.push([]))
	traversal: for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
		const comparisonFunction = comparisonStrategy[strategyIndex]
		for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
			const item = itemArray[itemIndex]
			if (!itemRemainingShardMap.has(item)) {
				itemRemainingShardMap.set(item, [...item.shards])
			}
			const shards = itemRemainingShardMap.get(item)!
			for (let shardIndex = 0; shardIndex < shards.length; shardIndex++) {
				const shard = shards[shardIndex]
				const comparisonResult = comparisonFunction(searchValue, shard.value)
				const comparisonScore =
					typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
				if (comparisonScore) {
					shards.splice(shardIndex, 1)
					shardIndex--
					matches[strategyIndex].push(
						new SearchResult(
							item.original,
							item.originalIndex,
							shard.path,
							shard.originalValue,
							getRelativeRelevance(comparisonStrategy.length, strategyIndex + 1, comparisonScore * shard.normalizedWeight),
							comparisonScore,
							strategyIndex,
							shard.weight,
							shard.normalizedWeight,
							typeof comparisonResult === "object" ? comparisonResult : undefined
						)
					)
					numberOfFound++
					if (limit && numberOfFound >= limit) {
						break traversal
					}
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
