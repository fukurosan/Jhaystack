import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export default class Shard {
    /** The value */
    value: any
    /** The path inside of the Item object used to find the value */
    path: string[]
    /** The last non-numeric property in the path - I.e. any potential array index removed */
    key: string

    constructor(value: any, path: string[]) {
        this.value = value
        this.path = path
        this.key = <string> getLastNonNumericItemInArray(this.path)
    }
}