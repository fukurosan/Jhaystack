import Index from "../Model/Index"
import Shard from "../Model/Shard"

/**
 * Index strategy that will allow for equality lookup
 */
export class ValueIndex extends Index {
	tag: string

	constructor(shards: Shard[]) {
		super(shards)
		this.tag = "VALUE"
	}

	extractStringTokens(string: string) {
		return [string]
	}
}
