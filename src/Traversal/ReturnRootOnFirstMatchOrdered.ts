import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"

export default (itemArrayIn: Item[], searchString: string, comparisonStrategy: ((term: string, context: any) => boolean)[], limit?: number): SearchResult[] => {
    const itemArray = [...itemArrayIn]
    let matches: SearchResult[][] = []
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
                    foundShard.value
                ))
                numberOfFound++
                itemIndex--
            }
        }
    })

    let result: SearchResult[] = []
    matches.forEach(hitArray => {
        result = [...result, ...hitArray]
    })

    return result
}