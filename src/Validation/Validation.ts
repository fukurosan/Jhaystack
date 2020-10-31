/**
 * Evaluates if a path should be traversed during search or not.
 * If both inclusion and exclusion matches then exclusion takes precedence.
 * @param {string[]} path - Array of steps in the path
 * @param {(RegExp|string)[]} includedPaths - Regex (as a string or regex object) to the evaluated on a string representation of the path
 * @param {(RegExp|string)[]} excludedPaths - Regex (as a string or regex object) to the evaluated on a string representation of the path
 * @return {boolean} - Boolean indicating if the path should be included.
 */
export const pathValidator = (
	path: string[],
	includedPaths: (RegExp | string)[],
	excludedPaths: (RegExp | string)[]
): boolean => {
	const pathStr = path.toString().replace(/,/g, ".")
	if (includedPaths.length > 0 && excludedPaths.length > 0) {
		const includedMatch = includedPaths
			.map(regex => (typeof regex === "string" ? new RegExp(regex) : regex))
			.find(regex => regex.exec(pathStr))
		const excludeMatch = excludedPaths
			.map(regex => (typeof regex === "string" ? new RegExp(regex) : regex))
			.find(regex => regex.exec(pathStr))
		return (includedMatch ? true : false) && (excludeMatch ? false : true)
	} else if (includedPaths.length > 0 && excludedPaths.length === 0) {
		const includedMatch = includedPaths
			.map(regex => (typeof regex === "string" ? new RegExp(regex) : regex))
			.find(regex => regex.exec(pathStr))
		return includedMatch ? true : false
	} else if (includedPaths.length === 0 && excludedPaths.length > 0) {
		const excludeMatch = excludedPaths
			.map(regex => (typeof regex === "string" ? new RegExp(regex) : regex))
			.find(regex => regex.exec(pathStr))
		return excludeMatch ? false : true
	} else {
		return true
	}
}
