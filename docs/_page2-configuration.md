## Configuration

?> Jhaystack allows you configure how you want your search to be executed. For more in depth information about each of the below mentioned options, check out the individual pages.

#### Specifying Paths

Jhaystack by default scans all values in the provided data set for matches. You can however instruct jhaystack to either only scan paths that match a given set of regular expressions, or scan everything *except* values that match a given set of regular expressions.

#### Comparison Strategy

The comparison strategy governs how jhaystack determines if a value inside of the dataset is a match or not, as well as partly the relevance of the match. Comparison strategies could for example be "value x starts with search value y", or "value x contains search value y". You can provide multiple comparison strategies that have different relevance to you, or even write your own ones. Jhaystack comes with a bunch of built in strategies that should fit most needs, including fuzzy search.

#### Traversal Strategy

The traversal strategy essentially governs what you are looking for, and what kind of results you want. For instance, you may in one scenario be looking for all values that match a given search term, while in another you may be interested in finding objects where at least one value match a given search term. Traversal strategies allow you to configure this.

#### Sorting Strategy

The sorting strategy lets you configure how the search results from a search should be ordered.

#### Index Strategy

Index strategies lets you to create search indexes that allow for offline searches. Offline searches are significantly faster than online searches, but allow for less configurability anf flexibility.

---

# Options

Jhaystack’s constructor accepts an options object where you can specify your configuration settings. Below is a description of the different options. For more in depth information please check the configuration page. Note that you can also change these options using the built in functions on the Jhaystack instance after instantiation. This way you can change things after the fact that you’ve already created your instance. Note, though, that changing certain options can cause indexes to have to be rebuilt resulting in load times.

All options can be changed after jhaystack has been instantiated using functions on the jhaystack instance. The names of these functions are marked by "function" below.

> ## data
- **Type**: `any[]`
- **Default**: `[]`
- **Function**: `setDataset`

The data to be searched. Values can be of any type, or even mixed. Strings, objects, nested arrays and numbers. Whatever you may want to search. Note that when using the built in search functionality, though, the values will be converted to strings.

```javascript
const myData = [
    "Some text value",
    {
        someProperty: "Howdy!"
    },
    5
]
```

> ## includedPaths
- **Type**: `(RegExp|String)[]`
- **Default**: `[]`
- **Function**: `setIncludedPaths`

Array of regular expressions that evaluate valid value paths to be evaluated for matches. Not configuring this option means that all paths in the search data objects will be traversed and evaluated.

```javascript
const includedPaths = [
    /\.products\./ //Only look for data that is nested inside of a property called products
]
```

> ## excludedPaths
- **Type**: `(RegExp|String)[]`
- **Default**: `[]`
- **Function**: `setExcludedPaths`

Array of regular expressions that evaluate invalid value paths that should not be evaluated for matches. This option always takes precedence over the included paths.
Say for example that you configure included paths to scan everything that matches ".products.", but configure ".products.newProducts." to be excluded.

```javascript
const excludedPaths = [
    /\.products\.newProducts\./ //Do not include data nested inside of a property called newProducts that is a direct child of a property called products
]
```

> ## comparison
- **Type**: `Function[]`
- **Default**: `[ComparisonStrategy.BITAP]`
- **Function**: `setComparisonStrategy`

Array of comparison strategies to be used when evaluating if a value is a match or not.

```javascript
import { ComparisonStrategy } from "jhaystack"
const myCustomStrategy = (term, context) => { return term == context }
const myStrategies = [myCustomStrategy, ComparisonStrategy.StartsWithCaseInsensitive, ComparisonStrategy.ContainsAllWords]
```

> ## traversal
- **Type**: `Function`
- **Default**: `TraversalStrategy.FIND_VALUES`
- **Function**: `setTraversalStrategy`

A traversal strategy that describes to Jhaystack how to traverse and interact with the search data when searching.

```javascript
import { TraversalStrategy } from "jhaystack"
const traversalStrategy = TraversalStrategy.FIND_NESTED_OBJECTS
```

> ## sorting
- **Type**: `Function[]`
- **Default**: `[SortingStrategy.RELEVANCE.DESCENDING]`
- **Function**: `setTraversalStrategy`

Array of sorting functions that describe the order in which the results of a search should be sorted. Results will be ordered by the strategies provided from left to right.

```javascript
import { SortingStrategy } from "jhaystack"
const myCustomStrategy = (a, b) => {
		if (typeof a.item === "object" && typeof b.item !== "object") return 1
		if (typeof a.item !== "object" && typeof b.item === "object") return -1
		return 0
const sortingStrategy = [myCustomStrategy, SortingStrategy.RELEVANCE.DESCENDING]
```

> ## index
- **Type**: `Object[]`
- **Default**: `[]`
- **Function**: `setIndexStrategy`

Array of index definitions to be built and used for offline searching.

```javascript
import { IndexStrategy } from "jhaystack"
const myIndexStrategy = [IndexStrategy.TRIGRAM]
```

> ## limit
- **Type**: `Number`
- **Default**: `null`
- **Function**: `setLimit`

Integer that sets the maximum number of search matches to be collected before searching stops.

```javascript
const myLimit = 100
```