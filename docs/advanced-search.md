# Advanced Search

> ## Advanced Queries (and / or)

Jhaystack allows you to create advanced queries by either providing them as custom comparison functions, or by using the regular expression comparison function.

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

Full string approximation scans will never be as fast as indexed search, but there are things you can do to help Jhaystack perform better.

#### Limiting results
Do you only need x amount of results? Set a result limit. This means Jhaystack can stop searching as soon as it has found enough matches.

#### Limiting the amount of comparison strategies
Do you have multiple comparison strategies, but they are all weighted the same? Provide them as one combined custom strategy. This will mean that the dataset will not have to be traversed multiple times, which tends to be more costly.

Let's say that you want to find values that either start with or end with a given value. You can then combine these into one single comparison function.

Example:
```javascript
import { ComparisonStrategy } from "jhaystack"
const myCustomFunction = (term, context) => {
    return ComparisonStrategy.STARTS_WITH(term, context) || ComparisonStrategy.ENDS_WITH(term, context)
}
myJhaystackInstance.setComparisonStrategy([myCustomFunction])
```

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
