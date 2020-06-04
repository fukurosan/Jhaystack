export const pathValidator = (path: string[], includedPaths: (RegExp|string)[], excludedPaths: (RegExp|string)[]): boolean => {

    const pathStr = path.toString().replace(/,/g, ".")

    if (includedPaths.length > 0 && excludedPaths.length > 0) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return (includedMatch ? true : false) && (excludeMatch ? false : true)
    }
    else if (includedPaths.length > 0 && excludedPaths.length === 0) {
        let includedMatch = includedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return includedMatch ? true : false
    }
    else if (includedPaths.length === 0 && excludedPaths.length > 0) {
        let excludeMatch = excludedPaths.map(regex => typeof regex === "string" ? new RegExp(regex) : regex).find(regex => regex.exec(pathStr))
        return excludeMatch ? false : true
    }
    else {
        return true
    }

}