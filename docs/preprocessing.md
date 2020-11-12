# Preprocessor Strategy

Preprocessors are collections of functions that will be applied to the search data before the data is traversed. This is handy if you for example want to execute searches that are not case sensitive, serialize all your data to strings beforehand, or format date objects into something users can more easily search for. Anything is possible!

A preprocessor is simply a function that takes a value of an `unknown` type, and outputs a value of `any` type that becomes the new value.

Jhaystack will by default apply two preprocessors to all data: `TO_STRING` and `TO_UPPER_CASE`. The `TO_STRING` preprocessor will serialize all data into strings. The `TO_UPPER_CASE` will, as the name suggests, convert the data to uppercase to make it not case sensitive while searching. You can override this and supply your own preprocessors, or mix your own preprocessors with Jhaystack's.

Preprocessors are provided as an array of functions that will be executed in the provided order. The result of the first function will be the input for the second, and so on. You can either provide them using the `preProcessing` option, or using the `setPreProcessingStrategy` function on the Jhaystack instance.

You can choose if you want your preprocessors to also be applied to search terms before a search is executed. Let's for example say that you have made all your data upper case, then it may make sense to do the same for your search term. You can control this behvaiour by setting the `applyPreProcessorsToTerm` option or by executing the `setApplyPreProcessorsToTerm` function on the Jhaystack instance.
    
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
