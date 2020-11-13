import Index from "../Model/Index"
import Shard from "../Model/Shard"

/**
 * Index strategy that will check for the existance of all the provided words.
 */
export class WordIndex extends Index {
	tag: string

	constructor(shards: Shard[]) {
		super(shards)
		this.tag = "WORD"
	}

	extractStringTokens(string: string) {
		return string.toUpperCase().split(" ")
	}
}
