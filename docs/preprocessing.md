# Preprocessor Strategy

Preprocessors are collections of functions that will be applied to the search data before the data is traversed. This is handy if you for example want to execute searches that are not case sensitive, serialize all your data to strings beforehand, or format date objects into something users can more easily search for. Anything is possible!

A preprocessor is simply a function that takes a value of an `unknown` type, and outputs a new processed value of `any/unknown`.

Preprocessors are provided as an array of functions that will be executed in given order. The result of the first function will be the input for the second, and so on. You can either provide them using the `preProcessing` option, or using the `setPreProcessingStrategy` function on the Jhaystack instance.

You can choose if you want your preprocessors to also be applied to search terms before a search is executed. Let's for example say that you have made all your data lower case, then it may make sense to do the same for your search term. You can control this behvaiour by setting the `applyPreProcessorsToTerm` option or by executing the `setApplyPreProcessorsToTerm` function on the Jhaystack instance.
    
Example:
```javascript
import { Jhaystack } from "jhaystack"

const data = [
    {
        name: "Tom"
    },
    {
        name: "Tim"
    }
]

const options = {
    preProcessors: [(value) => `${value}`), (value) => value.toUpperCase()]
    applyPreProcessorsToTerm: true
    data: data,
}
const se = new Jhaystack(options)

const results = se.search("tm")
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }, { path: ["name"], item: { name: "tim" }, value: "tim", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
```

---

Jhaystack currently comes with the following PreProcessors built in:

> ## TO_STRING (Default 0)

Serializes an input value into a string.

---

> ## TO_LOWER_CASE (Default 1)

Converts an input string into lower case characters.

---

> ## PORTER2

Porter2 is an English stemming algorithm based on the "Porter" algorithm originally developed by Martin Porter. Porter2 brings several improvements over the original algorithm, and is commonly considered superior for general purpose use.

A stemmer computes the stem of a word. For example:
`
consisted
consistency
consistent
consistently
consisting
`
All share the stem "consist".

If a string is passed to the function then it will be split by spaces, and each substring will be processed, rejoined and returned. If an array is passed to the function then each string in it will be processed, and a new array with the processed values returned.

---

> ## LANCASTER

Lancaster is an English stemmer. 

Lancaster is significantly more aggressive than Porter2. As a result, some resulting stems may become seemingly obfuscated, and may not be intuitively recognizable after computation. On the other hand, the Lancaster algorithm will significantly reduce your set of words.

If a string is passed to the function then it will be split by spaces, and each substring will be processed, rejoined and returned. If an array is passed to the function then each string in it will be processed, and a new array with the processed values returned.

---

> ## STOP_WORDS_EN

Removes common English stop words from either an array of values, or from inside of a string.

---

> ## SCRUB

Removes commonly used special characters from either an array of values, or from inside of a string.

The scrubber will also normalize characters. 

For example:
`àáâãäå -> a`

---

