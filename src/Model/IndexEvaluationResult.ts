import Shard from "./Shard"

export default class IndexEvaluationResult {
    /** The shard where the match was found (null if no match was found) */
    shard: Shard|null
    /** The score of the match */
    score: number
    
    constructor(shard: Shard|null = null, score: number = 0) {
        this.shard = shard
        this.score = score
    }
}