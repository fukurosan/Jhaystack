import Index from "../Model/Index"

export default class ValueIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "VALUE"
    }

    extractStringTokens(string) {
        return [string]
    }
}