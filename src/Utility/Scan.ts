import SearchResult from "../Model/SearchResult"
import Document from "../Model/Document"
import Declaration from "../Model/Declaration"
import IComparison from "../Model/IComparison"
import IComparisonResult from "../Model/IComparisonResult"
import { runManyInThread, getMaxThreadCount } from "../ThreadPlanner/ThreadPlanner"

interface IComparisonMatch {
	declaration: Declaration | null
	score: number
	weightedScore: number
	metaData: IComparisonResult | null
}

/**
 * Finds all documents in the given document array with matching declarations. Always finds the best matching declaration.
 * @param {Document[]} documentArray - Array of documents to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison} comparisonFunction - Function to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FULL_SCAN = (documentArray: Document[], searchValue: any, comparisonFunction: IComparison, limit?: null | number): SearchResult[] => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[] = []
	for (let documentIndex = 0; documentIndex < documentArray.length; documentIndex++) {
		const doc = documentArray[documentIndex]
		const foundDeclaration = doc.declarations.reduce(
			(bestMatch: IComparisonMatch, declaration) => {
				const comparisonResult = comparisonFunction(searchValue, declaration.value)
				const score =
					typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
				const weightedScore = score * declaration.normalizedWeight
				if (weightedScore > bestMatch.weightedScore) {
					return {
						declaration,
						score,
						weightedScore,
						metaData: typeof comparisonResult === "object" ? comparisonResult : null
					}
				}
				return bestMatch
			},
			{ score: 0, weightedScore: 0, declaration: null, metaData: null }
		)
		if (foundDeclaration.score) {
			matches.push(
				new SearchResult(
					doc.origin,
					doc.originIndex,
					foundDeclaration.declaration!.path,
					foundDeclaration.declaration!.originValue,
					foundDeclaration.weightedScore,
					foundDeclaration.score,
					foundDeclaration.declaration!.weight,
					foundDeclaration.declaration!.normalizedWeight,
					foundDeclaration.metaData
				)
			)
			if (limit && matches.length >= limit) {
				break
			}
		}
	}
	return matches
}

/**
 * Finds all documents in the given document array with matching declarations. Always finds the best matching declaration.
 * This function is multi-threaded and runs off the main thread.
 * @param {Document[]} documentArray - Array of documents to traverse
 * @param {any} searchValue - Value to search for
 * @param {IComparison} comparisonFunction - Function to use for value comparison
 * @param {number} limit - Maximum number of matches
 * @return {SearchResult[]} - A list of search results
 */
export const FULL_SCAN_ASYNC = async (
	documentArray: Document[],
	searchValue: any,
	comparisonFunction: IComparison,
	limit?: null | number
): Promise<SearchResult[]> => {
	if (limit !== undefined && limit !== null && limit < 1) {
		return []
	}
	const matches: SearchResult[] = []
	let promises = []
	//Documents to be parsed per thread
	//Note: If this number is set to high it will cause a maximum call stack exceeded error.
	const operationBatchSize = limit ? 300 : Math.min(Math.round(documentArray.length / getMaxThreadCount()), 2000)
	//Amount of threads to queue before waiting
	const threadBatchSize = getMaxThreadCount()
	let documentOperations = []
	let operationsSize = 0
	for (let documentIndex = 0; documentIndex < documentArray.length; documentIndex++) {
		const doc = documentArray[documentIndex]
		const operations = doc.declarations.map(declaration => [searchValue, declaration.value])
		documentOperations.push({
			doc,
			operations
		})
		operationsSize += operations.length
		if (operationsSize >= operationBatchSize || documentIndex === documentArray.length - 1) {
			operationsSize = 0
			const operationHolder = [...documentOperations]
			const flatOperationList = documentOperations
				.map(op => op.operations)
				.reduce((acc, operation) => {
					operation.forEach(args => acc.push(args))
					return acc
				}, [])
			const batchPromise = runManyInThread(comparisonFunction, ...flatOperationList).then(results => {
				operationHolder.forEach(operation => {
					const documentResults = results.splice(0, operation.operations.length)
					const searchResult = findDocumentMatch(documentResults, operation.doc)
					if (searchResult) {
						matches.push(searchResult)
					}
				})
			})
			promises.push(batchPromise)
			documentOperations = []
		}
		if (limit && !(promises.length % threadBatchSize)) {
			await Promise.all(promises)
			promises = []
			if (matches.length >= limit) {
				break
			}
		}
	}
	await Promise.all(promises)
	if (limit && matches.length > limit) {
		return matches.slice(0, limit)
	}
	return matches
}

/**
 * Finds the best comparison result for a document and returns a search result object for it.
 * @param declarationResults - Array of comparison results
 * @param doc - Document that the declarations belong to
 */
const findDocumentMatch = (declarationResults: (number | IComparisonResult)[], doc: Document): SearchResult | null => {
	const foundDeclaration = declarationResults.reduce(
		(bestMatch: IComparisonMatch, comparisonResult: number | IComparisonResult, index: number) => {
			const score = typeof comparisonResult === "number" && isFinite(comparisonResult) ? comparisonResult : (<IComparisonResult>comparisonResult).score
			const weightedScore = score * doc.declarations[index].normalizedWeight
			if (weightedScore > bestMatch.weightedScore) {
				return {
					declaration: doc.declarations[index],
					score,
					weightedScore,
					metaData: typeof comparisonResult === "object" ? comparisonResult : null
				}
			}
			return bestMatch
		},
		{ score: 0, weightedScore: 0, declaration: null, metaData: null }
	)
	if (foundDeclaration.score) {
		return new SearchResult(
			doc.origin,
			doc.originIndex,
			foundDeclaration.declaration!.path,
			foundDeclaration.declaration!.originValue,
			foundDeclaration.weightedScore,
			foundDeclaration.score,
			foundDeclaration.declaration!.weight,
			foundDeclaration.declaration!.normalizedWeight,
			foundDeclaration.metaData
		)
	} else {
		return null
	}
}
