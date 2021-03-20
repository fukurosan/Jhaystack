import Index from "../Model/Index"
import Declaration from "../Model/Declaration"

/**
 * Index strategy that will check for the existance of all the provided words.
 */
export class WordIndex extends Index {
	tag: string

	constructor(declarations: Declaration[]) {
		super(declarations)
		this.tag = "WORD"
	}

	extractStringTokens(string: string) {
		return string.toUpperCase().split(" ")
	}
}
