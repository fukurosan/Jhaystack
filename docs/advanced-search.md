# Tips and Tricks

> ## Make your own query functions (and / or)

Jhaystack allows you to create advanced queries through filters and the query API, but you can also create custom queries by either providing them as custom comparison functions, or by using the regular expression comparison function.

?> Your custom comparison functions can leverage built in comparison strategies of Jhaystack as well - like bitap.

Lets say for instance that you want to find all names inside of a data set that resemble a given string, but only if they contain the middle name "Thomas". You can easily solve this by using a custom function.

Example:
```javascript
import { ComparisonStrategy } from "jhaystack"
const myCustomFunction = (term, context) => {
    if(/ Thomas /.test(`${context}`)) {
        return ComparisonStrategy.BITAP(term, context)
    }
    return 0
}
if(myCustomFunction("christopher" , "Kristopher Thomas Lee") &&
    !myCustomFunction("christopher" , "Kristopher Lee")) {
    console.log("Success!")
}
```

If you have a simpler use case that does not require fuzzy searching then you could simply express it as a regular expression.

Example:
```javascript
import { ComparisonStrategy } from "jhaystack"
const mySearchTerm = "James"
myJhaystackInstance.setComparisonStrategy([ComparisonStrategy.REGULAR_EXPRESSION])
myJhaystackInstance.search(new RegExp(`^${mySearchTerm} Thomas `))
```

---

> ## Searching for Properties

In some data exploration use cases you may want to search for properties themselves rather than property values. This can be achieved by executing a comparison strategy that always returns true, and setting the included paths to match the properties that you are looking for.

Example:
```javascript
import { ComparisonStrategy } from "jhaystack"
myJhaystackInstance.setIncludedPaths([/firstName$/])
myJhaystackInstance.setComparisonStrategy([() => true)])
myJhaystackInstance.search()
```

---

> ## Speed

A few things to keep in mind in order to boost performance

#### Limiting results
Do you only need x amount of results? Set a result limit. This means Jhaystack can stop searching as soon as it has found enough matches. Note, though, that the limit will also be applied to inexact k retrieval. So, if you are using filters or full-text search you may need to play around with the number a bit.

#### Filtering data
If you know that there are certain values or properties that do not need to be evaluated then specifying filters for this can help speed things up.

Imagine for example if you have a lot of ID properties in your data that are essentially just UUIDs. Searching through these may not be relevant. And perhaps you are only interested in looking at string values, in which case filtering out all other values first can help greatly speed things up.

```javascript
import { ComparisonStrategy } from "jhaystack"
const myFilters = [
    (path, value) => !/ID$/.test(path.join(".")), //Don't look at values where the property ends with "ID"
    (path, value) => return typeof value === "string" //Only search through string values
]
myJhaystackInstance.setFilters(myFilters)
```
