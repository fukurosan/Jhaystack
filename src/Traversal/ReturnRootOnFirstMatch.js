import SearchResult from "../Model/SearchResult"

export default (itemArray, searchString, comparisonStrategy, limit) => {
    let result = []
    let numberOfFound = 0
    itemArray.forEach(item => {
        if (limit && numberOfFound >= limit) {
            return
        }
        const foundShard = item.shards.find(shard => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, shard.value)))
        if (foundShard) {
            result.push(new SearchResult(
                item.original,
                foundShard.path,
                foundShard.value
            ))
            numberOfFound++
        }
    })
    return result
}