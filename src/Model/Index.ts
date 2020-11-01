import Shard from "./Shard"
import IndexEvaluationResult from "./IndexEvaluationResult"

interface IndexMap {
	[key: string]: Shard[]
}

export interface IIndex {
	new (shards: Shard[]): Index
}

export default abstract class Index {
	/** A tag that labels the index (essentially a name) */
	abstract tag: string
	/**
	 * Takes a string and breaks it down into sub-components.
	 * Every index works slightly different, so the implementation of this is left up to the extended class.
	 * @param {string} string - The string to be broken down
	 * @return {string[]} - An array of sub-component strings
	 */
	abstract extractStringTokens(string: string): string[]

	shards: Shard[] = []
	index: IndexMap

	constructor(shards: Shard[]) {
		this.shards = shards
		this.index = {}
		this.build()
	}

	/**
	 * Builds the index map using the extractStringTokens function.
	 * Each extracted sub-component becomes a key to an array, containing all shards that match said sub-component.
	 **/
	build(): void {
		this.index = {}
		this.shards.forEach(shard => {
			const value = `${shard.value}`.toUpperCase()
			const tokens = this.extractStringTokens(value)
			tokens.forEach(token => {
				if (!this.index[token]) {
					this.index[token] = []
				}
				this.index[token].push(shard)
			})
		})
	}

	/**
	 * Evaluates a search value against the index.
	 * Score is evaluated by building an index of the term, and then seeing if any shards match the same index keys within a certain range.
	 * @param {any} term - The term that should be evaluated
	 */
	evaluate(term: any): IndexEvaluationResult {
		const termTokens = this.extractStringTokens(`${term}`.toUpperCase())
		const indexQueryResult = new Map()
		for (let i = 0; i < termTokens.length; i++) {
			const shardArray = this.index[termTokens[i]]
			if (shardArray) {
				for (let j = 0; j < shardArray.length; j++) {
					const shard = shardArray[j]
					if (!indexQueryResult.has(shard)) {
						indexQueryResult.set(shard, 1)
					} else {
						indexQueryResult.set(shard, indexQueryResult.get(shard) + 1)
					}
				}
			}
		}

		const bestMatch = [...indexQueryResult.keys()].reduce((acc: IndexEvaluationResult, key) => {
			if (indexQueryResult.get(key) > acc.score) {
				return new IndexEvaluationResult(key, indexQueryResult.get(key)) //This is not really a result, but the data structure is identical
			} else {
				return acc
			}
		}, new IndexEvaluationResult(null, 0))

		if (bestMatch.score === 0) {
			return new IndexEvaluationResult(null, 0)
		} else if (bestMatch.score === termTokens.length) {
			return new IndexEvaluationResult(bestMatch.shard, 1)
		}

		const matchRatio = bestMatch.score / termTokens.length
		return matchRatio > 0.25 ? new IndexEvaluationResult(bestMatch.shard, matchRatio) : new IndexEvaluationResult(null, 0)
	}

	/**
	 * Removes any existing index and builds a new index based on the provided shards.
	 * @param {Shard[]} shards - Array of shards that the index should be built on
	 */
	setShards(shards: Shard[]): void {
		this.shards = shards
		this.build()
	}
}
