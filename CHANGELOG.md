# Changelog

### 0.0.54
- Added optional automatic k-value computation for Bitap based on term length
- Improved test runner performance by lowering concurrent number of workers
- Various bug fixes


### 0.0.53

 - Rewrote traversal strategies into extraction strategies


### 0.0.52

- Added Scrubber preprocessor
- Added English Stop Words preprocessor
- Added Porter2 stemmer preprocessor
- Added Lancaster stemmer preprocessor


### 0.0.51

- Added Cosine distance comparison strategy
- Added Levenshtein distance comparison strategy
- Added Damerau-Levenshtein distance comparison strategy
- Added Euclidean distance comparison strategy
- Added Hamming distance comparison strategy
- Added Jaccard distance comparison strategy
- Added Jaro-Winkler distance comparison strategy
- Added Longest Common Substring comparison strategy
 

### 0.0.40

- Added ability to add and remove individual items from search data set
- Added value preprocessors
- Implemented improved relevance scoring strategy
- Implemented pattern filters
- Implemented weighted search
- Implemented search meta data
- Simplified comparison functions
- Added index of the result item in the original array to search result object


### 0.0.39

- Switched bundler from webpack to rollup
- Added additional builds for different purposes
- Added eslint to project
- Added prettier to project
- Added editorconfig file
- Updated babel config
- Added new startsWith index strategy
- Added new regular expression comparison strategy
- Created better docs
- Improved typings
- Improved relevance score from bitap
