# Getting started

## What is Jhaystack?
Jhaystack is a lightweight JavaScript search engine.

?> The word Jhaystack is a play of words with "JS-Stack", and was coined because it `helps you find a needle in a JS-Stack`.

Jhaystack allows you to search through not just values but also objects and arrays, and fine tune your search in order to fit a variety of different use cases. Jhaystack is not limited to only evaluating strings, but can also be customized to evaluate other data types like dates, numbers, or even regular expressions.

## Why use Jhaystack?
- Modular and customizable
- Compatible with most runtime environments
- Zero dependencies
- Fast searches
- Simple to use
- No dedicated search backend needed
  
---

> ## Installation

Install using npm:

```bash
$ npm install jhaystack
```

Load using a script element:
```html
<script src="https://unpkg.com/jhaystack"></script>
```

!> **Tip**  
*If you load the library bundle using a script element then a global variable called Jhaystack will be created. All examples in these docs use standard ES import statements, but in this case you can omit these and instead access the necessary parts of the library by using Jhaystack.X.*

```html
<script>
//No
import { Jhaystack, ComparisonStrategy } from "jhaystack"
//Yes
Jhaystack.Jhaystack
Jhaystack.ComparisonStrategy
</script>
```

!> **Tip**  
*With the commonjs build you can also use require statements like so:*
```javascript
const { Jhaystack, ComparisonStrategy } = require("jhaystack")
```

---

> ## Using the library

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
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0}, { path: ["name"], item: { name: "tim" }, value: "tim", relevance: 0.749999995, comparisonScore: 0.49999999, comparisonIndex: 0 }]
```

---

> ## Results

The result of a search will be an array of objects. Each search result object has the following properties:
	
- `item:` The item where the result was found
- `path:` The path to the matched value inside of the item, expressed as an array of steps
- `value:` The value that produced the match
- `relevance:` The relevance of the match on a scale from 0-1
- `comparisonScore:` The score from the value comparison function on a scale from 0-1
- `comparisonIndex:` The index of the comparison function that found the match

#### Relevance

Relevance is a score of how relevant a matched result is believed to be. Jhaystack provides the relevance score in the form of a number between 0 and 1, 0 being a complete mismatch, and 1 being a perfect match.

The relevance score should not be considered an absolute number. In other words, 0.5 does not mean that the match is half as relevant than 1 - instead it simply means that the match is *less* relevant.

When relevance is calculated the order of comparison function will always takes precedence. Secondarily relevance will be based on the score of the comparison function. And, thirdly, there may be parts of the comparison function that scores values differently based on different criteria and circumstances.

To learn more about scary words like comparison strategy, please check out the docs. (hint: its really not that scary!)
