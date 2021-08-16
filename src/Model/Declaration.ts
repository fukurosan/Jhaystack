import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export default class Declaration {
	/** The value */
	value: any
	/** The original (unprocessed) value */
	originValue: any
	/** The path inside of the Item object used to find the value */
	path: (string | number)[]
	/** The last non-numeric property in the path - I.e. any potential array index removed */
	key: string | null
	/** The score multiplier of the declaration */
	weight: number
	/** The normalized multiplier of the declaration */
	normalizedWeight: number

	constructor(value: any, path: (string | number)[]) {
		this.value = value
		this.originValue = value
		this.path = path
		this.key = getLastNonNumericItemInArray(path)
		this.weight = 1
		this.normalizedWeight = 1
	}

	get normalizedPath() {
		return this.path.filter(field => typeof field === "string").join(".")
	}
}
