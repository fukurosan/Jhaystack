# Comparison Strategy

The comparison strategy defines how Jhaystack compares the search term with values to evaluate if it has found a match or not. You can configure Jhaystack to use different comparison functions depending on your needs. The order of the provided functions will help in determining the relevance of a match. A function with a lower index in the array will result in a higher relevance.

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

!> **Tip**  
*Jhaystack comes with a bunch of built in comparison functions that you can use to fine tune your search. But you can also provide your own custom function. The function should either return a number between 0 and 1 that determines the relevance of the match, 1 being a perfect match and 0 being no match at all, or an object with a mandatory property called score that should contain the aforementioned number. Any additional information stored in the object will be made available inside of the search result metadata object.*

A custom comparison function should take the following arguments:
- **term** The value to be searched for.
- **context** The value to be searched.

Example:
```javascript
const customStrategy = (term, context) => {
    return `${term}` === `${context}` ? 1 : 0
}
const customStrategyWithMetaData = (term, context) => {
    return `${term}` === `${context}` ? { score: 1 } : { score: 0 }
}
```
Note that the data type of both the term and context could be anything.

You can also nest the built in comparison functions in Jhaystack. This is useful if, for instance, you want two comparison functions to be of equal worth, or if you want to overwrite the default settings of the built in function. Joining strategies can often times have a positive impact on performance, since Jhaystack won't have to traverse through the dataset multiple times.

Example:
```javascript
import { Jhaystack, ComparisonStrategy } from "jhaystack"
const customStrategy = (term, context) => {
    return ComparisonStrategy.STARTS_WITH(term, context) || ComparisonStrategy.ENDS_WITH(term, context)
}
```  

---

Jhaystack currently comes with the following comparison strategies built in:

> ## BITAP (default)
- **Scoring**: `Relative`  

Determines if the term can be found inside of the context within a given levenshtein distance. Can either be configured to do a full scan of the context to find the best possible match, or a partial scan where it settles for the first match of the provided criteria.

Levenshtein distance is a way of describing the number of differences between two strings. 1 levenshtein distance means either one insertion, one removal, or one replacement of a character. For example, `"telephone"` is 3 steps away from `"elephant"` -> `(-t)eleph(o>a)n(e>t)`. In this particular implementation the algorithm will scan through the entire context to see if any contained sequence of characters match, rather than compare the values in their entirety. In this scenario `"telephone"` will actually be 2 steps away, because the algorithm will start comparing from the second character: `"elephone"`.

Relevance is primarily based on the levenshtein distance of the match, and secondarily on the size of the context as well as the match distance from context index 0.

This comparison function can only handle search values that are up to 32 characters long. Longer search values will be automatically substringed by the function.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`
 - **isFullScan** 
  - **Description**: *Should the entire context be scanned to find the best possible match (full scan), or should the best first possible match be used (partial scan)?*
  - **Type**: `boolean`
  - **Default**: `true`
 - **maxErrors** 
  - **Description**: *Maximum levenshtein distance*
  - **Type**: `Integer`
  - **Default**: `2`
 - **isPositionRelevant**
  - **Description**: *Should the position in the context where the match was found be taken into account when calculating the relevance?*
  - **Type**: `Boolean`
  - **Default**: `true`
 - **isContextSizeRelevant**
  - **Description**: *Should the size of the context where the match was found be taken into account when calculating the relevance? Usually a smaller context will mean a more relevant match. This could be names, titles, and so on.*
  - **Type**: `Boolean`
  - **Default**: `true`

The following meta data will be provided by this function:
 - **k**:
  - **Description**: *The levenshtein distance*
  - **Type**: `Integer`
 - **matchIndex**:
  - **Description**: *The character index inside of the context where the match was confirmed. I.e. the last character in the match.*
  - **Type**: `Integer`

---

> ## FUZZY_SEQUENCE
- **Scoring**: `Relative`  

Determines if all letters of the term exist somewhere inside the context, in the given order but not necessarily right after each other.

For example, the context `"telephone aunt"` would match with `"elephant"` because `t(eleph)one (a)u(nt)`

Relevance will be based on the total distance between the characters.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

The following meta data will be provided by this function:
 - **totalDistance**:
  - **Description**: *The total distance between characters*
  - **Type**: `Integer`

---

> ## CONTAINS_ALL_WORDS
- **Scoring**: `Relative`  

Determines if all the words in the term are contained inside of the context.

For example, the context  `"I am eating cake next week"` would match with the term `"Next week I am eating cake"`

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

---

> ## REGULAR_EXPRESSION
- **Scoring**: `Binary`  

This comparison strategy is only compatible with regular expression search values. What that means is that in order to use this strategy you need to pass a valid regular expression object to the search function, rather than a string, number or similar.

Determines if the context matches the regular expression pattern.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

---

> ## STARTS_WITH
- **Scoring**: `Binary`  

Determines if the context starts with the term.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

---

> ## ENDS_WITH
- **Case Sensitive**: `default true`
- **Scoring**: `Binary`  

Determines if the context ends with the term.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

---

> ## CONTAINS
- **Case Sensitive**: `default true`
- **Scoring**: `Binary`  

Determines if the context contains the term.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

---

> ## EQUALS
- **Case Sensitive**: `default true`
- **Scoring**: `Binary`  

Determines if the term equals the context.

The following additional arguments can be passed to this function:
 - **caseSensitive** 
  - **Description**: *Is the search case sensitive?*
  - **Type**: `boolean`
  - **Default**: `true`

