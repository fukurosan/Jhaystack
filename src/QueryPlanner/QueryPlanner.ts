import { IQueryCriteria, IQuery } from "../Model/IQuery"
import SearchEngine from "../Engine"
import { DocumentID } from "../Model/Document"

export class QueryPlanner {
	private engine: SearchEngine

	constructor(engine: SearchEngine) {
		this.engine = engine
	}

	/**
	 * Determines possible query branches
	 * [x, AND, y, AND, n] -> [[x, y, n]]
	 * [x, OR, y, OR, n] -> [[x], [y], [n]]
	 * [x, AND, [y, OR, z], AND, n] -> [[x, [[y], [z]], n]]
	 * [x, AND, [y, AND, z], OR, n] -> [[x, [[y, z]]], [n]]
	 * @param {IQuery} queryBranch - Branch to be deconstructed
	 */
	getBranchTree(queryBranch: any[]) {
		const fullBranches: any[] = []
		let currentBranch: any[] = []
		let operation = "AND"
		queryBranch.forEach(step => {
			if (typeof step === "string") {
				operation = step
			} else if (operation === "AND") {
				if (Array.isArray(step)) {
					currentBranch.push(this.getBranchTree(step))
				} else {
					currentBranch.push(step)
				}
			} else if (operation === "OR") {
				fullBranches.push(currentBranch)
				if (Array.isArray(step)) {
					currentBranch = [this.getBranchTree(step)]
				} else {
					currentBranch = [step]
				}
			}
		})
		fullBranches.push(currentBranch)
		return fullBranches
	}

	/**
	 * Flattens query branches into possible execution paths
	 * [[x, y, n]] -> [[x, y, n]]
	 * [[x], [y], [n]] -> [[x], [y], [n]]
	 * [[x, [[y], [z]], n]] -> [[x, y, n], [x, z, n]]
	 * [[x, [[y, z]]], [n]] -> [[x, y, z], [n]]
	 * @param {any[]} branch - Branch to be flattened
	 * @param {any[]} lastStep - Last branch step in the last recursive cycle
	 * @param {any[]} possibleExecutionPaths - Resulting execution paths
	 */
	flattenBranchTree(branch: any[], lastStep: any[] = [], possibleExecutionPaths: any[] = []) {
		const thisBranch = [...lastStep]
		branch.forEach(criteria => !Array.isArray(criteria) && thisBranch.push(criteria))
		const nestedSubCriteria = branch.filter(criteria => Array.isArray(criteria))
		if (nestedSubCriteria.length === 0) {
			possibleExecutionPaths.push(thisBranch)
		} else {
			nestedSubCriteria.forEach(nestedCriteria => this.flattenBranchTree(nestedCriteria, thisBranch, possibleExecutionPaths))
		}
		return possibleExecutionPaths
	}

	/**
	 * Computes the difficulty of a given criteria and returns a score. Lower means less intensive to compute.
	 * This function is still quite rudimentary and should be improved in the future.
	 * @param {IQueryCriteria} criteria - Criteria to be computed
	 */
	computeCriteriaCost(criteria: IQueryCriteria) {
		let difficulty = 0
		if (criteria.cost) {
			return criteria.cost
		}
		if (criteria.type === "cluster") {
			//Clusters should always execute first
		} else if (criteria.type === "index") {
			difficulty += 1
			if (criteria.exact) {
				difficulty += `${criteria.value}`.split(" ").length * 1.5 - 1.5
				//Handle
			}
			if (criteria.field) {
				difficulty += 1
				//Handle
			}
		} else if (criteria.type === "comparison") {
			//Full value scans should always execute last
			difficulty += 99
			if (criteria.field) {
				difficulty += 1
			}
		}
		return difficulty
	}

	/**
	 * Computes the difficulty of a branch of criteria.
	 * @param {IQueryCriteria} criteriaArray - Branch for which difficulty should be computed
	 */
	computeExecutionPathDifficulty(criteriaArray: IQueryCriteria[]) {
		return criteriaArray.reduce((acc, criteria) => acc + this.computeCriteriaCost(criteria), 0)
	}

