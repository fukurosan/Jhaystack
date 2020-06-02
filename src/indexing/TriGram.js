import Index from "../Model/Index"
import IndexEvaluationResult from "../Model/IndexEvaluationResult"

export default class TriGramIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "TRIGRAM"
    }

    extractStringTokens(string) {
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

}