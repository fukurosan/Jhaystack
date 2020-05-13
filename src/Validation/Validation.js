export const attributeValidator = (path, includedAttributesMap, ignoredAttributesMap) => {
    if (includedAttributesMap || ignoredAttributesMap) {
        let lastValidKey
        let index = path.length - 1
        while (!lastValidKey) {
            if (index === -1) {
                lastValidKey = path[path.length - 1]
                break
            }
            if (Number.isNaN(+path[index])) {
                lastValidKey = path[index]
            }
            else {
                index--
            }
        }
        if (includedAttributesMap && includedAttributesMap[lastValidKey]) {
            return true
        }
        else if (includedAttributesMap && !includedAttributesMap[lastValidKey]) {
            return false
        }
        else if (ignoredAttributesMap && !ignoredAttributesMap[lastValidKey]) {
            return true
        }
        else if (ignoredAttributesMap && ignoredAttributesMap[lastValidKey]) {
            return false
        }
        else {
            return true
        }
    }
    else {
        return true
    }
}