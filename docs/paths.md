# Specifying Paths

Jhaystack by default scans all attributes and paths for the given search term match, but can be configured to include or exclude different path patterns. You do this by providing an array of regular expressions (either as `RegExp objects`, or as `strings`). The expressions provided will be evaluated against a string representation of the path inside the JSON object. The string will be formatted with a "." separating each step in the structure. An exclude pattern will always take precedence over an include pattern.

!> Note that arrays will also be represented in the pattern.
  
You can specify the included and excluded paths using the `includedPaths` and `excludedPaths` option.  
  
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

const optionsInc = {
    data: data,
    includedPaths: [/^other/]
}
const seInc = new Jhaystack(optionsInc)

const optionsExc = {
    data: data,
    excludedPaths: [/^other/]
}
const seExc = new Jhaystack(optionsExc)

const resultsIncluded = seInc.search("tm")
//[{ path: ["otherNameAttribute"], item: { otherNameAttribute: "tim" }, value: "tim", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
const resultsExcluded = seExc.search("tm")
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
```
