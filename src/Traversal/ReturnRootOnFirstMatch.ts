import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"

export default (itemArray: Item[], searchString: string, comparisonStrategy: ((term: string, context: any) => boolean)[], limit?: number): SearchResult[] => {
    let result: SearchResult[] = []
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
                foundShard.value,
                1
            ))
            numberOfFound++
        }
    })
    return result
}