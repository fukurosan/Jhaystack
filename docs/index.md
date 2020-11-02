# Index Strategy

Jhaystack allows you to create indexes. This type of search is often referred to as an offline search. An offline search is incredibly fast, but requires more memory in order to hold the index, as well as a larger initial executional load in order to create the index. Offline searches usually work quite differently under the hood from how online searches work. Depending on your needs and setup this could be a great option for dealing with large datasets.

Index searching should be considered as an alternative to using traversal and comparison strategies (online searching). The two are not affected by each other in any way. This is simply because of how different the two approaches to searching is. 

Offline search will be evaluated based on the type of index. You can instruct Jhaystack to create multiple types of indexes based on your needs. Indexes will respect certain configured settings such as paths, result limits and sorting.

Example:
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

Jhaystack currently comes with the following index types:

> ## TRIGRAM

An n-gram implementation where n=3. This index will perform searches based on separating values into character sets of 3. Or, in other words, it’s your go to fuzzy search index.

---

> ## WORD

Separates all words inside of values and compares them to words provided in a search term. Suitable for searching through long sentences for long search strings.

---

> ## STARTS_WITH

Creates an index of starts-with matches (not case sensitive!).

---

> ## VALUE

Creates an index of exact matches (not case sensitive!).