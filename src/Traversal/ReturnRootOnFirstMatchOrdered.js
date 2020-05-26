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
            const foundShard = itemArray[itemIndex].shards.find(shard => comparisonFunction(searchString, shard.value))
            if (foundShard) {
                matches[strategyIndex].push(new SearchResult(
                    itemArray.splice(itemIndex, 1)[0].original,
                    foundShard.path,
                    foundShard.value,
                    ((1 / comparisonStrategy.length) * (comparisonStrategy.length - strategyIndex))
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