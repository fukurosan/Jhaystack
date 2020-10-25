import SearchResult from "../Model/SearchResult"
import { getStackedRelevance } from "../Utility/Mathematics"
import Item from "../Model/Item"
import Shard from "../Model/Shard"

interface IComparisonMatch {
    shard: Shard | null
    comparisonScore: number,
}

/**
 * Finds all items in the given item array with matching shards. Always finds the best matching shard.
 * @param {Item[]} itemArray - Array of items to traverse
 * @param {any} searchValue - Value to search for
 * @param {((term: string, context: any) => number)[]} comparisonStrategy - Array of functions to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export default (itemArrayIn: Item[], searchValue: any, comparisonStrategy: ((term: string, context: any) => number)[], limit?: number): SearchResult[] => {
    if (limit !== undefined && limit !== null && limit < 1) {
        return []
    }
    const itemArray = [...itemArrayIn]
    let matches: SearchResult[][] = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => matches.push([]))
    traversal:
    for (let strategyIndex = 0; strategyIndex < comparisonStrategy.length; strategyIndex++) {
        const comparisonFunction = comparisonStrategy[strategyIndex]
        for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
            const item = itemArray[itemIndex]
            const foundShard = item.shards.reduce((bestMatch: IComparisonMatch, shard) => {
                const comparisonScore = comparisonFunction(searchValue, shard.value)
                if (comparisonScore > bestMatch.comparisonScore) {
                    return {
                        shard: shard,
                        comparisonScore: comparisonScore
                    }
                }
                return bestMatch
            }, { comparisonScore: 0, shard: null })
            if (foundShard.comparisonScore) {
                matches[strategyIndex].push(new SearchResult(
                    itemArray.splice(itemIndex, 1)[0].original,
                    foundShard.shard!.path,
                    foundShard.shard!.value,
                    getStackedRelevance(strategyIndex, foundShard.comparisonScore),
                    foundShard.comparisonScore,
                    strategyIndex
                ))
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