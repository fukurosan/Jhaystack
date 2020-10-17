# Jhaystack
A zero dependency JSON search utility. Jhaystack is built to be customizable, modular and fast. Jhaystack also works really well with data exploration or where data structures are only partially known in advance.

### Installation
Install using NPM:

```
npm install jhaystack
```

Load using a script element:
```html
<script src="https://unpkg.com/jhaystack/bundle/bundle.js"></script>
```

If you load the library bundle using a script element then you will be able to access a variable called "Jhaystack". All examples below use standard ES import statements, but in this case you can omit these and instead access the necessary parts of the library by using "Jhaystack.X".
In other words:
```html
<script>
//No
import { Jhaystack, ComparisonStrategy } from "jhaystack"
//Yes
Jhaystack.Jhaystack
Jhaystack.ComparisonStrategy
</script>
```

### Get started
Using the library in its simplest form is extremely easy:

```javascript
import { Jhaystack } from "jhaystack"

const data = [
    {
        name: "tom"
    },
    {
        name: "tim"
    }
]
const se = new Jhaystack({data: data})
const results = se.search("tm")
//[{ path: ["name"], depth: 1, item: { name: "tom" }, value: "tom", relevance: 0.5 }, { path: ["name"], depth: 1, item: { name: "tim" }, value: "tim", relevance: 0.5 }]
```

#### Results
The result of a search will be an array of objects. Each object has the item itself (.item) where a match was found, a path (.path) to where in the object the match was found, the actual value (.value) that was matched, a depth (.depth) specifying how many steps into the structure the match was found, and finally the relevance (.relevance) of the match.

#### Relevance
Relevance is a score of how relevant a matched result is. Jhaystack provides the relevance score in the form of a number between 0 and 1, 0 being a complete mismatch, and 1 being a perfect match.

Relevance is based on multiple criteria in each specific setup, and should not be considered an absolute number. 0.5 does not mean that the match is half as relevant than 1, instead it simply means that the match is *less* relevant. Furthermore it is worth noting that, depending on how you have configured Jhaystack, a match from the same comparison strategy can in different scenarios result in a different relevance. This is simply because in some scenarios the order of comparison strategies provided to Jhaystack matters when determining match relevance. And, in fact, in some traversal strategies the relevance is considered to be binary.

To learn more about scary words like comparison strategy and traversal strategy, keep reading. (Secret: it’s about as scary and a jar of marmalade, the sugary kind.)

#### Options
Jhaystack’s constructor accepts an options object where you can specify your configuration settings. Below is a description of the different options. Note that you can also change these options using the built in functions on the Jhaystack instance after instantiation. This way you can change things after the fact that you’ve already created your instance. Note, though, that changing certain options can cause indexes to have to be rebuilt resulting in load times.

Options:
Option | Description
--- | ---
data   |   Array of JSON objects to be searched.
includedPaths   |   Array of regular expressions that evaluate valid value paths to be evaluated for matches.
excludedPaths   |   Array of regular expressions that evaluate invalid value paths that should not be evaluated for matches.
comparison   |   Array of comparison strategies to be used when evaluating if a value is a match or not.
traversal   |   A traversal strategy that describes to Jhaystack how to traverse and interact with the search data when searching.
sorting   |   Array of sorting functions that describe the order in which the results of a search should be sorted.
index   |   Array of index definitions to be built and used for offline searching.
limit   |   Integer that sets the maximum number of search matches to be collected before searching stops.


###  Specifying Paths
Jhaystack by default scans all attributes and paths for the given search term match, but can be configured to include or exclude different path patterns. You do this by providing an array of regular expressions (either as RegExp objects, or as strings). The expressions provided will be evaluated against a string representation of the path inside the JSON object. The string will be formatted with a "." separating each step in the structure. An exclude pattern will always take precedence over an include pattern.

It is really straight forward to use:
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

