import SearchResult from "../Model/SearchResult"
import Item from "../Model/Item"

export default (itemArrayIn: Item[], searchString: string, comparisonStrategy: ((term: string, context: any) => number)[], limit?: number): SearchResult[] => {
    const itemArray = [...itemArrayIn]
    let matches: SearchResult[][] = []
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

    let result: SearchResult[] = []
    matches.forEach(hitArray => {
        result = [...result, ...hitArray]
    })

    return result
}

const getRelevanceScore = (strategyLength: number, matchStrategyIndex: number, comparisonScore: number): number => {
    const scoreStartPosition = (1 / strategyLength) * (strategyLength - matchStrategyIndex + 1)
    const scoreEndPosition = (1 / strategyLength) * (strategyLength - matchStrategyIndex)
    const maximumMatchScore = scoreEndPosition - scoreStartPosition
    const score = maximumMatchScore * comparisonScore
    return scoreStartPosition + score
}