export default (dataset, validator) => {
    let result = []

    const extractStringTokens = (string) => {
        let tokens = []
        let token = null
        const length = string.length
        for (let i = 0; i < length; i++) {
            token = ""
            for (let j = i; j < length; j++) {
                token += string.charAt(j)
                tokens.push(token)
            }
        }
        return tokens
    }

    dataset.forEach(item => {
        const traverse = (obj, path) => {
            Object.keys(obj).forEach(key => {
                if (validator(key)) {
                    const localPath = path ? [...path, key] : [key]
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