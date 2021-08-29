# Spelling Strategy

The spelling strategy allows for configuration of spelling-correction of user provided input. This allows you to implement "Did you mean?" functionality, give preemptive suggestions, as well as auto-correct input from the user to improve the quality of search results.

Multiple strategies can be provided to Jhaystack. Note that spelling strategies will require additional memory and time for index construction.

You can use a spelling strategy like so:

```javascript
import { Jhaystack, SpellingStrategy } from "jhaystack"

const data = [
    "hello",
    "world"
]

const options = {
    data: data,
    spelling: {
        strategy: [
            {
                id: "ngram",
                strategy: SpellingStrategy.NGRAM
            }
        ]
    }
}
const se = new Jhaystack(options)

//You can also build the spelling strategies manually:
se.setSpellingStrategy(
    [
        {
            id: "ngram",
            strategy: SpellingStrategy.NGRAM
        }
    ], true
)
se.buildSpellers()

//Finally to check the spelling you can use:
se.checkSpelling("hello wordl")
// -> {result: "hello world", corrections: [{ word: "wordl", suggestion: "world" }] }

//The above example will execute all provided strategies in the order they have been provided until all words have been either corrected or all spelling strategies have been executed.
//To only execute a specific speller you can provide its id as a second argument:
se.checkSpelling("hello wordl", "ngram")
```

!> **Tip**  
_Note that when you add / remove documents from your Jhaystack instance you will need to manually rebuild your spelling strategies using the buildSpellers() function._

Jhaystack comes with the following spelling strategies built in.

> ## NGRAM

The ngram speller breaks all words in the provided dataset down into their n-grams, and makes suggestions based on the best possible matches for the provided terms. In order to minimize false positives a corrected word can never be more than two letters longer than the provided input. For stalemates between suggestsions the damerau distance will be used to determine the best match. 

This strategy is a great general purpose spell checker and a good place to start if you are not sure what to choose. Works fairly well even with small datasets.

The following options can be configured:
 - **gramSize** 
   - **Description**: *Size of the grams to be used for tokenizing words. This should usually be either 2 or 3. Generally 3 will be more accurate, but with less of a hit rate than 2.*
   - **Type**: `number`
   - **Default**: `2`
 - **captureStartEnd** 
   - **Description**: *Should the start and end of each word be captured?*
   - **Type**: `boolean`
   - **Default**: `false`

--- 

> ## SOUNDEX

Determines suggestions based on a phonetic algorithm (i.e. what a words sound like). Soundex encodes words by the way they sound, and then makes suggestions based on the encoding. Soundex has been around for a long time. It is primarily useful when dealing with things like human names, where there may be many different spellings that sound similar and are prone to mistakes.

The Soundex algorithm in Jhaystack by default uses a fuzzy-mode which is based on changes to soundex developed in 2002 and builds upon the original soundex algorithm, generally increasing both precision and recall through substitutions. This can be toggled on and off.

The soundex strategy can furthermore be configured with custom substitutions and code tables. This means that you could, for example, use it as a phonix strategy instead, by simply providing the necessary tables.

 - **fuzzy** 
   - **Description**: *If set to false the original soundex algorithm will be used. If set to true the Soundex strategy will apply fuzzy substitutions and lookup codes.*
   - **Type**: `boolean`
   - **Default**: `true`
 - **customCodes** 
   - **Description**: *A JavaScript object where a custom code table can be provided. Should be an object where every letter from a-z is represented as a key, and the value is a number representing its code*
   - **Type**: `{ [key: string]: number }`
   - **Default**: `undefined`
 - **customReplacements** 
   - **Description**: *A list of custom replacements to apply (this will overwrite the built in ones!). Note that fuzzy must be set to true in order for replacements to be applied*
   - **Type**: `{ rule: RegExp, replacement: string }[]`
   - **Default**: `undefined`

--- 

> ## NORVIG

The Norvig spelling strategy is a reference implementation of Peter Norvig's well known spelling corrector. The algorithm combines probability theory as well as some clever pre-indexed damerau distance computations to create a simple yet accurate correction algorithm.

This strategy works best with datasets containing a lot of data. You can provide your own dataset in the build options in order to improve performance of the algorithm.

The following options can be configured:
 - **customDataset** 
   - **Description**: *A custom dataset to be used for building the word index. If provided this will be used rather than the main dataset currently in the engine.*
   - **Type**: `Map<string, { count: number }>`
   - **Default**: `undefined`

--- 

> ## Custom Spelling Strategy

Developers can create their own spelling strategies that can be plugged into Jhaystack. You can use the following interface:

```javascript
interface IWordMeta {
    /** Number of occurences in dataset */
    count: number
}

interface ISpelling {
    /** All primitive values in the dataset will be provided here */
    build: (values: Map<string, IWordMeta>, options?: any) => void
    /** Suggest a replacement for value x. If no replacement exists, return null */
	evaluate: (value: string) => string | null
}
```