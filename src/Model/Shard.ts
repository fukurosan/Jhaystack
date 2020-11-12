export default class Shard {
	/** The value */
	value: any
	/** The original (unprocessed) value */
	originalValue: any
	/** The path inside of the Item object used to find the value */
	path: string[]
	/** The last non-numeric property in the path - I.e. any potential array index removed */
	key: string
	/** The score multiplier of the shard */
	weight: number
	/** The normalized multiplier of the shard */
	normalizedWeight: number

	constructor(value: any, path: string[], key: string) {
		this.value = value
		this.originalValue = value
		this.path = path
		this.key = key
		this.weight = 1
		this.normalizedWeight = 1
	}
}
