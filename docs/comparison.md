# Comparison Strategy

The comparison strategy defines how Jhaystack compares the search term with values to evaluate if it has found a match or not. You can configure Jhaystack to use different comparison functions depending on your needs.

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
    comparison: ComparisonStrategy.STARTS_WITH
}

const se = new Jhaystack(options)
const result = se.search("ton")
//[{ path: ["name"], item: { name: "tony" }, value: "tony", relevance: 1, score: 1 }]
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

You can also nest the built in comparison functions in Jhaystack. This is useful if, for instance, you want to overwrite the default settings of the built in function.

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

Relevance is primarily based on the levenshtein distance of the match, and secondarily on the size of the context as well as the match distance from context index 0. Matches that only match one single character will be considered irrelevant.

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

> ## COSINE
- **Scoring**: `Relative`  

Determines the cosine distance between two strings based on their n grams. The strings involved will first be converted into vectors based on ngrams, and then a cosine angle between the two will be calculated and used to determine the similarity.

The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.2`
 - **n** 
   - **Description**: *gram sizes to format the input term and context into.*
   - **Type**: `number`
   - **Default**: `3`

---

> ## LEVENSHTEIN
- **Scoring**: `Relative`  

Determines the Levenshtein distance between the two input strings and converts it into a score from 0-1.

The difference between this function and bitap is that this function makes an absolute comparison between the input strings, rather than what is essentially a contains-scan.

The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.2`

---

> ## DAMERAU
- **Scoring**: `Relative`  

Determines the full Damerau-Levenshtein distance between the two input strings and converts it into a score from 0-1.

The difference between Levenshtein distance and Damerau-Levenshtein distance is that Damerau-Levenshtein distance considers transpositions a valid single alteration.

For example let's say we wanted to calculate the difference between "eHllo" and "Hello":

Levenshtein
`"eHllo" -> "Hllo" -> "Hello"` = 2 alterations

Damerau-Levenshtein
`"eHllo" -> "Hello"` = 1 alteration

The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.2`

---

> ## EUCLIDEAN
- **Scoring**: `Relative`  

Determines the euclidean distance between the two input strings based on their ngrams and converts it into a score from 0-1.

The Euclidean distance is the distance between to vectors within a coordinate system. The input strings will be converted into ngram coordinates which will be used as vectors when determining the distance.

The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.7`
 - **n** 
   - **Description**: *gram sizes to format the input term and context into.*
   - **Type**: `number`
   - **Default**: `3`

---

> ## HAMMING
- **Scoring**: `Relative`  

Computes a score based on the number of symbol positions in the term and context that differ.

Hamming distance can only be calculated on strings of equal length, or numbers.

For Example:
`"Hello", "Jello" = 1`, because they differ with one character. Making the score 1 - 1/5 = 0.8.

If two numbers are provided to the function then the distance will be computed as the bit representation of said numbers.

For example:
`9, 14 = 1`, because `0101 -> 0111`. Making the score 1 - 1/4 = 0.75

The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.2`

---

> ## LONGEST_COMMON_SUBSTRING
- **Scoring**: `Relative`  

Computes a score based on the longest common substring within the input strings.

For Example:
`"I like cats", "cats are awesome" = 4`, because the longest common substring is `"cats"`. 

The score would either be computed as the result * 2 / (term length + context length), or as result/ term length based on arguments provided to the function.


The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.3`
 - **containsSearch** 
   - **Description**: *Determines of the computed score should be based on only term length, or the full combined length.*
   - **Type**: `boolean`
   - **Default**: `false`
---

> ## JACCARD
- **Scoring**: `Relative`  

Computes a score based on intersection of ngrams over union.

The two input strings are both converted into ngrams, and the number of intersecting ngrams are divided by the number of union ngrams to generate a score.

For example:
`"Pear", "Swear" = 1/4 = 0.25`, because `"ear"` is the intersection and `"Pea", "ear", "Swe", "wea"` is the union.


The following additional arguments can be passed to this function:
 - **threshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.2`
 - **n** 
   - **Description**: *Determines the size of ngrams to use for the calculation.*
   - **Type**: `number`
   - **Default**: `3`
---

> ## JARO_WINKLER
- **Scoring**: `Relative`  

Computes a score based on the Jaro-Winkler distance of two strings.

Jaro distance is computed by exact characters positions and limited transpositions. The valid transposition length grows with the string length and is calculated by Math.max(str1.length, string2.length) / 2. The number of transpositioned character and matching characters are then used to determine the distance.

Jaro-Winkler adds a bias to the prefix of the strings. If the prefix is identical then the distance is considered to be less. The maximum prefix length can be configured to 1-4. If prefixed the distance will be considered reduced by a factor of a scaling boost.

The following additional arguments can be passed to this function:
 - **matchThreshold** 
   - **Description**: *Threshold between 0-1 for what is considered a match.*
   - **Type**: `number`
   - **Default**: `0.6`
 - **winklerThreshold** 
   - **Description**: *Threshold for a Jaro score where Winkler should be applied.*
   - **Type**: `number`
   - **Default**: `0.7`
 - **prefixLength** 
   - **Description**: *Threshold for the string prefix (1-4).*
   - **Type**: `number`
   - **Default**: `4`
 - **scalingFactor** 
   - **Description**: *Scaling factor for the prefix boost (0-0.25).*
   - **Type**: `number`
   - **Default**: `0.1`
---

> ## FUZZY_SEQUENCE
- **Scoring**: `Relative`  

Determines if all letters of the term exist somewhere inside the context, in the given order but not necessarily right after each other.

For example, the context `"telephone aunt"` would match with `"elephant"` because `t(eleph)one (a)u(nt)`

Relevance will be based on the total distance between the characters.

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

