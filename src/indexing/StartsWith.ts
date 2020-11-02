import Index from "../Model/Index"
import Shard from "../Model/Shard"
import IndexEvaluationResult from "../Model/IndexEvaluationResult"

export default class StartsWithIndex extends Index {
	tag: string

	constructor(shards: Shard[]) {
		super(shards)
		this.tag = "STARTS_WITH"
	}

	extractStringTokens(string: string) {
		const tokens = []
		const length = string.length
		for (let i = 0; i < length; i++) {
			tokens.push(string.slice(0, i + 1).toUpperCase())
		}
		return tokens
	}

	evaluate(term: unknown): IndexEvaluationResult {
		const results = this.index[`${term}`.toUpperCase()]
		if (results) {
			const resultShard = results.reduce((shortestShard: Shard, shard: Shard, index) => {
				if (index === 0) {
					return shard
				}
				return shard.value > shortestShard.value ? shard : shortestShard
			}, new Shard(null, [], ""))
			return new IndexEvaluationResult(resultShard, 1)
		} else {
			return new IndexEvaluationResult(null, 0)
		}
	}
}
