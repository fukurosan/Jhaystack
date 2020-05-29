import SearchResult from "../Model/SearchResult"

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
                    getRelevanceScore(comparisonStrategy.length, strategyIndex, comparisonScore)
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

const getRelevanceScore = (strategyLength, matchStrategyIndex, comparisonScore) => {
    const scoreStartPosition = (1 / strategyLength) * (strategyLength - matchStrategyIndex + 1)
    const scoreEndPosition = (1 / strategyLength) * (strategyLength - matchStrategyIndex)
    const maximumMatchScore = scoreEndPosition - scoreStartPosition
    const score = maximumMatchScore * comparisonScore
    return scoreStartPosition + score
}