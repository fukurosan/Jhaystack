import SearchResult from "../Model/SearchResult"
import { getStackedRelevance } from "../Utility/Mathematics"
import Item from "../Model/Item"
import Shard from "../Model/Shard"

interface IComparisonMatch {
    shard: Shard | null
    comparisonScore: number,
}

/**
 * Finds all matching shards inside of a given item array.
 * @param {Item[]} itemArray - Array of items to traverse
 * @param {any} searchValue - Value to search for
 * @param {((term: string, context: any) => number)[]} comparisonStrategy - Array of functions to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export default (itemArray: Item[], searchValue: any, comparisonStrategy: ((term: string, context: any) => number)[], limit?: number): SearchResult[] => {
    if (limit !== undefined && limit !== null && limit < 1) {
        return []
    }
    let matches: SearchResult[][] = []
    let numberOfFound = 0
    const itemRemainingShardMap = new Map<Item, Shard[]>()
    comparisonStrategy.forEach(() => matches.push([]))
    traversal:
    for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
        const comparisonFunction = comparisonStrategy[strategyIndex]
        for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
            const item = itemArray[itemIndex]
            if (!itemRemainingShardMap.has(item)) {
                itemRemainingShardMap.set(item, [...item.shards])
            }
            const shards = itemRemainingShardMap.get(item)!
            const foundShards = shards.reduce((matches: IComparisonMatch[], shard) => {
                if (limit && matches.length + numberOfFound >= limit) {
                    return matches
                }
                let comparisonScore = comparisonFunction(searchValue, shard.value)
                if (comparisonScore) {
                    matches.push({
                        shard: shard,
                        comparisonScore
                    })
                }
                return matches
            }, [])
            if (foundShards.length > 0) {
                const foundOriginalItem = item.original
                for (let shardIndex = 0; shardIndex < foundShards.length; shardIndex++) {
                    const foundShard = foundShards[shardIndex]
                    shards.splice(shards.indexOf(foundShard.shard!), 1)
                    matches[strategyIndex].push(new SearchResult(
                        foundOriginalItem,
                        foundShard.shard!.path,
                        foundShard.shard!.value,
                        getStackedRelevance(strategyIndex, foundShard.comparisonScore),
                        foundShard.comparisonScore,
                        strategyIndex
                    ))
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