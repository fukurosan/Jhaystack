# Index Strategy (Experimental)

## Basics

Jhaystack allows you to create full-text indexes using an index strategy. Full-text indexes can be used not just for full-text search but also for search filters in queries which works great for larger data sets. Indexes have a build-step, which means that when you create an index strategy the index must be built before it can be used, which can be computationally expensive. It is also worth noting that the speed of indexed search comes at a cost of increased memory usage.

full-text search should be considered as an alternative to using comparison strategies. The two are completely different search approaches that solve different problems. Full-text search helps you search through large data sets, focusing on the bigger picture. Think of it as searching in a web search engine. Comparison strategies use sequential value similarity approximation to compare every single value for a "match", focusing on the narrow picture. A typical use case for a full-text search might be to search through a collection of long news articles for everything that has to do with "penguins" and "Antarctica". A typical use case for sequential value similarity approximation might be to find all movie titles that has something in the title similar to "frrest gmp".

Indexes will respect your globally configured settings such as filters, result limits, extraction strategy and sorting. The only thing currently not supported is weights.

Jhaystack ships with some sensible defaults, but you can configure the Index strategy based on your specific needs. Below you will find documentation for both all different settings, as well as other relevant index-specific strategies.

Finally, note that fulltext search relevance results are currently *not* limited to a range between 0-1. The number may be completely arbitrary.

Basic Example:

```javascript
import { Jhaystack, IndexStrategy, FullTextScoringStrategy } from "jhaystack"

const data = [
	"my name is tim",
	"but you can call me timmy"
]

const options = {
	data: data,
	//Passing "enable: true" will cause Jhaystack to construct an index
    indexing: { enable: true },
    //In order to use the index a scoring function *must* be configured
	fullTextScoringStrategy: FullTextScoringStrategy.FULLTEXT_COSINE
}

const se = new Jhaystack(options)
const result = se.fulltext("call timmy")

//You can also (re)build your index manually after instantiation:
se.setIndexStrategy({}, true)
se.setFullTextScoringStrategy(FullTextScoringStrategy.FULLTEXT_COSINE)
se.buildIndex()

```

!> **Tip**  
_Note that when you add / remove documents from your Jhaystack instance you will need to manually rebuild your index using the buildIndex() function._

--- 

> ## Options

Indexes are built to be configurable and customizable. The following options can be provided to an index:

-   filter
    -   This works the exact same way as the global filters described in the filtering chapter, but only for the index. Global filters are always applied first.
-   preProcessors
    -   This works the same as the global preProcessors described in the preprocessors chapter, but only for the index. It is common to use the index specific ones to do things like stemming. Global preprocessors are always applied first
-   tokenizer
    -   Tokenizers describe how values are broken down into indexable tokens.
-   rankingStrategy
    -   The ranking strategy specifies how a document’s magnitude is computed.
-   rankingStrategyOptions
    -   These are any potential options for the given rankingStrategy
-   encodeFields
    - If set to true fields will be encoded into tokens. This means that the magnitude (ranking) of tokens will be determined on a field-by-field basis, and performance of field searches will improve at the cost of additional memory usage. Note that if encodeFields is set to true then fields *must* be included when searching the index.

---

> ## Tokenizer Strategy

The tokenizer strategy is used to determine how data in an index strategy should be tokenized. The tokenizer will take each value in your data and break them down into indexable string values.

Here is an example of how to configure tokenizers in your index strategy.

```javascript
import { TokenizerStrategy } from "jhaystack"
indexOptions = {
    tokenizer: TokenizerStrategy.WORD
}
const se = new Jhaystack({indexing: {enable : true, options: indexOptions } })
```

Jhaystack comes with the following tokenizer strategies built in:

### WORD (Default)

Probably the most widely used type of tokenizer. This will split values into all separate words.

The following additional arguments can be passed to this function:
 - **separator** 
   - **Description**: *The separator where values should be split*
   - **Type**: `string`
   - **Default**: `" "`

### NGRAM

The ngram tokenizer will split all values into their ngrams (by default 3). This type of strategy is more memory intensive than for example WORD, but allows you to match only parts of a word in the index (essentially making it a contains search).

The following additional arguments can be passed to this function:
 - **maxGram** 
   - **Description**: *Maximum size for the grams*
   - **Type**: `number`
   - **Default**: `3`
 - **minGram** 
   - **Description**: *Minimum size for the grams*
   - **Type**: `number`
   - **Default**: `maxGram`
 - **captureSpace** 
   - **Description**: *If false all spaces will be removed before parsing*
   - **Type**: `boolean`
   - **Default**: `true`
 - **captureStartEnd** 
   - **Description**: *If true the beginning and end of the term will be parsed as a custom character*
   - **Type**: `boolean`
   - **Default**: `false`

### SHINGLE

A shingle is an n-long sequential collection of words. This can be used to help with retaining information about several words that make up a single meaning. Imagine for example someone searches for “New York”. They are obviously (I mean, probably) not interested in the new ice cream store in York (UK). Shingles are a way of retaining the importance of word pairings. While shingles are not so commonly used today, for a multitude of reasons, they still can come in handy.

