# Comparison Strategy

The comparison strategy defines how Jhaystack compares the search term with values to evaluate if it has found a match or not. You can configure Jhaystack to use different strategies depending on your needs by passing an array with the strategies that you want to use. The order of the provided strategies will help in determining the relevance of a match. A strategy with a lower index in the array will give a higher relevance.

Example:
```javascript
import { Jhaystack, ComparisonStrategy } from "jhaystack"

const data = [
    {
        name: "tony"
    },
    {
        name: "paddington"
    },
    {
        name: "a ton of ice cream"
    }
]

const options = {
    data: data,
    comparison: [ComparisonStrategy.STARTS_WITH, ComparisonStrategy.ENDS_WITH]
}

const se = new Jhaystack(options)
const result = se.search("ton")
//[{ path: ["name"], item: { name: "tony" }, value: "tony", relevance: 0.99999999, comparisonScore: 1, comparisonIndex: 0 }, { path: ["name"], item: { name: "paddington" }, value: "paddington", relevance: 0.49999999, comparisonScore: 1, comparisonIndex: 1 }]
```

!>Jhaystack comes with a bunch of built in strategies that you can use to fine tune your search. But you can also provide your own custom function. The function should return a number between 0 and 1 that determines the relevance of the match, 1 being a perfect match and 0 being no match at all.

A custom comparison function should take the following arguments:
- **term** The value to be searched for.
- **context** The value to be searched.

Example:
```javascript
const customStrategy = (term, context) => {
    return `${term}` === `${context}`
}
```
Note that the data type of both the term and context could be anything.

You can also nest the built in comparison functions in Jhaystack. This is useful if, for instance, you want to strategies to be of equal worth, or if you want to overwrite the default settings of the strategy. Joining strategies can often times have a positive impact on performance, since Jhaystack won't have to traverse through the dataset multiple times.

Example:
```javascript
import { Jhaystack, ComparisonStrategy } from "jhaystack"
const customStrategy = (term, context) => {
    return ComparisonStrategy.STARTS_WITH(term, context) || ComparisonStrategy.ENDS_WITH(term, context)
}
```  

---

Jhaystack currently comes with the following comparison strategies builtin:

> ## BITAP (default)
- **Case Sensitive**: `false`  

Determines if the term can be found inside of the context within a given levenshtein distance. 

Levenshtein distance is a way of describing the number of differences between two strings. 1 levenshtein distance means either one insertion, one removal, or one replacement of a character. For example, `"telephone"` is 3 steps away from `"elephant"` -> `(-t)eleph(o>a)n(e>t)`. In this particular implementation the algorithm will scan through the entire context to see if any contained sequence of characters match, rather than compare the values in their entirety. In this scenario `"telephone"` will actually be 2 steps away, because the algorithm will start comparing from the second character: `"elephone"`.

This implementation will find the first best result inside of the context. This means that if there is a better match later on in the context this will be missed. If your use case requires a perfectly evaluated result then refer to `BITAP_FULL`.

Relevance is primarily based on the levenshtein distance of the match, and secondarily on the match distance from context index 0.

The following additional arguments can be passed to this function:
 - **maxErrors** 
  - **Description**: *Maximum levenshtein distance*
  - **Type**: `Integer`
  - **Default**: `2`
 - **isPositionRelevant**
  - **Description**: *Should the position in the context where the match was found be taken into account when calculating the relevance?*
  - **Type**: `Boolean`
  - **Default**: `true`

---

> ## BITAP_FULL
- **Case Sensitive**: `false`  

Determines the best possible match of the term inside of the context, within a given levenshtein distance. This implementation will find the best possible result inside of the context. This may be necessary in some scenarios, but be weary that it may have an impact on search performance with long values.

Relevance is primarily based on the levenshtein distance of the match, and secondarily on the match distance from context index 0.

The following additional arguments can be passed to this function:
 - **maxErrors** 
  - **Description**: *Maximum levenshtein distance*
  - **Type**: `Integer`
  - **Default**: `2`
 - **isPositionRelevant**
  - **Description**: *Should the position in the context where the match was found be taken into account when calculating the relevance?*
  - **Type**: `Boolean`
  - **Default**: `true`

---

> ## FUZZY_SEQUENCE
- **Case Sensitive**: `false`

Determines if all letters of the term exist somewhere inside the context, in the given order but not necessarily right after each other.

For example, the context `"telephone aunt"` would match with `"elephant"` because `t(eleph)one (a)u(nt)`

Relevance will be based on the total distance between the characters.

---

> ## CONTAINS_ALL_WORDS
- **Case Sensitive**: `false`

Determines if all the words in the term are contained inside of the context.

For example, the context  `"I am eating cake next week"` would match with the term `"Next week I am eating cake"`

---

> ## STARTS_WITH
- **Case Sensitive**: `true`

Determines if the context starts with the term.

---

> ## STARTS_WITH_CASE_INSENSITIVE
- **Case Sensitive**: `false`

Determines if the context starts with the term.

---

> ## ENDS_WITH
- **Case Sensitive**: `true`

Determines if the context ends with the term.

---

> ## ENDS_WITH_CASE_INSENSITIVE
- **Case Sensitive**: `false`

Determines if the context ends with the term.

---

> ## CONTAINS
- **Case Sensitive**: `true`

Determines if the context contains the term.

---

> ## CONTAINS_CASE_INSENSITIVE
- **Case Sensitive**: `false`

Determines if the context contains the term.

---

> ## EQUALS
- **Case Sensitive**: `true`
Determines if the term is exactly the context.

---

> ## EQUALS_CASE_INSENSITIVE
- **Case Sensitive**: `false`

Determines if the term is exactly the context.