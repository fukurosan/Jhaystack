export const attributeValidator = (attribute, includedAttributesArr, ignoredAttributesArr) => {
    if (includedAttributesArr && includedAttributesArr.indexOf(attribute) > -1) {
        return true
    }
    else if (includedAttributesArr && includedAttributesArr.indexOf(attribute) === -1) {
        return false
    }
    else if (ignoredAttributesArr && ignoredAttributesArr.indexOf(attribute) === -1) {
        return true
    }
    else if (ignoredAttributesArr && ignoredAttributesArr.indexOf(attribute) > -1) {
        return false
    }
    else {
        return true
    }
}