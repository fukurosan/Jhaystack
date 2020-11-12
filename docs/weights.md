# Weighted Search

Jhaystack by default considers all provided data to be of equal worth. You can, however, execute a weighted search wherein you specify weights for property/value patterns in your search data. Using this feature you can either amplify or reduce the relevance of data where the property paths and values fulfill certain criteria.

For example, you may be particularly interested in data on property paths that have `title` or `name` in them, or in string values that match a certain regular expression (email-addresses for instance).

By default all values have a weight of 1. If a value has a weight of 0.5 then it means that the value is half as important. If a value has a weight of 2 then it means that it is twice as important. All weights must be numbers greater than 0.

?> Weighted search does not affect the relevance of the order of comparison functions. The order of comparison functions will always take precedence in determining the relevance score.

Data is provided in the form of an array of arrays, where each inner array has a first object that is a function, and a second object that is a weight. The function will receive the property path expressed as an array of strings as the first argument, and the value found on the property path in its raw, original form. The function should return true if the pattern matches, and false if it doesn't. The weight should be expressed as a number between 0 and inifinity.

!> **Tip**  
*Note that array indexes will also be represented in the pattern.*
  
You can specify the weights using the `weights` option or the `setWeights` function.  
  
Example:
```javascript
import { Jhaystack } from "jhaystack"

const data = [
    {
        name: "tom"
    },
    {
        otherNameAttribute: "tim"
    }
]

const options = {
    data: data
}
const se = new Jhaystack(options)

const optionsWeighted = {
    data: data,
    weights: [[(path, value) => /^other/.test(path.join(".")), 0.5]]
}
const seWeighted = new Jhaystack(optionsWeighted)

const results = se.search("tm")
results[0].relevance === results[1].relevance //-> true
const resultsWeighted = seWeighted.search("tm")
resultsWeighted[0].relevance === resultsWeighted[1].relevance //-> false
```