const optionsInc = {
    data: data,
    includedPaths: [/^other/]
}
const seInc = new Jhaystack(optionsInc)

const optionsExc = {
    data: data,
    excludedPaths: [/^other/]
}
const seExc = new Jhaystack(optionsExc)

const resultsIncluded = seInc.search("tm")
//[{ path: ["otherNameAttribute"], depth: 1, item: { otherNameAttribute: "tim" }, value: "tim", relevance: 0.5 }]
const resultsExcluded = seExc.search("tm")
//[{ path: ["name"], depth: 1, item: { name: "tom" }, value: "tom", relevance: 0.5 }]
```


### Comparison Strategy
The comparison strategy defines how Jhaystack compares the search term with values to evaluate if it has found a match or not. You can configure Jhaystack to use different strategies depending on your needs by passing an array with the strategies that you want to use. Remember that depending on your other settings the order of the provided strategies may or may not matter. Performance will also vary depending on your choice of strategy.

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
        name: "a ton of strategy"
    }
]

const options = {
    data: data,
    comparison: [ComparisonStrategy.STARTS_WITH, ComparisonStrategy.ENDS_WITH]
}

const se = new Jhaystack(options)
const result = se.search("ton")
//[{ path: ["name"], depth: 1, item: { name: "tony" }, value: "tony", relevance: 0.99 }, { path: ["name"], depth: 1, item: { name: "paddington" }, value: "paddington", relevance: 0.49 }]
```

Jhaystack currently comes with the following comparison strategies:
Strategy | Description
--- | ---
BITAP (default)   |   Determines if the term can be found inside of the context within a Levenshtein distance of 2. (not case sensitive!)
FUZZY_SEQUENCE   |   Determines if all letters of the term exist somewhere inside the context, in the given order but not necessarily right after each other. (not case sensitive!)
STARTS_WITH   |   Determines if the context starts with the term.
STARTS_WITH_CASE_INSENSITIVE   |   Determines if the context starts with the term.  (not case sensitive!)
ENDS_WITH   |   Determines if the context ends with the term.
ENDS_WITH_CASE_INSENSITIVE   |   Determines if the context ends with the term.  (not case sensitive!)
CONTAINS   |   Determines if the context contains the term.
CONTAINS_CASE_INSENSITIVE   |   Determines if the context contains the term. (not case sensitive!)
EQUALS   |   Determines if the term is exactly the context.
EQUALS_CASE_INSENSITIVE   |   Determines if the term is exactly the context. (not case sensitive!)
CONTAINS_ALL_WORDS   |   Determines if all the words in the term are contained inside of the context. (not case sensitive!)

You can easily build your own strategy, by supplying Jhaystack with a custom function reference. The function should return a number between 0 and 1 that determines the relevance of the match, 1 being a perfect match and 0 being no match at all. The function should take the following arguments:
Argument | Description
--- | ---
term*   |   The value to be searched for.
context*   |   The value to be searched.


### Traversal Strategy
The traversal strategy defines how Jhaystack traverses the object tree while searching for value matches, as well as what makes it stop traversal, and what it returns as a result item.

Example:
```javascript
import { Jhaystack, TraversalStrategy } from "jhaystack"

const data = [
    {
        children: [
            {
                name: "tom"
            }
        ]
    }
]

const options = {
    data: data,
    traversal: TraversalStrategy.EXTRACT_ALL_NESTED
}

const se = new Jhaystack(options)
const result = se.search("tom")
//[{ path: ["name"], depth: 1, item: { name: "tom" }, value: "tom", relevance: 1 }]
```

