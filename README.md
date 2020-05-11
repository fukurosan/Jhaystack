# Jhaystack
This is a zero dependency JSON search utility that lets you search for values inside of a JSON object. Jhaystack is in particular built for projects where data structures are not known in advance, data exploration is central, or data is highly generic.

### Installation
Install using NPM:
```
npm install jhaystack
```

### How it works
Jhaystack is highly modular, and built on configurable traversal and comparison strategies. This lets you customize precisely how you want the engine to work, and even write your own plugins. Its essentially meant to be like building with javascript lego blocks. Jhaystack ships with a few different strategies that should fulfill most use cases.

To use Jhaystack you need to supply a traversal strategy, an array of comparison strategies, as well as an array of objects to be searched (a.k.a. the "dataset").

#### Typical Usage
Typically you would use the library by creating an instance of Jhaystack and setting it up using the built in functions. This involves providing a traversal strategy, an array of comparison strategies, an (optional) result limit in the form of an integer, and a dataset. The search function can then be used to execute a search.
```javascript
import { Jhaystack, TraversalStrategies, ComparisonStrategies } from "jhaystack"
const data = [
    {
        name: "tom"
    },
    {
        name: "tim"
    }
]
const se = new Jhaystack()
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH_ORDERED)
    .setComparisonStrategy([ComparisonStrategies.STARTS_WITH, ComparisonStrategies.FUZZY])
    .setLimit(2)
    .setDataset(data)
const results = se.search("tm")
//[{name: "tom"}, {name, "tim"}]
```

#### Included / Ignored Attributes Customizability
Jhaystack by default scans all attributes for the given search criteria, but can be configured to either ignore certain attributes, or only look for certain attributes. To do this is super simple:
```javascript
import Jhaystack from "jhaystack"
const attributeArray = ["name"]
const data = [
    {
        name: "tom"
    },
    {
        otherNameAttribute: "tim"
    }
]
const seInc = new Jhaystack()
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH)
    .setComparisonStrategy([ComparisonStrategies.FUZZY])
    .setDataset(data)
    .setIncludedAttributes(attributeArray)
const seIgn = new Jhaystack()
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_MATCH)
    .setComparisonStrategy([ComparisonStrategies.FUZZY])
    .setDataset(data)
    .setIgnoredAttributes(attributeArray)
const resultsIncluded = seInc.search("tm")
//[{name: "tom"}]
const resultsIgnored = seIgn.search("tm")
//[{otherNameAttribute: "tom"}]
```

#### Traversal Strategy
The traversal strategy defines how Jhaystack traverses the object tree while searching for matches, as well as what makes it stop, and what it returns. Jhaystack currently ships with the following strategies.

Strategy | Description
--- | ---
RETURN_ROOT_ON_FIRST_MATCH   |   This strategy will stop traversal of an object as soon as it finds a value match, and return the entire root object in the result.
RETURN_ROOT_ON_FIRST_MATCH_ORDERED   |   This strategy works similar to the above version, but orders results by the provided comparison strategies. This means that it in some scenarios will be slower - especially when there is a result limit set - but will generate more accurate results.
EXTRACT_ALL_NESTED   |   This strategy will continue traversal until every single branch object has been checked, and will return the nested object where the match was actually found (i.e. not the root!). This is great if you want to locate and extract branch/leaf objects from complex JSON objects.

#### Comparison Strategy
The comparison strategy defines how Jhaystack compares two values to evaluate if it has found a search match or not. Jhaystack currently ships with the following strategies:

Strategy | Description
--- | ---
FUZZY   |   This strategy will determine if all letters of the term exist somwhere inside the context, in the given order but not necessarily right after each other. (not case sensitive!)
STARTS_WITH   |   This strategy will determine if the context starts with the term
STARTS_WITH_CASE_INSENSITIVE   |   This strategy will determine if the context starts with the term  (not case sensitive!)
ENDS_WITH   |   This strategy will determine if the context starts with the term
ENDS_WITH_CASE_INSENSITIVE   |   This strategy will determine if the context starts with the term  (not case sensitive!)
CONTAINS   |   This strategy will determine if the context contains the term in its exact form
CONTAINS_CASE_INSENSITIVE   |   This strategy will determine if the context contains the term in its exact form (not case sensitive!)
EQUALS   |   This strategy will determine if the term is exactly the context
EQUALS_CASE_INSENSITIVE   |   This strategy will determine if the term is exactly the context (not case sensitive!)

You can easily build your own strategy, by supplying Jhaystack with a custom function reference. The function should return a boolean that states if it is a match or not, and takes the following arguments:
Argument | Description
--- | ---
term*   |   The value to be searched for
context*   |   The value to be searched
