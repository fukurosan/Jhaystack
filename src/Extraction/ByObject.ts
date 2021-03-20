import Declaration from "../Model/Declaration"

/**
 * Returns a single array containing all relevant values as declarations
 * @param {any} value - The value
 * @return {Declaration[][]} - The list of declarations produced sorted by depth.
 */
export const BY_OBJECT = (value: any): Declaration[][] => {
	const declarations: Declaration[] = []
	const traverse = (data: any, path: (string | number)[] = []) => {
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				traverse(data[i], [...path, i])
			}
		} else if (typeof data === "object" && data) {
			for (const key in data) {
				traverse(data[key], [...path, key])
			}
		} else {
			declarations.push(new Declaration(data, path))
		}
	}
	if ((typeof value !== "object" || value === null) && !Array.isArray(value)) {
		declarations.push(new Declaration(value, []))
	} else {
		traverse(value)
	}
	declarations.sort((a, b) => {
		if (a.path.length < b.path.length) return -1
		if (a.path.length > b.path.length) return 1
		return 0
	})
	return [declarations]
}