	/**
	 * Sorts a branch in order of execution difficulty, from easiest to hardest.
	 * @param {IQueryCriteria} branch - Branch to be sorted
	 */
	sortExecutionPath(branch: IQueryCriteria[]) {
		return branch.sort((a, b) => this.computeCriteriaCost(a) - this.computeCriteriaCost(b))
	}

	/**
	 * Creates and returns a query plan for a provided query.
	 * @param {IQuery} query - Query to be planned
	 */
	getQueryPlan(query: IQuery): IQueryCriteria[][] {
		const possibleExecutionPaths = this.flattenBranchTree(this.getBranchTree(query))
		possibleExecutionPaths.forEach(executionPath => this.sortExecutionPath(executionPath))
		possibleExecutionPaths.sort((a, b) => this.computeExecutionPathDifficulty(a) - this.computeExecutionPathDifficulty(b))
		return possibleExecutionPaths
	}

	/**
	 * Takes two lists of IDs and returns a new list with IDs that exist in both lists.
	 * @param listOne - List one
	 * @param listTwo - List two
	 */
	getIntersectionList(listOne: DocumentID[], listTwo: DocumentID[]): DocumentID[] {
		const l2Set = new Set(listTwo)
		return listOne.filter(doc => l2Set.has(doc))
	}

	/**
	 * Takes two lists of IDs and returns a new list that contains every unique ID that exists in either list.
	 * @param listOne - List one
	 * @param listTwo - List two
	 */
	getOuterJoinList(listOne: DocumentID[], listTwo: DocumentID[]): DocumentID[] {
		return Array.from(new Set([...listOne, ...listTwo]))
	}

	/**
	 * Executes an inexact K retrieval query and returns a list of resulting document IDs
	 * @param query - Query to execute
	 * @param value - If the query has a root search value
	 * @param limit - Optional limit for how many IDs to return
	 */
	executeQuery(query: IQuery, value?: any, limit?: number) {
		const queryPlan = this.getQueryPlan(query)
		let documentIDs: DocumentID[] = []
		for (let i = 0; i < queryPlan.length; i++) {
			const executionPath = queryPlan[i]
			let pathResult: DocumentID[] | undefined = undefined
			for (let j = 0; j < executionPath.length; j++) {
				const criteria = executionPath[j]
				let docs: DocumentID[] = []
				if (criteria.type === "cluster") {
					docs = this.engine.clusterRetrieval(criteria, value)
					pathResult = j === 0 ? docs : this.getIntersectionList(docs, pathResult!)
				} else if (criteria.type === "index") {
					docs = this.engine.indexRetrieval(criteria, pathResult)
					pathResult = docs
				} else if (criteria.type === "comparison") {
					docs = this.engine.comparisonRetrieval(criteria, pathResult)
					pathResult = docs
				}
			}
			documentIDs = i === 0 ? pathResult! : this.getOuterJoinList(documentIDs, pathResult!)
			if (limit && documentIDs.length >= limit) {
				return documentIDs
			}
		}
		return documentIDs
	}

	/**
	 * Executes an async inexact K retrieval query and returns a list of resulting document IDs
	 * @param query - Query to execute
	 * @param value - If the query has a root search value
	 * @param limit - Optional limit for how many IDs to return
	 */
	async executeQueryAsync(query: IQuery, value?: any, limit?: number) {
		const queryPlan = this.getQueryPlan(query)
		let documentIDs: DocumentID[] = []
		for (let i = 0; i < queryPlan.length; i++) {
			const executionPath = queryPlan[i]
			let pathResult: DocumentID[] | undefined = undefined
			for (let j = 0; j < executionPath.length; j++) {
				const criteria = executionPath[j]
				let docs: DocumentID[] = []
				if (criteria.type === "cluster") {
					docs = this.engine.clusterRetrieval(criteria, value)
					pathResult = j === 0 ? docs : this.getIntersectionList(docs, pathResult!)
				} else if (criteria.type === "index") {
					docs = this.engine.indexRetrieval(criteria, pathResult)
					pathResult = docs
				} else if (criteria.type === "comparison") {
					docs = await this.engine.comparisonRetrievalAsync(criteria, pathResult)
					pathResult = docs
				}
			}
			documentIDs = i === 0 ? pathResult! : this.getOuterJoinList(documentIDs, pathResult!)
			if (limit && documentIDs.length >= limit) {
				return documentIDs
			}
		}
		return documentIDs
	}
}
