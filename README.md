# Jhaystack
This is a zero dependency JSON search utility that lets you search for string values inside of a JSON object recursively.

### Installation and Tests
Install using NPM:
```
npm install Jhaystack
```
Run tests:
```
npm run test
```

### How it works
Jhaystack is highly modular, and built on configurable traversal and comparison strategies. This lets you customize precisely how you want the engine to work, and even write your own plugins. Its essentially like building with javascript lego blocks. Jhaystack ships with a few different strategies that should fulfill most use cases.

To use Jhaystack you need to supply a traversal strategy, a comparison strategy, as well as an array of objects to be searched (a.k.a. the "dataset").

#### Typical Usage
Typically you would use the library like so:
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
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
    .setComparisonStrategy(ComparisonStrategies.FUZZY_SEARCH)
    .setDataset(data)
const results = se.search("tm")
//[{name: "tom"}, {name, "tim"}]
```

#### Included / Ignored Attributes Customizability
Jhaystack by default scans all attributes for the given search criteria, but can be configured to either ignore certain attributes, or only look for certain attributes. To do this is super simple:
```javascript
import Jhaystack from "jhaystack"
const include = ["name"]
const ignore = ["name"]
const data = [
    {
        name: "tom"
    },
    {
        otherNameAttribute: "tim"
    }
]
const seInc = new Jhaystack()
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
    .setComparisonStrategy(ComparisonStrategies.FUZZY_SEARCH)
    .setDataset(data)
    .setIncludedAttributes(include)
const seIgn = new Jhaystack()
    .setTraversalStrategy(TraversalStrategies.RETURN_ROOT_ON_FIRST_FOUND)
    .setComparisonStrategy(ComparisonStrategies.FUZZY_SEARCH)
    .setDataset(data)
    .setIgnoredAttributes(ignore)
const resultsIncluded = seInc.search("tm")
//[{name: "tom"}]
const resultsIgnored = seIgn.search("tm")
//[]
```

#### Traversal Strategy
The traversal strategy defines how Jhaystack traverses the object tree while searching for a match, as well as what makes it stop, and what it returns. Jhaystack currently ships with the following strategies.

Strategy | Description
--- | ---
RETURN_ROOT_ON_FIRST_FOUND   |   This strategy will stop traversal of an object as soon as it finds a value match, and return the entire root object in the result.
EXTRACT_ALL_NESTED   |   This strategy will continue traversal until every single branch object has been checked, and will return the nested object where the match was actually found (i.e. not the root!). This is great if you want to locate and extract branch objects from a really complicated JSON.

#### Comparison Strategy
The comparison strategy defines how Jhaystack compares two values to evaluate if it has found a search match or not. Jhaystack currently ships with the following strategies:

Strategy | Description
--- | ---
FUZZY_SEARCH   |   This strategy will determine if all letters of the term exist somwhere inside the context, in the given order but not necessarily right after each other.
STARTS_WITH   |   This strategy will determine if the context starts with the term  (not case sensitive!)
CONTAINS   |   This strategy will determine if the context contains the term in its exact form (not case sensitive!)
EXACT_MATCH   |   This strategy will determine if the term is exactly the context (case sensitive!)

You can easily build your own strategy, by supplying Jhaystack with a custom function reference. The function takes the following arguments:
Argument | Description
--- | ---
term*   |   The value to be searched for
context*   |   The value to be searched