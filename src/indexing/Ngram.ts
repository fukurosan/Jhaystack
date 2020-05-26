import Index from "../Model/Index"
import Shard from "../Model/Shard"

export default class EqualsIndex extends Index {
    tag: string
    
    constructor(shards: Shard[]) {
        super(shards)
        this.tag = "NGRAM"
    }

    build() {
        const extractStringTokens = (string: string) => {
            let tokens = []
            let token = null
            const length = string.length
            for (let i = 0; i < length; i++) {
                const before = string.charAt(i - 1)
                const character = string.charAt(i)
                const after = string.charAt(i + 1)
                token = `${before}${character}${after}`
                if (token.length === 3) {
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