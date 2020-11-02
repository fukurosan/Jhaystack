# Traversal Strategy

The traversal strategy defines how Jhaystack traverses the object tree while searching for value matches, as well as what makes it stop traversal, and what it returns as a search result item.

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
    traversal: TraversalStrategy.FIND_NESTED_OBJECTS
}

const se = new Jhaystack(options)
const result = se.search("tom")
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.999999995, comparisonScore: 0.99999999, comparisonIndex: 0 }]
```

---

Jhaystack comes with the following possible traversal strategies:

> ## FIND_VALUES (default)

This strategy searches for any values that match the search criteria. If multiple properties on the same object match the criteria then Jhaystack will return these as multiple results. The result will contain the entire root object where the match was found.

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

> ## FIND_OBJECTS

This strategy finds the best matching value nested inside of the search item. The result will contain the entire root object where the match was found. 

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

> ## FIND_NESTED_OBJECTS

This strategy splits each data object into its nested objects and searches them separately. It then performs what is essentially a FIND_OBJECTS traversal on each separate nested object. The result will contain the nested object rather than the original one. The path of the value matched will furthermore be relative to the nested object. 

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
If you executed a search for "jhaystack" you would get two results, one for each object. And, again, jhaystack will always find the most relevant result on each nested object. This is useful if you're looking for objects that are part of other objects, but don't really care about the full object composition.
