import Index from "../Model/Index"

export default class FullTextIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "FULL_TEXT"
    }

    build() {
        const extractStringTokens = (string) => {
            let tokens = []
            string.toUpperCase().split(" ").forEach(subString => {
                tokens.push(subString)
            })
            return tokens
        }

        this.index = {}
        this.shards.forEach(shard => {
            const value = ("" + shard.value).toUpperCase()
            const tokens = extractStringTokens(value)
            tokens.forEach(token => {
                if (!this.index[token]) {
                    this.index[token] = []
                }
                this.index[token].push(shard)
            })
        })
    }
}