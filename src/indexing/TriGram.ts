import Index from "../Model/Index"
import Shard from "../Model/Shard"

export default class TriGramIndex extends Index {
	tag: string

	constructor(shards: Shard[]) {
		super(shards)
		this.tag = "TRIGRAM"
	}

	extractStringTokens(string: string) {
		const tokens = []
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
