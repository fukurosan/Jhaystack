# Sorting Strategy

The sorting strategy defines how Jhaystack sorts the search results. By default Jhaystack will order results by relevance. To configure the sorting strategy you provide Jhaystack with an array of sorting functions that will be evaluated in order of the array index. In other words, first sort by A, then B, then C, and so on.

Example:
```javascript
import { Jhaystack, SortingStrategy } from "jhaystack"

const data = [
    {
        child: {
            name: "timmy"
        }
    },
    {
        name: "tony"
    },
    {
        name: "timmy"
    }
]

const options = {
    data: data,
    sorting: [SortingStrategy.RELEVANCE.DESCENDING, SortingStrategy.DEPTH.ASCENDING]
}

const se = new Jhaystack(options)
const result = se.search("toy")
//[{ path: ["name"], item: { name: "tony" }, value: "tony", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }, { path: ["name"], item: { name: "timmy" }, value: "timmy", relevance: 0.6666666616666667, comparisonScore: 0.3333333233333333, comparisonIndex: 0 }, { path: ["child", "name"], item: { child: { name: "timmy" } }, value: "timmy", relevance: 0.6666666616666667, comparisonScore: 0.3333333233333333, comparisonIndex: 0 }]
```

Jhaystack currently comes with the following sorting strategies:

Strategy | Description
--- | ---
COMPARISON_INDEX   |   Sorts by the index of the comparison function that found the match
COMPARISON_SCORE   |   Sorts by the score of the comparison function that found that match
VALUE   |   Sorts by the value of the found match.
PROPERTY   |   Sorts by the name of the property where the match was found.
DEPTH   |   Sorts by the depth of the match.
RELEVANCE   |   Sorts by the relevance of the match.

?> Each built in sorting strategy can be executed in either ascending or descending order. This is done by adding ".ASCENDING" or ".DESCENDING" after the given strategy. See the example above.

!> **Tip**  
*You can easily provide your own custom sorting function as well by specifying a valid javascript array sorting function.*

Example:
```javascript
import { SortingStrategy } from "jhaystack"
const myCustomStrategy = (a, b) => {
		if (typeof a.item === "object" && typeof b.item !== "object") return 1
		if (typeof a.item !== "object" && typeof b.item === "object") return -1
		return 0
const sortingStrategy = [myCustomStrategy, SortingStrategy.RELEVANCE.DESCENDING]
```
