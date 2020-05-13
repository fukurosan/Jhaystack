export default (dataset, validator) => {
    let result = []

    const extractStringTokens = (string) => {
        let tokens = []
        string.toUpperCase().split(" ").forEach(subString => {
            tokens.push(subString)
        })
        return tokens
    }

    dataset.forEach(item => {
        const traverse = (obj, path=[]) => {
            Object.keys(obj).forEach(key => {
                if (validator(key)) {
                    const localPath = [...path, key]
                    if (obj[key] !== null && typeof obj[key] === "object") {
                        traverse(obj[key], localPath)
                    }
                    else {
                        const value = ("" + obj[key]).toUpperCase()
                        const tokens = extractStringTokens(value)
                        tokens.forEach(token => {
                            if (!result[token]) {
                                result[token] = []
                            }
                            result[token].push({
                                item: item,
                                path: localPath,
                                depth: localPath.length
                            })
                        })
                    }
                }
            })
        }
        traverse(item)
    })

    return result
}