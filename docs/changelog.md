# Changelog

### 0.2.0 (next) TBR

- TODO:: Implement Storage Strategy
- TODO:: Implement Logging Strategy

### 0.1.0

- Added new index implementation
- Added Cluster Strategy support
- Added KMeans cluster strategy
- Added Range cluster strategy
- Added Spelling Strategy support
- Added Trigram Spelling Strategy
- Added Ranking Strategy support
- Added TFIDF ranking strategy
- Added BM25 ranking strategy
- Added tokenizer Strategy support
- Added NGram tokenizer strategy
- Added EdgeGram tokenizer strategy
- Added Shingle tokenizer strategy
- Added Word tokenizer strategy
- Added Full-Text Scoring strategy support
- Added Cosine Full-Text scoring strategy
- Added Magnitude Full-Text scoring strategy
- Added Query Planner
- Added full-text search
- Added binary queries
- Added new options for search functions
- Implemented thread planner
- Moved (mostly) search execution off main thread
- Added multi-threading support
- Added dependency management for multi-threaded functions
- Added optional automatic k-value computation for Bitap based on term length
- Improved test runner performance by lowering concurrent number of workers
- Ended support for legacy browsers (IE11)
- Removed ability to set multiple default comparison strategies
- Various bug fixes and performance improvements


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
