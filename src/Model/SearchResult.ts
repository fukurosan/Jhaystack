import { ObjectLiteral } from "../Utility/JsonUtility"

export default class SearchResult {
	/** The item where the result was found */
	item: ObjectLiteral
	/** The path to the matched value */
	path: (string | number)[]
	/** The value that matched */
	value: any
	/** The relevance of the match */
	relevance: number
	/** The score from the value comparison function */
	comparisonScore: number
	/** The index of the comparison function that found the match */
	comparisonIndex: number

	constructor(
		item: ObjectLiteral,
		path: (string | number)[],
		value: any,
		relevance: number,
		comparisonScore: number,
		comparisonIndex: number
	) {
		this.item = item
		this.path = path
		this.value = value
		this.relevance = relevance
		this.comparisonScore = comparisonScore
		this.comparisonIndex = comparisonIndex
	}
}
