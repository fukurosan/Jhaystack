import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export const attributeValidator = (path, includedAttributesMap, ignoredAttributesMap) => {
    if (includedAttributesMap || ignoredAttributesMap) {
        let lastValidKey = getLastNonNumericItemInArray(path)
        if(!lastValidKey) {
            return false
        }
        else if (includedAttributesMap && includedAttributesMap[lastValidKey]) {
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