import Index from "../Model/Index"

export default class FullTextIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "CONTAINS"
    }

    build() {
        const extractStringTokens = (string) => {
            let tokens = []
            let token = null
            const length = string.length
            for (let i = 0; i < length; i++) {
                token = ""
                for (let j = i; j < length; j++) {
                    token += string.charAt(j)
                    tokens.push(token)
                }
            }
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