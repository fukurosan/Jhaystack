import Shard from "./Shard"

export default class SearchResult {
    shard: Shard|null
    relevance: number
    
    constructor(shard: Shard|null = null, relevance: number = 0) {
        this.shard = shard
        this.relevance = relevance
    }
}