export const pathValidator = (path, includedPaths, excludedPaths) => {

    const pathStr = path.toString().replace(/,/g, ".")

    if (includedPaths && excludedPaths) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return includedMatch && !excludeMatch
    }
    else if (includedPaths && !excludedPaths) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return includedMatch ? true : false
    }
    else if (!includedPaths && excludedPaths) {
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return excludeMatch ? false : true
    }
    else {
        return true
    }

}