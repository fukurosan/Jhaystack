import Index from "../Model/Index"
import Declaration from "../Model/Declaration"

/**
 * An n-gram index where n = 3. Will use character combinations in sets of 3 to determine similarity between values.
 */
export class TriGramIndex extends Index {
	tag: string

	constructor(declarations: Declaration[]) {
		super(declarations)
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
