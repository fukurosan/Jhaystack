# Search API

## Basics

Jhaystack has a few different types of search function, each with a different purpose. Each search function also accepts options. Below is a description of the functions and how to use them.

## Queries

Jhaystack supports queries. A query is an array of "AND" strings, "OR" strings, and search criteria statements, as well as inner arrays of these that are equivalent to a parenthesis.

For example, a query might look something like this:

- [criteriaX, "AND", criteriaY, "AND", criteriaN] 
- [criteriaX, "OR", criteriaY, "OR", criteriaN] 
- [criteriaX, "AND", [criteriaY, "OR", criteriaZ], "AND", criteriaN] 
- [criteriaX, "AND", [criteriaY, "AND", criteriaZ], "OR", criteriaN] 

A criteria describes an operation that filters down the result. Each operation takes the result from the former operation and filters it down further, until either the result is empty, or all criteria have been evaluated.

A criteria is an object. There are three types of criteria that can be specified. Each criteria has a mandatory type property, as well as an optional cost property.

The cost property helps Jhaystack determine the order in which things should be executed. You can override Jhaystacks internal cost computation by providing your own cost. Generally, the internally computed cost will never go below 0, nor above 1000.

> ### Cluster Criteria

Cluster criteria queries a cluster with a given set of options. If the query is specified as a filter for a search operation (search() and fulltext(), see below) then the document passed to the evaluation function will be based on said document. Otherwise no document will be passed.

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

Comparison criteria uses comparison functions to scan values in the data set for matches. Note that matches are considered binary for this criteria.

To execute a comparison criteria, specify "type: 'comparison'"

The following options can be passed on the comparison criteria objects:
 - **value** 
   - **Description**: *Mandatory Value to search for*
   - **Type**: `any`
   - **Default**: `undefined`
 - **exact** 
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

> ### search(value, options?)

The search function executes a search using comparison functions based on the provided search value.

The following options can be specified:
 - **limit** 
   - **Description**: *Optional limit for how many results to retrieve. If not specified the global default will be used.*
   - **Type**: `number`
   - **Default**: `undefined`
 - **filter** 
   - **Description**: *Optional query to execute before the actual search. If provided the search will be executed on the resulting objects from the query, otherwise the entire corpus*
   - **Type**: `IQuery`
   - **Default**: `undefined`

> ### fulltext(value, options?)

The fulltext function executes a full-text search using the index strategy based on the provided search value.

The following options can be specified:
 - **limit** 
   - **Description**: *Optional limit for how many results to retrieve. If not specified the global default will be used.*
   - **Type**: `number`
   - **Default**: `undefined`
 - **filter** 
   - **Description**: *Optional query to execute before the actual search. If provided the search will be executed on the resulting objects from the query, otherwise the entire corpus*
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
        value: "my"
        strategy: (term, context) => context.startsWith(term)
    },
    "AND",
    {
        type: "comparison",
        value: "waffles"
        strategy: (term, context) => context.endsWith(term)
    }
]

const se = new Jhaystack(options)
const result = se.search("jim", { filter: query })
result.length // -> 1
```