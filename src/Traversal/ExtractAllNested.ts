import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"

interface ObjectLiteral {
    [key: string]: any
}

export default (itemArray: Item[], searchString: string, comparisonStrategy: ((term: string, context: any) => boolean)[], limit?: number): SearchResult[] => {
    let result: SearchResult[] = []
    let numberOfFound = 0
    itemArray.forEach(item => {
        if (limit && numberOfFound >= limit) {
            return
        }
        item.shards.filter(shard => comparisonStrategy.find(comparisonFunction => comparisonFunction(searchString, shard.value)))
            .forEach(shard => {
                if (limit && numberOfFound >= limit) {
                    return
                }
                result.push(new SearchResult(
                    shard.path.slice(0, shard.path.length - 1).reduce((acc: ObjectLiteral, current) => { return acc[current] }, item.original),
                    [shard.path[shard.path.length - 1]],
                    shard.value
                ))
            })
        numberOfFound++
    })
    return result
}