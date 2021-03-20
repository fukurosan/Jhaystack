import Declaration from "./Declaration"

export default class IndexEvaluationResult {
	/** The declaration where the match was found (null if no match was found) */
	declaration: Declaration
	/** The score of the match */
	score: number

	constructor(declaration: Declaration, score: number) {
		this.declaration = declaration
		this.score = score
	}
}
