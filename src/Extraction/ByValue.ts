import Declaration from "../Model/Declaration"

/**
 * Returns one array for each declaration, effectively treating each declaration as a separate document.
 * @param {any} value - The value
 * @return {Declaration[][]} - The list of declarations produced sorted by depth.
 */
export const BY_VALUE = (value: any): Declaration[][] => {
	const declarations: Declaration[][] = []
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
			declarations.push([new Declaration(data, path)])
		}
	}
	if ((typeof value !== "object" || value === null) && !Array.isArray(value)) {
		declarations.push([new Declaration(value, [])])
	} else {
		traverse(value)
	}
	declarations.sort((a, b) => {
		if (a[0].path.length < b[0].path.length) return -1
		if (a[0].path.length > b[0].path.length) return 1
		return 0
	})
	return declarations
}