Jhaystack currently comes with the following traversal strategies:
Strategy | Description
--- | ---
RETURN_ROOT_ON_FIRST_MATCH_ORDERED (default)   |   Stops traversal of an object as soon as a value match is found. Returns the entire root object in the result. Guarantees matches in order of provided comparison strategy read from left to right. Relevance will also take the order of comparison strategy into account, and a higher prioritized comparison match will *always* be considered more relevant than its lower priority counterparts.
RETURN_ROOT_ON_FIRST_MATCH   |   Stops traversal of an object as soon as a value match is found. Returns the entire root object in the result. Considers all comparison strategies to be of equal worth. The latter means that this strategy in scenarios with multiple provided comparison strategies will perform faster than the above, ordered, strategy, but could potentially generate less accurate results.
EXTRACT_ALL_NESTED   |   This strategy will continue traversal until every single branch object has been checked, and will return the nested object where the match was actually found (i.e. not the root!). This is great if you want to locate and extract branch/leaf objects from complex JSON objects. Considers all comparison strategies to be of equal worth.


### Sorting Strategy
The sorting strategy defines how Jhaystack sorts the search result. If no strategy is provided you should consider the result items to be in random order. To configure the sorting you provide Jhaystack with an array of sorting strategies that will be evaluated in order of the array. In other words, first sort by A, then B, then C, and so on.

Example:
```javascript
import { Jhaystack, SortingStrategy } from "jhaystack"

const data = [
    {
        child: {
            name: "timmy"
        }
    },
    {
        name: "tony"
    },
    {
        name: "timmy"
    }
]

const options = {
    data: data,
    sorting: [SortingStrategy.RELEVANCE.DESCENDING, SortingStrategy.DEPTH.ASCENDING]
}

const se = new Jhaystack(options)
const result = se.search("toy")
//[{ path: ["name"], depth: 1, item: { name: "tony" }, value: "tony", relevance: 0.5 }, { path: ["name"], depth: 1, item: { name: "timmy" }, value: "timmy", relevance: 0.3333333333333333 }, { path: ["child", "name"], depth: 2, item: { child: { name: "timmy" } }, value: "timmy", relevance: 0.3333333333333333 }]
```

Jhaystack currently comes with the following sorting strategies:
Strategy | Description
--- | ---
VALUE   |   Sorts by the value of the found match.
ATTRIBUTE   |   Sorts by the name of the attribute where the match was found.
DEPTH   |   Sorts by the depth of the match.
RELEVANCE   |   Sorts by the relevance of the match.

You can easily provide your own custom sorting function as well by specifying a valid javascript array sorting function.


### Index Strategy
Jhaystack allows you to create indexes. This type of search is most often referred to as an offline search. An offline search is incredibly fast, but requires more memory in order to hold the index. Depending on your needs and setup this could be a great option for dealing with larger datasets.

Index searching should be considered as an alternative to using traversal and comparison strategies (online searching). The two are not affected by each other in any way. Instead, index matches will be evaluated based on the type of index. You can instruct Jhaystack to create multiple types of indexes based on your needs.

Indexes will respect configured settings such as paths, result limits and sorting.

Using indexes in Jhaystack is extremely simple:
```javascript
import { Jhaystack, IndexStrategy } from "jhaystack"

const data = [
    {
        phrase: "You can call me Timmy!"
    }
]

const options = {
    data: data,
    index: [IndexStrategy.TRIGRAM]
}

const se = new Jhaystack(options)
const result = se.indexLookup("Can you call me Tommy?")
//[{ path: ["phrase"], depth: 1, item: { phrase: "You can call me Timmy!" }, value: You can call me Timmy!", relevance: 0.75 }]
```

Jhaystack currently comes with the following index strategies:
Strategy | Description
--- | ---
TRIGRAM   |   An n-gram implementation where n=3. This index will perform string approximation searches based on separating values into character sets of 3. Or, in other words, it’s your go to fuzzy search index.
WORD   |   Separates all words inside values, and compares them to words provided in a search term. Suitable for searching through long sentences for long search strings.
VALUE   |   Creates an index of exact matches (not case sensitive!). Great for when you are only looking for exactly matching values.


### Roadmap
The current roadmap moving forward:
- Make more detailed tests
- Chunk comparison execution into web workers