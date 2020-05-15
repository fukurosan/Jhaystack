# Jhaystack
This is a zero dependency JSON search utility that lets you search for values inside of a JSON object. Jhaystack is in particular built for projects where data structures are not known in advance, data exploration is central, or data is highly generic.

### Installation
Install using NPM:
```
npm install jhaystack
```

### How it works
Jhaystack is modular, and built on configurable traversal and comparison strategies. This lets you customize precisely how you want the engine to work, and even write your own plugins. Its essentially meant to be like building with javascript lego blocks. Jhaystack ships with a few different strategies that should fulfill most use cases.

To use Jhaystack you need to supply a traversal strategy, an array of comparison strategies, as well as an array of objects to be searched (a.k.a. the "dataset").

#### Typical Usage
Typically you would use the library by creating an instance of Jhaystack and setting it up using the built in functions. This involves providing a traversal strategy, an array of comparison strategies, an (optional) result limit in the form of an integer, and a dataset. The search function can then be used to execute a search.

The result of a search will be an array of objects. Each object has the item itself (item) where a match was found, a path (path) to where in the object the match was found, as well as a depth (depth) specifying how many steps into the structure the match was found.

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
    .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH_ORDERED)
    .setComparisonStrategy([ComparisonStrategy.STARTS_WITH, ComparisonStrategy.FUZZY])
    .setLimit(2)
    .setDataset(data)
const results = se.search("tm")
//[{ path: ["name"], depth: 1, item: { name: "tom" }, { path: ["name"], depth: 1, item: { name: "tim" }]
```

#### Included / Excluded Paths Customizability
Jhaystack by default scans all attributes and paths for the given search criteria, but can be configured to either exclude certain paths, or only include certain paths. You do this by providing an array of regular expressions (either as RegExp objects, or as strings) to the engine. The regex provided will be evaluated against a string representation of the path inside the JSON object. The string will be formatted with a "." separating each step in the structure. An exclude match will always take precedence over an include match.

Example:
```javascript
import Jhaystack from "jhaystack"
const pathRegexArray = [/^other/]
const data = [
    {
        name: "tom"
    },
    {
        otherNameAttribute: "tim"
    }
]
const seInc = new Jhaystack()
    .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
    .setComparisonStrategy([ComparisonStrategy.FUZZY])
    .setDataset(data)
    .setIncludedPaths(pathRegexArray)
const seIgn = new Jhaystack()
    .setTraversalStrategy(TraversalStrategy.RETURN_ROOT_ON_FIRST_MATCH)
    .setComparisonStrategy([ComparisonStrategy.FUZZY])
    .setDataset(data)
    .setExcludedPaths(pathRegexArray)
const resultsIncluded = seInc.search("tm")
//[{ path: ["otherNameAttribute"], depth: 1, item: { otherNameAttribute: "tim" }]
const resultsIgnored = seIgn.search("tm")
//[{ path: ["name"], depth: 1, item: { name: "tom" }]
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
FULL_TEXT   |   This strategy will determine if all the words in the term are contained inside of the context (not case sensitive!)

You can easily build your own strategy, by supplying Jhaystack with a custom function reference. The function should return a boolean that states if it is a match or not, and takes the following arguments:
Argument | Description
--- | ---
term*   |   The value to be searched for
context*   |   The value to be searched

### Gotchas
Changing included/excluded paths will cause the engine to have to revalidate the internal shard list which is a fairly heavy operation. It is therefore recommended to set the dataset last of all in the chain of intial setup actions.

### Future work
There are quite a few things that I hope to do moving forward:
- Implement search indexes
- Make more detailed tests
- Expand the list of comparison strategies
- Convert the project codebase to Typescript
- Convert certain heavy operations to WebAssembly