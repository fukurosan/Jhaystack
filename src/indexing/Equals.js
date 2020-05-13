export default (dataset, validator) => {
    let result = []

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
                        if (!result[value]) {
                            result[value] = []
                        }
                        result[value].push({
                            item: item,
                            path: localPath,
                            depth: localPath.length
                        })
                    }
                }
            })
        }
        traverse(item)
    })

    return result
}