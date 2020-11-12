## Configuration

?> Jhaystack allows you configure how you want your search to be executed. For more in depth information about each of the below mentioned options, check out the individual pages.

#### Specifying Filters

Jhaystack by default scans all nested property values in the provided data set for matches. You can however instruct Jhaystack to either only scan paths or values that match a given set of filter functions, or scan everything *except* values that match a given set of filter functions. Furthermore, filters are applied to the data right away, meaning that the actual search traversal will be faster since there will be less data to traverse.

#### Comparison Strategy

The comparison strategy governs how Jhaystack determines if a value inside of the dataset is a match or not, as well as partly the relevance of the match. A comparison strategy consists of comparison functions, which could for example be "value x starts with search value y", or "value x contains search value y". You can provide multiple comparison functions that have different relevance to you, and even write your own ones. Jhaystack comes with a bunch of built in ones that should fit most needs, including fuzzy search.

#### Traversal Strategy

The traversal strategy describes what kind of results you are looking for, and how you want your dataset to be traversed. For instance, you may in one scenario be looking for all values that match a given search term, while in another you may be interested in finding objects where at least one value match a given search term. Traversal strategies allow you to configure this behaviour.

#### Preprocessing Strategy

The preprocessing strategy describes how the values in the search data should be preprocessed before a search is executed. This can for example be that all strings should be made uppercase, or that date objects should be reformatted into strings of a given format. 

#### Sorting Strategy

The sorting strategy lets you configure how the search results from a search should be ordered.

#### Index Strategy

Index strategies lets you to create search indices that allow for offline searches. Offline searches are significantly faster than online searches, but allow for less configurability and flexibility.

---

# Options

Jhaystack’s constructor accepts an options object where you can specify your configuration settings. Below is a description of the different options. For more in depth information please check the corresponding pages.

All options can be changed after Jhaystack has been instantiated using functions on the Jhaystack instance. The names of these functions are marked by "function" below. Note, though, that changing certain options can cause indices to have to be rebuilt resulting in load times.

> ## data
- **Type**: `any[]`
- **Default**: `[]`
- **Function**: `setDataset`

The data to be searched. Values can be of any type, or even mixed. strings, objects, dates, nested arrays and so on.

```javascript
const myData = [
    "Some text value",
    {
        someProperty: "Howdy!"
    },
    5
]
```

> ## filters
- **Type**: `((path: string[], value: unknown): boolean)[]`
- **Default**: `[]`
- **Function**: `setFilters`

Array of filter functions that evaluate valid path/value combinations. Not configuring this option means that all paths and values in the provided data set objects will be traversed and evaluated.

```javascript
const filters = [
    (path, value) => typeof value === "string" //Only evaluate string values in the dataset
]
```

> ## weights
- **Type**: `[RegExp | string, number][]`
- **Default**: `[]`
- **Function**: `setWeights`

Sets scoring weights for given regexp path patterns. Data is provided in the form of an array of arrays, where each inner array has a first object that is the pattern, and a second object that is a weight that determines the importance of the matched property. The weight must be a positive number. Default weight is 1.

```javascript
const weights = [
    [[/\.products\.newProducts\./, 2]] //Make newProducts found under products extra important
]
```

> ## preProcessing
- **Type**: `Function[]`
- **Default**: `[PreProcessorStrategy.TO_STRING, PreProcessorStrategy.TO_UPPER_CASE]`
- **Function**: `setPreProcessorStrategy`

Array of preprocessor functions that should be applied to the search data.

```javascript
const preProcessing = [PreProcessorStrategy.TO_STRING, PreProcessorStrategy.TO_UPPER_CASE]
```

> ## applyPreProcessorsToTerm
- **Type**: `boolean`
- **Default**: `true`
- **Function**: `setApplyPreProcessorsToTerm`

Configure if pre processors should be applied to the provided search term before search execution

```javascript
const applyPreProcessorsToTerm = true
```

> ## comparison
- **Type**: `Function[]`
- **Default**: `[ComparisonStrategy.BITAP]`
- **Function**: `setComparisonStrategy`

Array of comparison functions to be used when evaluating if a value is a match or not.

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

Array of sorting functions that describe the order in which the results of a search should be sorted. Results will be ordered by the functions provided from left to right.

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
