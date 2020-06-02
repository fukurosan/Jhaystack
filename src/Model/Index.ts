import Shard from "./Shard"
import IndexEvaluationResult from "./IndexEvaluationResult"

interface IndexMap {
    [key: string]: Shard[]
}

export default abstract class Index {
    abstract tag: string = "NOT SET"
    abstract extractStringTokens(string: string): string[]

    shards: Shard[] = []
    index: IndexMap

    constructor(shards: Shard[]) {
        this.shards = shards
        this.index = {}
        this.build()
    }

    build() {
        this.index = {}
        this.shards.forEach(shard => {
            const value = (`${shard.value}`).toUpperCase()
            const tokens = this.extractStringTokens(value)
            tokens.forEach(token => {
                if (!this.index[token]) {
                    this.index[token] = []
                }
                this.index[token].push(shard)
            })
        })
    }

    evaluate(term: string) {
        const termTokens = this.extractStringTokens(`${term}`.toUpperCase())
        let indexQueryResult = new Map()
        for (let i = 0; i < termTokens.length; i++) {
            const shardArray = this.index[termTokens[i]]
            if (shardArray) {
                for (let j = 0; j < shardArray.length; j++) {
                    const shard = shardArray[j]
                    if (!indexQueryResult.has(shard)) {
                        indexQueryResult.set(shard, 1)
                    }
                    else {
                        indexQueryResult.set(shard, indexQueryResult.get(shard) + 1)
                    }
                }
            }
        }

        let bestMatch = [...indexQueryResult.keys()].reduce((acc, key) => {
            if (indexQueryResult.get(key) > acc.relevance) {
                return new IndexEvaluationResult(key, indexQueryResult.get(key)) //This is not really a result, but the data structure is identical
            }
            else {
                return acc
            }
        }, new IndexEvaluationResult(null, 0))

        if (bestMatch.relevance === 0) {
            return new IndexEvaluationResult(null, 0)
        }
        else if (bestMatch.relevance === termTokens.length) {
            return new IndexEvaluationResult(bestMatch.shard, 1)
        }

        const matchRatio = bestMatch.relevance / (termTokens.length - 2)
        return matchRatio > 0.25 ? new IndexEvaluationResult(bestMatch.shard, matchRatio) : new IndexEvaluationResult(null, 0)
    }

    setShards(shards: Shard[]) {
        this.shards = shards
        this.build()
    }
}