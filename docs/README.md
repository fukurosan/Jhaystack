# Getting started

## What is Jhaystack?
Jhaystack is a JavaScript search engine.

Jhaystack aims to be a library that can scale together with projects as requirements grow more complex. Every part of the library is built to be customizable as well as unit testable, with support for a variety addons. 

Jhaystack allows you to search through not just values but also objects and arrays, and fine tune your search in order to fit a variety of different use cases. Jhaystack is not limited to only evaluating strings, but can also be customized to evaluate other data types like dates, numbers, or even regular expressions. Jhaystack also allows for data exploration, where property paths are either not known in advance, or only partially known.

?> The word Jhaystack is a play of words with "JS-Stack", and was coined because it `helps you find a needle in a JS-Stack`.

## Why use Jhaystack?
- Modular and customizable
- Compatible with most runtime environments
- Zero dependencies
- Addons can easily be unit tested
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
*If you load the library bundle using a script element then a global variable called `jhaystack` will be created. All examples in these docs use standard ES import statements, but in this case you can omit these and instead access the necessary parts of the library by using `jhaystack.X.*`

```html
<script>
//No
import { Jhaystack, ComparisonStrategy } from "jhaystack"
//Yes
jhaystack.Jhaystack
jhaystack.ComparisonStrategy
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
//[{ path: ["name"], item: { name: "tom" }, value: "tom", relevance: 0.49999999, score: 0.49999999}, { path: ["name"], item: { name: "tim" }, value: "tim", relevance: 0.49999999, score: 0.49999999 }]

//Or async and multi-threaded:
se.searchAsync("tm").then(result => {})
```

---
