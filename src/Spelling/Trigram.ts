import ISpelling from "../Model/ISpelling"
import { nGram } from "../Utility/ngram"

interface IndexMap {
	[key: string]: string[]
}

export class TRIGRAM_SPELLER implements ISpelling {
	private index: IndexMap = {}

	extractTokens(string: any) {
		return Array.from(nGram(string, 3, 3, false, false))
	}

	build(values: any[]) {
		this.index = {}
		values.forEach(originValue => {
			const value = `${originValue}`.toUpperCase()
			const tokens = this.extractTokens(value)
			tokens.forEach(token => {
				if (!this.index[token]) {
					this.index[token] = []
				}
				this.index[token].push(originValue)
			})
		})
	}

	/**
	 * Evaluates a value against the index.
	 * Score is evaluated by building an index of the term, and then seeing if any declarations match the same index keys within a certain range.
	 * @param {any} value - The term that should be evaluated
	 */
	evaluate(value: any): string | null {
		const termTokens = this.extractTokens(`${value}`.toUpperCase())
		const indexQueryResult = new Map<string, number>()
		for (let i = 0; i < termTokens.length; i++) {
			const valueArray = this.index[termTokens[i]]
			if (valueArray) {
				for (let j = 0; j < valueArray.length; j++) {
					const value = valueArray[j]
					if (!indexQueryResult.has(value)) {
						indexQueryResult.set(value, 1)
					} else {
						indexQueryResult.set(value, indexQueryResult.get(value)! + 1)
					}
				}
			}
		}
		const suggestion = Array.from(indexQueryResult.keys()).reduce(
			(acc, key) => {
				const matchRatio = indexQueryResult.get(key)! / termTokens.length
				if (matchRatio > acc[1]) {
					return [key, matchRatio]
				}
				return acc
			},
			["", 0]
		)
		if (suggestion[1] > 0.25) {
			return <string>suggestion[0]
		}
		return null
	}
}
