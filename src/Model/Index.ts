import Shard from "./Shard"

interface IndexMap {
    [key: string]: Shard[]
}

export default abstract class Index {
    abstract tag: string = "NOT SET"
    abstract build(): void

    shards: Shard[] = []
    index: IndexMap

    constructor(shards: Shard[]) {
        this.shards = shards
        this.index = {}
        this.build()
    }

    evaluate(term: string): Shard[] {
        return this.index[term]
    }

    setShards(shards: Shard[]) {
        this.shards = shards
        this.build()
    }
}