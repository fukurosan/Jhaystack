import Index from "../Model/Index"
import Declaration from "../Model/Declaration"

/**
 * Index strategy that will allow for equality lookup
 */
export class ValueIndex extends Index {
	tag: string

	constructor(declarations: Declaration[]) {
		super(declarations)
		this.tag = "VALUE"
	}

	extractStringTokens(string: string) {
		return [string]
	}
}
