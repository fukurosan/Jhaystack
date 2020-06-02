import SearchResult from "../Model/SearchResult"
import { findReverseTweenPoint } from "../Utility/Mathematics"

export default (itemArrayIn, searchString, comparisonStrategy, limit) => {
    const itemArray = [...itemArrayIn]
    let matches = []
    let numberOfFound = 0
    comparisonStrategy.forEach(() => matches.push([]))

    comparisonStrategy.forEach((comparisonFunction, strategyIndex) => {
        for (let itemIndex = 0; itemIndex < itemArray.length; itemIndex++) {
            if (limit && numberOfFound >= limit) {
                break
            }
            let comparisonScore = 0
            const foundShard = itemArray[itemIndex].shards.find(shard => {
                comparisonScore = comparisonFunction(searchString, shard.value)
                return comparisonScore
            })
            if (foundShard) {
                matches[strategyIndex].push(new SearchResult(
                    itemArray.splice(itemIndex, 1)[0].original,
                    foundShard.path,
                    foundShard.value,
                    findReverseTweenPoint(comparisonStrategy.length, strategyIndex + 1, comparisonScore)
                ))
                numberOfFound++
                itemIndex--
            }
        }
    })

    let result = []
    matches.forEach(hitArray => {
        result = [...result, ...hitArray]
    })

    return result
}