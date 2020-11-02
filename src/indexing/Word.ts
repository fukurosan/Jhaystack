import Index from "../Model/Index"
import Shard from "../Model/Shard"

export default class WordIndex extends Index {
	tag: string

	constructor(shards: Shard[]) {
		super(shards)
		this.tag = "WORD"
	}

	extractStringTokens(string: string) {
		return string.toUpperCase().split(" ")
	}
}
