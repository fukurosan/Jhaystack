# Extraction Strategy

The extraction strategy defines how Jhaystack interally extracts documents from the provided dataset. The extraction strategy is a tool you can use to configure how the provided data should be searched. Are you searching for values, objects, or nested objects?

Example:
```javascript
import { Jhaystack, ExtractionStrategy } from "jhaystack"

const data = [
    {
        name: "tom",
        secondName: "tom",
        children: [
            {
                name: "tom"
            }
        ]
    }
]

const options = {
    data: data,
    extraction: ExtractionStrategy.BY_NESTED_OBJECT
}

const se = new Jhaystack(options)
const result = se.search("tom")
//[{ path: ["name"], item: { name: "tom", secondName: "tom", children: { name: "tom" }}, value: "tom", relevance: 0.99999999, score: 0.99999999 }, { path: ["children", "name"], item: { name: "tom", secondName: "tom", children: { name: "tom" }}, value: "tom", relevance: 0.99999999, score: 0.99999999 }]
```

---

Jhaystack comes with the following possible extraction strategies:

> ## BY_VALUE (default)

This strategy treats each value as a separate document. In other words, if multiple properties on the same object match the criteria then Jhaystack will return these as multiple results.

Consider if you executed a search for "jhaystack" on the following object:
```javascript
const data = {
    id: "jhaystack" //match
    properties: {
        name: "jhaystack", //match
        alias: "jhaystack", //match
    }
}
```

If you executed a search for "jhaystack" you would get three results. One for id, one for name, and one for alias. This is useful if you're not necessarily interested in object composition, but rather just want to find anything that matches the given criteria.

---

> ## BY_OBJECT

This strategy treats each root object as one single document. In other words, even if multiple properties match the given search criteria it will still only generate one search result.

Let's revisit the last example. What if you executed a search for "jhaystack" on the following object:
```javascript
const data = { //match
    id: "jhaystack"
    properties: {
        name: "jhaystack",
        alias: "jhaystack",
    }
}
```

If you executed a search for "jhaystack" you would get one results. In this case all three values that match the search inside of the object are identical, but in a real world scenario jhaystack will always find the most relevant one. This is useful if what you are searching for is actually objects rather than values.

---

> ## BY_NESTED_OBJECT

This strategy splits each data object into its nested objects and extracts each nested object as a separate document.

let us bring out the example again. What if you executed a search for "jhaystack" on the following object:
```javascript
const data = { //match
    id: "jhaystack"
    properties: { //match
        name: "jhaystack",
        alias: "jhaystack",
    }
}
```
If you executed a search for "jhaystack" you would get two results, one for each object. And, again, Jhaystack will always find the most relevant result on each nested object. This is useful if you're looking for objects that are part of other objects, but don't really care about the full object composition.
