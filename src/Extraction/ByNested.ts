import Declaration from "../Model/Declaration"

/**
 * Returns one array per nested object, containing all relevant values as declarations. An array does not qualify as an object.
 * @param {any} value - The value
 * @return {Declaration[][]} - The list of declarations produced sorted by depth.
 */
export const BY_NESTED_OBJECT = (value: any): Declaration[][] => {
	const declarations: Declaration[][] = []
	const traverse = (data: any, path: (string | number)[] = [], nestedDeclarations: Declaration[]) => {
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				traverse(data[i], [...path, i], nestedDeclarations)
			}
		} else if (typeof data === "object" && data) {
			const newNestedObject: Declaration[] = []
			declarations.push(newNestedObject)
			for (const key in data) {
				traverse(data[key], [...path, key], newNestedObject)
			}
		} else {
			nestedDeclarations.push(new Declaration(data, path))
		}
	}
	if ((typeof value !== "object" || value === null) && !Array.isArray(value)) {
		declarations.push([new Declaration(value, [])])
	} else {
		const newNestedObject: Declaration[] = []
		declarations.push(newNestedObject)
		traverse(value, [], newNestedObject)
	}
	for (let i = 0; i < declarations.length; i++) {
		declarations[i].sort((a, b) => {
			if (a.path.length < b.path.length) return -1
			if (a.path.length > b.path.length) return 1
			return 0
		})
	}
	return declarations.filter(nestedObject => nestedObject.length > 0)
}
