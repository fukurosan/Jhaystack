import { ObjectLiteral } from "../Utility/JsonUtility"

export default class SearchResult {
	/** The item where the result was found */
	item: ObjectLiteral
	/** The index of the item in the original array */
	itemIndex: number
	/** The path to the matched value */
	path: (string | number)[]
	/** The value that matched */
	value: any
	/** The relevance of the match */
	relevance: number
	/** The score from the value comparison function */
	score: number
	/** The weight of the result */
	weight: number
	/** The normalized weight of the result (0-1) */
	normalizedWeight: number
	/** Potential meta data from the comparison function */
	metaData: ObjectLiteral | null

	constructor(
		item: ObjectLiteral,
		index: number,
		path: (string | number)[],
		value: any,
		relevance: number,
		score: number,
		weight: number,
		normalizedWeight: number,
		metaData?: ObjectLiteral | null
	) {
		this.item = item
		this.itemIndex = index
		this.path = path
		this.value = value
		this.relevance = relevance
		this.score = score
		this.weight = weight
		this.normalizedWeight = normalizedWeight
		this.metaData = {}
		metaData && delete metaData.score && (this.metaData = metaData)
	}
}
