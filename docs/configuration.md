## Configuration

?> Jhaystack allows you configure how you want your search to be executed. For more in depth information about each of the below mentioned options, check out the individual pages.

#### Specifying Filters

Jhaystack by default scans all nested property values in the provided data set for matches. You can however instruct Jhaystack to either only scan paths or values that match a given set of filter functions, or scan everything *except* values that match a given set of filter functions. Furthermore, filters are applied to the data right away, meaning that the actual search will be faster since there will be less data to traverse.

#### Comparison Strategy

The comparison strategy governs how Jhaystack determines if a value inside of the dataset is a match or not, as well as the score of the match. These are simply JavaScript functions that evaluate the similarity between two values. This could, for example, be as simple as "value x starts with value y", or "value x contains value y". Jhaystack comes with a bunch of built in strategies that should fit most needs - including fuzzy search - but you can easily build your own ones as well.

#### Extraction Strategy

The extraction strategy describes what kind of results you are looking for. It governs how Jhaystack internally extracts documents from the provided datasets. For instance, you may in one scenario be looking for all values that match a given search term, while in another you may be interested in finding objects where at least one value match a given search term. Extraction strategies allow you to configure this behaviour.

#### Indexing Strategy

The index strategy is used to create full-text indexes and defines how these should be set up. These can be used both to enable full-text search as well as filters and queries.

###### *Tokenizer Strategy*

The tokenizer strategy is a part of the index strategy and defines how values should be broken down into indexable tokens. This could be, for example, by breaking each value into individual words, or ngrams.

###### *Ranking Strategy*

The ranking strategy is a part of the index strategy and defines how the magnitude (or, frequencies) for tokens inside of documents should be computed. In other words, it describes how import a given token is within a document, as well as within the dataset as a whole. This is, in essence, what allows us to determine how similar two documents are in a full-text search.

###### *Full-Text Scoring Strategy*

The full-text scoring strategy is basically a comparison strategy, but for full-text vectors. They serve the exact same purpose, but the input is different. When you execute a full-text search the full-text scoring strategy is used to determine the score of the match.

#### Spelling Strategy

The spelling strategy allows for configuration of spelling-correction of user provided input. This allows you to implement "Did you mean?" functionality, give preemptive suggestions, as well as auto-correct input from the user that would otherwise had resulted in zero matches.

#### Cluster Strategy

The cluster strategy is used to help filter down data. Clusters build small, fully custom indexes that can be used to evaluate an input value into a narrowed down selection of the data set. These allow you not just to do classical clustering such as KMeans or hierarchical clusters, but also things like range-clusters where you can find all documents where value foo is within the range bar-baz. 

#### Preprocessing Strategy

The preprocessing strategy describes how the values in the search data should be preprocessed before a search is executed. This can for example be that all strings should be made uppercase, or that date objects should be reformatted into strings of a given format. 

#### Sorting Strategy

The sorting strategy lets you configure how the search results from a search should be ordered.

---

# Options

Jhaystack’s constructor accepts an options object where you can specify your configuration settings. Below is a description of the different options. For more in depth information please check the corresponding pages.

All options can be changed after Jhaystack has been instantiated using functions on the Jhaystack instance. The names of these functions are marked by "function" below. Note, though, that changing certain options can cause indices to have to be rebuilt resulting in load times.

