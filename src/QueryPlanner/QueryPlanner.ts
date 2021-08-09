import { IQueryCriteria, IQuery } from "../Model/IQuery"

/**
 * Determine possible query branches
 * [x, AND, y, AND, n] -> [[x, y, n]]
 * [x, OR, y, OR, n] -> [[x], [y], [n]]
 * [x, AND, [y, OR, z], AND, n] -> [[x, [[y], [z]], n]]
 * [x, AND, [y, AND, z], OR, n] -> [[x, [[y, z]]], [n]]
 * @param {IQuery} queryBranch - Branch to be deconstructed
 */
export const getBranchTree = (queryBranch: any[]) => {
	const fullBranches: any[] = []
	let currentBranch: any[] = []
	let operation = "AND"
	queryBranch.forEach(step => {
		if (typeof step === "string") {
			operation = step
		} else if (operation === "AND") {
			if (Array.isArray(step)) {
				currentBranch.push(getBranchTree(step))
			} else {
				currentBranch.push(step)
			}
		} else if (operation === "OR") {
			fullBranches.push(currentBranch)
			if (Array.isArray(step)) {
				currentBranch = [getBranchTree(step)]
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
export const flattenBranchTree = (branch: any[], lastStep: any[] = [], possibleExecutionPaths: any[] = []) => {
	const thisBranch = [...lastStep]
	branch.forEach(criteria => !Array.isArray(criteria) && thisBranch.push(criteria))
	const nestedSubCriteria = branch.filter(criteria => Array.isArray(criteria))
	if (nestedSubCriteria.length === 0) {
		possibleExecutionPaths.push(thisBranch)
	} else {
		nestedSubCriteria.forEach(nestedCriteria => flattenBranchTree(nestedCriteria, thisBranch, possibleExecutionPaths))
	}
	return possibleExecutionPaths
}

/**
 * Computes the difficulty of a given criteria and returns a score. Lower means less intensive to compute.
 * This function is still quite rudimentary and should be improved in the future.
 * @param {IQueryCriteria} criteria - Criteria to be computed
 */
export const computeCriteriaCost = (criteria: IQueryCriteria) => {
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
export const computeExecutionPathDifficulty = (criteriaArray: IQueryCriteria[]) => {
	return criteriaArray.reduce((acc, criteria) => acc + computeCriteriaCost(criteria), 0)
}

/**
 * Sorts a branch in order of execution difficulty, from easiest to hardest.
 * @param {IQueryCriteria} branch - Branch to be sorted
 */
export const sortExecutionPath = (branch: IQueryCriteria[]) => {
	return branch.sort((a, b) => computeCriteriaCost(a) - computeCriteriaCost(b))
}

/**
 * Creates and return a query plan for a provided query.
 * @param {IQuery} query - Query to be planned
 */
export const getQueryPlan = (query: IQuery): IQueryCriteria[][] => {
	const possibleExecutionPaths = flattenBranchTree(getBranchTree(query))
	possibleExecutionPaths.forEach(executionPath => sortExecutionPath(executionPath))
	possibleExecutionPaths.sort((a, b) => computeExecutionPathDifficulty(a) - computeExecutionPathDifficulty(b))
	return possibleExecutionPaths
}
