# Specifying Filters

Jhaystack by default scans all nested properties for value matches, but can be configured to include or exclude different path/value patterns. You do this by providing an array of filter functions. Each filter function will receive two argument: a `property path` in the form of an `array of strings` as well as the `value` found on the property path in its raw, `original form`. The filter function should return a boolean, whereif true the path/value is valid, and if false it isn't.

Path/value combination that pass all filters will be traversed and searched. Combination that fail one or more tests will not be searched.

!> **Tip**  
*Note that array indexes will also be represented in the path array.*
  
You can specify the filters using the `filters` option or using the setFilters option.  
  
Example:
```javascript
import { Jhaystack } from "jhaystack"

const data = [
    {
        name: "tom"
    },
    {
        otherNameAttribute: "tim"
    }
]

const optionsInclusive = {
    data: data,
    filters: [(path, value) => /^other/.test(path.join("."))]
}
const seInc = new Jhaystack(optionsInclusive)

const optionsExclusive = {
    data: data,
    filters: [(path, value) => !/^other/.test(path.join("."))]
}
const seExc = new Jhaystack(optionsExclusive)

const resultsIncluded = seInc.search("tm")
//[{ path: ["otherNameAttribute"], item: { otherNameAttribute: "tim" }, value: "tim", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
const resultsExcluded = seExc.search("tm")
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
```
