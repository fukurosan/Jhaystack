import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export default class Shard {
    value: any
    path: string[]
    depth: number
    key: string

    constructor(value: any, path: string[]) {
        this.value = value
        this.path = path
        this.depth = this.path.length
        this.key = getLastNonNumericItemInArray(this.path)
    }
}