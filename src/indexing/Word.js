import Index from "../Model/Index"
import IndexEvaluationResult from "../Model/IndexEvaluationResult"

export default class WordIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "WORD"
    }

    extractStringTokens(string) {
        return string.toUpperCase().split(" ")
    }
}