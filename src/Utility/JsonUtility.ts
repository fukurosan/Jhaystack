import Shard from "../Model/Shard"

export interface ObjectLiteral {
	[key: string]: any
}

/**
 * Creates a deep copy of any object.
 * @param {any} object - Object to copy
 * @return {any} - Resulting copy
 */
export const deepCopyObject = (o: any): any => {
	if (o === null) {
		return o
	} else if (o instanceof Array) {
		const out: any[] = []
		for (const key in o) {
			const v = o[key]
			out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
		}
		return out
	} else if (typeof o === "object" && o !== {}) {
		const out: ObjectLiteral = {}
		for (const key in o) {
			const v = o[key]
			out[key] = typeof v === "object" && v !== null ? deepCopyObject(v) : v
		}
		return out
	} else if (o instanceof Date) {
		return new Date(o.getTime())
	} else {
		return o
	}
}

/**
 * Flattens any object into an array of shards, and sorts them by depth.
 * @param {any} object - Object to flatten
 * @return {Shard[]} - Resulting array of shards
 */
export const flattenObject = (object: any): Shard[] => {
	const result: Shard[] = []
	const traverse = (o: ObjectLiteral, path: string[] = []) => {
		Object.keys(o).forEach(key => {
			const newPath = [...path, key]
			const thisItem = o[key]
			if (thisItem !== null && thisItem !== undefined && typeof thisItem !== "object") {
				result.push(new Shard(o[key], newPath, <string>getLastNonNumericItemInArray(newPath)))
			} else if (thisItem !== null && typeof thisItem === "object") {
				traverse(thisItem, [...path, key])
			}
		})
	}
	if (object !== null && object !== undefined && typeof object !== "object") {
		result.push(new Shard(object, [], ""))
		return result
	}
	traverse(object)
	result.sort((a, b) => {
		if (a.path.length < b.path.length) return -1
		if (a.path.length > b.path.length) return 1
		return 0
	})
	return result
}

/**
 * Finds the last non-numeric value in an array.
 * @param {(string | number)[]} array - Array to search
 * @return {string | null} - Found value
 */
export const getLastNonNumericItemInArray = (array: (string | number)[]): string | null => {
	let lastValidKey
	let index = array.length - 1
	while (!lastValidKey) {
		if (index === -1) {
			lastValidKey = null
			break
		}
		if (Number.isNaN(+array[index])) {
			lastValidKey = <string>array[index]
		} else {
			index--
		}
	}
	return lastValidKey
}

/**
 * Merges multiple sorting functions into one function. If one sorting function resolves to 0, then the next sorting function will be executed.
 * @param {((a: any, b: any) => number)[]} sortFunctionArray - Array of functions to merge
 * @return {(a: any, b: any) => number} - Merged function
 */
export const mergeArraySortFunctions = (sortFunctionArray: ((a: any, b: any) => number)[]): ((a: any, b: any) => number) => {
	return (a: any, b: any) => {
		const result = 0
		for (let i = 0; i < sortFunctionArray.length; i++) {
			const sortValue = sortFunctionArray[i](a, b)
			if (sortValue !== 0) {
				return sortValue
			}
		}
		return result
	}
}
