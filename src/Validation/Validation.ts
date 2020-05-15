export const pathValidator = (path: String[], includedPaths?: (RegExp|String)[]|null, excludedPaths?: (RegExp|String)[]|null) => {

    const pathStr = path.toString().replace(/,/g, ".")

    if (includedPaths && excludedPaths) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => (<RegExp>regex).exec(pathStr))
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => (<RegExp>regex).exec(pathStr))
        return includedMatch && !excludeMatch
    }
    else if (includedPaths && !excludedPaths) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => (<RegExp>regex).exec(pathStr))
        return includedMatch ? true : false
    }
    else if (!includedPaths && excludedPaths) {
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => (<RegExp>regex).exec(pathStr))
        return excludeMatch ? false : true
    }
    else {
        return true
    }

}