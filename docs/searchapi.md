# Search API

## Basics

Jhaystack has a few different types of search functions, each with a different purpose. Below is a description of the functions, what options they accept, and how to use them.

## Queries (and / or)

Jhaystack supports queries. A query is an array of "AND" strings, "OR" strings, and search criteria statements, as well as inner arrays of these that are equivalent to a parenthesis.

For example, a query might look something like this:

- [criteriaX, "AND", criteriaY, "AND", criteriaN] 
- [criteriaX, "OR", criteriaY, "OR", criteriaN] 
- [criteriaX, "AND", [criteriaY, "OR", criteriaZ], "AND", criteriaN] 
- [criteriaX, "AND", [criteriaY, "AND", criteriaZ], "OR", criteriaN] 

A criteria describes an operation that acts as a filters for the result. Each operation takes the result from the former operation and filters it down further, until either the result is empty, or all criteria have been met.

A criteria is an object. There are three types of criteria that can be specified. Each criteria has a mandatory type property, as well as an optional cost property. The type property describes what type of criteria it is, and the optional cost property can be used to override Jhaystack's internal query planner's cost computation by providing your own cost. Generally, the internally computed cost will never go below 0, nor above 1000. A lower number means the operation should be executed sooner in the chain, and a higher number means it should be executed later in the chain.

> ### Cluster Criteria

Cluster criteria queries a cluster with a given set of options. If the query is specified as a filter for a search operation (search() and fulltext(), see below) then the document passed to the evaluation function will be based on the provided search value. Otherwise no document will be passed.

To execute a cluster criteria, specify "type: 'cluster'"

The following options can be passed on the cluster criteria objects:
 - **id** 
   - **Description**: *Mandatory ID of which cluster should execute the evaluation*
   - **Type**: `string`
   - **Default**: `undefined`
 - **options** 
   - **Description**: *Optional query options for the cluster. Check each cluster type's documentation for more information.*
   - **Type**: `any`
   - **Default**: `undefined`

> ### Index Criteria

Index criteria uses the index strategy to execute a search for matches. A match is constituted by a document in the data set that has all tokens in the search value, as well as potentially other criteria specified in the options.

To execute an index criteria, specify "type: 'index'"

The following options can be passed on the index criteria objects:
 - **value** 
   - **Description**: *Mandatory Value to search for*
   - **Type**: `any`
   - **Default**: `undefined`
 - **exact** 
   - **Description**: *Do the positions of the tokens of the search value matter?*
   - **Type**: `boolean`
   - **Default**: `undefined`
 - **field** 
   - **Description**: *If only a specific field in the index should be searched it can be specified here as a "." (dot) separated string.*
   - **Type**: `string`
   - **Default**: `undefined`

> ### Comparison Criteria

Comparison criteria uses comparison functions to scan values in the data set for matches.

To execute a comparison criteria, specify "type: 'comparison'"

The following options can be passed on the comparison criteria objects:
 - **value** 
   - **Description**: *Mandatory Value to search for*
   - **Type**: `any`
   - **Default**: `undefined`
 - **strategy** 
   - **Description**: *Optional comparison function to be used. If not provided the global default will be used*
   - **Type**: `Function`
   - **Default**: `undefined`
 - **field** 
   - **Description**: *If only a specific field in the index should be searched it can be specified here as a "." (dot) separated string.*
   - **Type**: `string`
   - **Default**: `undefined`

--- 

## Search API

> ### query(query, options?)

The query function is a binary search that accepts a Jhaystack query object and returns all objects that match the query. 

The following options can be specified:
 - **limit** 
   - **Description**: *Optional limit for how many results to retrieve. If not specified the global default will be used.*
   - **Type**: `number`
   - **Default**: `undefined`

> ### queryAsync(query, options?)

Works identically to query() but is asynchronous and multi-threaded. Note that any comparison function provided to this function must support serialization. Check the comparison strategy chapter for more information

> ### search(value, options?)

The search function executes a search using comparison functions based on the provided search value.

The following options can be specified:
 - **limit** 
   - **Description**: *Optional limit for how many results to retrieve. If not specified the global default will be used.*
   - **Type**: `number`
   - **Default**: `undefined`
 - **filter** 
   - **Description**: *Optional query to execute as an inexact k retrieval. If provided the search will be executed on the resulting objects from the query, otherwise the entire corpus*
   - **Type**: `IQuery`
   - **Default**: `undefined`

> ### searchAsync(value, options?)

Works identically to search() but is asynchronous and multi-threaded. Note that any comparison function provided to this function must support serialization. Check the comparison strategy chapter for more information

> ### fulltext(value, options?)

The fulltext function executes a full-text search using the index strategy based on the provided search value.

The following options can be specified:
 - **limit** 
   - **Description**: *Optional limit for how many results to retrieve. If not specified the global default will be used.*
   - **Type**: `number`
   - **Default**: `undefined`
 - **filter** 
   - **Description**: *Optional query to execute as an inexact k retrieval. If provided the search will be executed on the resulting objects from the query, otherwise the entire corpus*
   - **Type**: `IQuery`
   - **Default**: `undefined`
 - **exact** 
   - **Description**: *Do the positions of the tokens of the search value matter?*
   - **Type**: `boolean`
   - **Default**: `undefined`
 - **field** 
   - **Description**: *If only a specific field in the index should be searched it can be specified here as a "." (dot) separated string.*
   - **Type**: `string`
   - **Default**: `undefined`

> ### fulltextAsync(value, options?)

Works identically to fulltext() but is asynchronous and multi-threaded. Note that any comparison function provided to this function must support serialization. Check the comparison strategy chapter for more information

--- 

## Results

The result of a search will be an array of objects. Each search result object has the following properties:
	
- `item:` The item where the result was found
- `itemIndex:` The index of the item in the original array
- `path:` The path to the matched value inside of the item, expressed as an array of steps
- `value:` The value that produced the match
- `relevance:` The relevance of the match on a scale from 0-1
- `score:` The score from the scoring function
- `weight:` The assigned weight of the matched value
- `normalizedWeight:` The normalized weight of the matched value on a scale from 0-1
- `metaData` Metadata about the result. Content varies depending on, for example, the comparison function used

#### Relevance

Relevance is a score of how relevant a matched result is believed to be. Jhaystack provides the relevance score in the form of a number between 0 and 1, 0 being a complete mismatch, and 1 being a perfect match.

The relevance score should not be considered an absolute number. In other words, 0.5 does not mean that the match is half as relevant than 1 - instead it simply means that the match is *less* relevant. When relevance is calculated it is primarily based on the score of the comparison function, but takes into account things like weights.

To learn more about scary words like comparison function, please check out the docs. (hint: its really not that scary!)

--- 

## Examples

```javascript
import { Jhaystack } from "jhaystack"

const data = [
	"My name is tim and I like pancakes",
	"My name is tim and I like waffles"
]

const options = {
	data: data,
}

const query = [
    {
        type: "comparison",
        value: "my",
        strategy: (term, context) => context.startsWith(term)
    },
    "AND",
    {
        type: "comparison",
        value: "waffles",
        strategy: (term, context) => context.endsWith(term)
    }
]

const se = new Jhaystack(options)
const result = se.search("jim", { filter: query })
result.length // -> 1
```
