import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"
import Shard from "../Model/Shard"
import { getStackedRelevance } from "../Utility/Mathematics"
import { ObjectLiteral } from "../Utility/JsonUtility"
import IComparison from "../Comparison/IComparison"

interface IComparisonMatch {
	shard: Shard | null
	comparisonScore: number
}

/**
 * Calculates and finds all nested items in the given item array with matching shards. Always finds the best matching shard.
 * @param {Item[]} itemArray - Array of items to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison[]} comparisonStrategy - Array of functions to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export default (itemArray: Item[], searchValue: any, comparisonStrategy: IComparison[], limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[][] = []
	let numberOfFound = 0
	const itemNestedObjectMap = new Map<Item, Map<ObjectLiteral, Shard[]>>()
	const shardNestedPathMap = new Map<Shard, string[]>()
	comparisonStrategy.forEach(() => matches.push([]))
	traversal: for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
		const comparisonFunction = comparisonStrategy[strategyIndex]
		for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
			const item = itemArray[itemIndex]
			if (!itemNestedObjectMap.has(item)) {
				itemNestedObjectMap.set(
					item,
					item.shards.reduce((nestedObjectShardMap: Map<ObjectLiteral, Shard[]>, shard: Shard) => {
						let path: string[] = []
						path = shard.path
						if (path.length > 0) {
							for (let i = path.length - 1; i > -1; i--) {
								if (path[i] !== shard.key) {
									path = path.slice(0, path.length - 1)
								} else {
									break
								}
							}
						}
						shardNestedPathMap.set(shard, shard.path.slice(shard.path.length - path.length - (shard.path.length > 0 ? 1 : 0)))
						if (path.length > 0) {
							path = path.slice(0, path.length - 1)
						}
						const nestedObject = path.reduce((acc: ObjectLiteral, current) => {
							return acc[current]
						}, item.original)
						if (!nestedObjectShardMap.has(nestedObject)) {
							nestedObjectShardMap.set(nestedObject, [])
						}
						nestedObjectShardMap.get(nestedObject)!.push(shard)
						return nestedObjectShardMap
					}, new Map<ObjectLiteral, Shard[]>())
				)
			}
			const nestedObjectShardMap = itemNestedObjectMap.get(item)!
			for (const [nestedObject, shardArray] of nestedObjectShardMap) {
				const foundShard = shardArray.reduce(
					(bestMatch: IComparisonMatch, shard: Shard) => {
						const comparisonScore = comparisonFunction(searchValue, shard.value)
						if (comparisonScore > bestMatch.comparisonScore) {
							return {
								shard,
								comparisonScore
							}
						}
						return bestMatch
					},
					{ comparisonScore: 0, shard: null }
				)
				if (foundShard.comparisonScore) {
					let path = shardNestedPathMap.get(foundShard.shard!)!
					if (path.length > 1) {
						path = path.slice(1)
					}
					matches[strategyIndex].push(
						new SearchResult(
							nestedObject,
							path,
							foundShard.shard!.value,
							getStackedRelevance(strategyIndex, foundShard.comparisonScore),
							foundShard.comparisonScore,
							strategyIndex
						)
					)
					numberOfFound++
					if (limit && numberOfFound >= limit) {
						break traversal
					}
					nestedObjectShardMap.delete(nestedObject)
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