Check out this options interface, as well as further descriptions below.
```javascript
interface IOptions {
	/** Default comparison function to be used for evaluating matches. */
	comparison?: IComparison
	/** Sets the extraction strategy to be used. I.e. how documents should be extracted from the dataset. */
	extraction?: IExtraction
	/** Sets the scoring function used for comparing full-text vector matches. */
	fullTextScoringStrategy?: IFullTextScoring
	/** Sets the indexing strategy to be used */
	indexing?: {
		enable: boolean
		options?: IIndexOptions
		doNotBuild?: boolean
	}
	/** Sets the cluster strategy to be used */
	clustering?: {
		strategy: IClusterSpecification[]
		doNotBuild?: boolean
	}
	/** Sets the spelling strategy to use */
	spelling?: {
		strategy: ISpellingSpecification[]
		doNotBuild?: boolean
	}
	/** Array containing the Sorting functions to be used. Search results will be sorted in order of sorting function provided. */
	sorting?: ((a: SearchResult, b: SearchResult) => number)[]
	/** Options related to the thread planner */
	threadPlanner?: {
		/** Maximum amount threads allowed to run in parallel */
		maxThreadCount?: number
		/** Maximum idle wait time before a worker thread is terminated (in ms) */
		maxIdleTime?: number
		/** If set to true threads will the created ahead of time when comparison strategies are configured */
		shouldWarmup?: boolean
	}
	/** Maximum number of matches before search ends */
	limit?: null | number
	/** Filters for what data should or should not be searchable */
	filters?: IFilter[]
	/** Weight functions that determine how certain property paths and values should be weighed in terms of their relevance. */
	weights?: IWeight[]
	/** Pre processor functions used for preprocessing the provided search data. E.g. "make all strings upper case", or "make all data objects into a string of format yyyy-MM-dd". */
	preProcessing?: IPreProcessor[]
	/** Should preprocessors be applied to the search term as well? */
	applyPreProcessorsToTerm?: boolean
	/** Array of data to be searched */
	data?: any[]
}
```

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
- **Type**: `Function`
- **Default**: `ComparisonStrategy.BITAP`
- **Function**: `setComparisonStrategy`

Comparison functions to be used when evaluating if a value is a match or not.

```javascript
import { ComparisonStrategy } from "jhaystack"
const myCustomStrategy = (term, context) => { return term == context }
const myStrategy = ComparisonStrategy.BITAP
```

> ## extraction
- **Type**: `Function`
- **Default**: `ExtractionStrategy.BY_VALUE`
- **Function**: `setExtractionStrategy`

An extraction strategy that describes to Jhaystack how to extract documents from the provided dataset.

```javascript
import { ExtractionStrategy } from "jhaystack"
const extractionStrategy = ExtractionStrategy.BY_NESTED_OBJECT
```

> ## indexing
- **Type**: `object`
- **Default**: `{enable: false, doNotBuild: false, options: {}}`
- **Function**: `setIndexStrategy`

Sets the index strategy to be used

```javascript
import { ExtractionStrategy } from "jhaystack"
const indexStrategy = { enable: true }
```

> ## clustering
- **Type**: `object`
- **Default**: `{ doNotBuild: false, {id: string, strategy: ICluster, options?: any} }`
- **Function**: `setClusterStrategy`

Sets the cluster strategy to be used

```javascript
import { ClusterStrategy } from "jhaystack"
const clusterStrategy = { options: [{id: "kmeans", strategy: ClusterStrategy.KMeans}] }
```

> ## spelling
- **Type**: `object`
- **Default**: `{ doNotBuild: false, strategy: [{id: string, strategy: ISpelling, options?: any}] }`
- **Function**: `setSpellingStrategy`

Sets the spelling strategy to be used

```javascript
import { SpellingStrategy } from "jhaystack"
const spellingStrategy = { strategy: [{ id: "ngram", strategy: SpellingStrategy.NGRAM }] }
```

> ## fullTextScoringStrategy
- **Type**: `Function`
- **Default**: `null`
- **Function**: `setFullTextScoringStrategy`

Sets the full-text scoring strategy to be used

```javascript
import { FullTextScoringStrategy } from "jhaystack"
const fullTextScoringStrategy = FullTextScoringStrategy.COSINE
```

> ## sorting
- **Type**: `Function[]`
- **Default**: `[SortingStrategy.RELEVANCE.DESCENDING]`
- **Function**: `setSortingStrategy`

Array of sorting functions that describe the order in which the results of a search should be sorted. Results will be ordered by the functions provided from left to right.

```javascript
import { SortingStrategy } from "jhaystack"
const myCustomStrategy = (a, b) => {
		if (typeof a.item === "object" && typeof b.item !== "object") return 1
		if (typeof a.item !== "object" && typeof b.item === "object") return -1
		return 0
const sortingStrategy = [myCustomStrategy, SortingStrategy.RELEVANCE.DESCENDING]
```

> ## limit
- **Type**: `Number`
- **Default**: `null`
- **Function**: `setLimit`

Integer that sets the maximum number of search matches to be collected before searching stops.

```javascript
const myLimit = 100
```

> ## threadPlanner
- **Type**: `{ maxThreadCount, maxIdleTime }`
- **Default**: `undefined`
- **Function**: `n/a`

Object that can be used to configure Jhaystack's internal thread planner.