The following additional arguments can be passed to this function:
 - **n** 
   - **Description**: *Maximum size for the grams*
   - **Type**: `number`
   - **Default**: `3`
 - **onlyIncludeShingles** 
   - **Description**: *Should only shingles be included?*
   - **Type**: `boolean`
   - **Default**: `false`
 - **separator** 
   - **Description**: *Optional separator*
   - **Type**: `string`
   - **Default**: `" "`

### EDGEGRAM

Edgegrams are essentially startsWith and endsWith tokens. This is useful when for example creating search-as-you-type functionality for large datasets.

The following additional arguments can be passed to this function:
 - **n** 
   - **Description**: *Maximum number of grams to extract*
   - **Type**: `number`
   - **Default**: `3`

### Custom Tokenizers

You can easily write your own tokenizers. These are simply functions that take a value as input, and returns a list of tokens with positional information as output. You can use the below interface:

```javascript
interface ITokenizerResultPositions {
    /** Index where the token starts */
    offsetStart: number
    /** Index where the token ends */
    offsetEnd: number
    /** Index of the token among other tokens */
	position: number
}

//This is the return type
interface ITokenizerResultMap {
    /** Each key is a token */
	[key: string]: ITokenizerResultPositions[]
}

//This is the function
interface ITokenizer {
	(value: unknown): ITokenizerResultMap
}
```

---

> ## Ranking Strategy

Ranking functions are used to compute the magnitude of tokens. Generally there are two types of magnitudes, the TF (Term Frequency) which represents the magnitude of a token within a given document, and IDF (Inverse Document Frequency) which represents the magnitude within the dataset as a whole. The ranking strategy is essentially what converts the tokens of a document to a vector, which can then be used in determining similarity between documents.

You can configure a ranking function as well as supply it with options like so:
```javascript
import { RankingStrategy } from "jhaystack"
indexOptions = {
    ranking: RankingStrategy.TFIDF
    rankingOptions: {
        smartirs: "ntc"
    }
}
const se = new Jhaystack({indexing: {enable : true, options: indexOptions } })
```

The following weighters come builtin:

### TFIDF (Default)

TFIDF is probably the most widely known approach to ranking, and uses a VSM (Vector Space Model) approach. If you are unsure of what to use then this is a good place to start. The TFIDF strategy can be configured using smartirs, depending on the specific needs for the data, but generally the default settings should work for most projects. It is recommended to use a cosine scoring function in tandem with this.

The following options can be configured:
 - **smartirs** 
   - **Description**: *Three characters defining the tf, idf and normalization type to be used. Follows the smartirs standard.*
   - **Type**: `string | string[]`
   - **Default**: `ntc`
 - **smoothenTF** 
   - **Description**: *This by default stops log(0) from happening by always adding 1 to tf.*
   - **Type**: `boolean`
   - **Default**: `true`
 - **smoothenIDF** 
   - **Description**: *Artifically add one additional document to every IDF calculation that contains every term exactly one time.*
   - **Type**: `boolean`
   - **Default**: `true`
 - **pivot** 
   - **Description**: *Should be TFIDF values be pivot normalized?*
   - **Type**: `boolean`
   - **Default**: `false`
 - **slope** 
   - **Description**: *Amount to pivot (0-1). You may need to experiment with this value.*
   - **Type**: `number`
   - **Default**: `0.65`

### BM25

BM25 is a newer (well, relatively) approach to ranking that adopts ideas from probabilistic theory. BM25 can be a bit trickier to get right, since you may need to experiment with its parameters more but can sometimes provide better results than TFIDF. A generally good default starting point is provided by Jhaystack, but optimal parameters will vary greatly based on, for example, document length, word diversity and word repetition. It is recommended to use a magnitude scoring function in tandem with this.

The following options can be configured:
 - **k1** 
   - **Description**: *When will a term be saturated? The longer the document texts are the higher this value should be. Should be between ~ 0-3.*
   - **Type**: `number`
   - **Default**: `1.2`
 - **b** 
   - **Description**: *When should the length result in term saturation? The specific the document texts are the lower this number should be. Should be between 0-1.*
   - **Type**: `number`
   - **Default**: `0.75`

---

> ## Full-Text Scoring Strategy

The full text scoring strategy works similar to comparison functions, but compares vectors rather than arbitrary values.

Jhaystack comes with the following functions built in:

### FULLTEXT_COSINE (recommended for TFIDF)

Determines the cosine between two given vectors and returns the score as a number.

### FULLTEXT_MAGNITUDE (recommended for BM25)

Determines the magnitude of the joined vectors and returns the score as a number.

### Custom Full-Text Scoring Strategy

You can easily construct your own full-text scoring function using the following interface:

```javascript
interface IComparisonResult {
    score: number
    //Potential meta data
	[key: string]: any
}

interface IIndexVector {
	vector: number[]
	isUnitLength: boolean
}

//This is the function type
interface IFullTextScoring {
	(vector1: IIndexVector, vector2: IIndexVector): number | IComparisonResult
}
```