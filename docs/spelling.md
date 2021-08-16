# Spelling Strategy

Spelling strategies can be used to correct (or suggest corrections for) user provided queries. Multiple strategies can be provided to Jhaystack. Note that spellers will require additional memory and time for index construction.

You can use the spelling strategy like so:

```javascript
import { Jhaystack, SpellingStrategy } from "jhaystack"

const data = [
    "hello",
    "world"
]

const options = {
    data: data,
    spelling: {
        strategy: [SpellingStrategy.TRIGRAM_SPELLER]
    }
}
const se = new Jhaystack(options)

//You can also build the spellers manually:
se.setSpellingStrategy([SpellingStrategy.TRIGRAM_SPELLER], true)
se.buildSpellers()

//Finally to check the spelling you can use:
se.checkSpelling("hello wordl")
// -> {result: "hello world", corrections: [{ word: "wordl", suggestion: "world" }] }
```

!> **Tip**  
_Note that when you add / remove documents from your Jhaystack instance you will need to manually rebuild your spellers using the buildSpellers() function._

Jhaystack comes with the following spellers built in.

> ## TRIGRAM_SPELLER

The trigram speller breaks all words in the provided dataset down into their trigrams, and makes suggestions based on the best possible matches for the provided terms.

> ## Custom Spelling Strategy

Developers can create their own spelling strategies that can be plugged into Jhaystack. You can use the following interface:

```javascript
interface ISpelling {
    /** All primitive values in the dataset will be provided here */
    build: (values: any[]) => void
    /** Suggest a replacement for value x. If no replacement exists, return null */
	evaluate: (value: any) => string | null
}
```