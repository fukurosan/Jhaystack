import { getBranchTree, flattenBranchTree, computeCriteriaCost, computeExecutionPathDifficulty, sortExecutionPath, getQueryPlan } from "./QueryPlanner"
import { IQuery } from "../Model/IQuery"

describe("Query Planner", () => {
	const query1 = [1, "AND", 2, "AND", 3]
	const query2 = [1, "OR", 2, "OR", 3]
	const query3 = [1, "AND", [2, "OR", 3], "AND", 4]
	const query4 = [1, "AND", [2, "AND", 3], "OR", 4]

	it("Computes branch tree", () => {
		expect(getBranchTree(query1)).toStrictEqual([[1, 2, 3]])
		expect(getBranchTree(query2)).toStrictEqual([[1], [2], [3]])
		expect(getBranchTree(query3)).toStrictEqual([[1, [[2], [3]], 4]])
		expect(getBranchTree(query4)).toStrictEqual([[1, [[2, 3]]], [4]])
	})

	it("Flattens branch tree", () => {
		expect(flattenBranchTree(getBranchTree(query1))).toStrictEqual([[1, 2, 3]])
		expect(flattenBranchTree(getBranchTree(query2))).toStrictEqual([[1], [2], [3]])
		expect(flattenBranchTree(getBranchTree(query3))).toStrictEqual([
			[1, 4, 2],
			[1, 4, 3]
		])
		expect(flattenBranchTree(getBranchTree(query4))).toStrictEqual([[1, 2, 3], [4]])
	})

	it("Computes criteria difficulty", () => {
		//Clusters
		expect(
			computeCriteriaCost({
				type: "cluster",
				id: "dummy"
			})
		).toBe(0)

		//Index
		expect(
			computeCriteriaCost({
				type: "index",
				value: "dummy"
			})
		).toBe(1)
		expect(
			computeCriteriaCost({
				type: "index",
				value: "dummy",
				field: "dummy"
			})
		).toBe(2)
		expect(
			computeCriteriaCost({
				type: "index",
				value: "dummy",
				exact: true
			})
		).toBe(1)
		expect(
			computeCriteriaCost({
				type: "index",
				value: "dummy dummy",
				exact: true
			})
		).toBe(2.5)

		//Comparison
		expect(
			computeCriteriaCost({
				type: "comparison",
				value: "dummy"
			})
		).toBe(99)
		expect(
			computeCriteriaCost({
				type: "comparison",
				field: "dummy",
				value: "dummy"
			})
		).toBe(100)
	})

	it("Computes the total cost of an execution path", () => {
		const totalCost = computeExecutionPathDifficulty([
			{ type: "comparison", value: "dummy" },
			{ type: "cluster", id: "dummy" },
			{ type: "index", value: "dummy" }
		])
		expect(totalCost).toBe(100)
	})

	it("Orders an execution branch in order of difficulty", () => {
		const sortedBranch = sortExecutionPath([
			{ type: "comparison", value: "dummy" },
			{ type: "cluster", id: "dummy" },
			{ type: "index", value: "dummy" }
		])
		expect(sortedBranch[0].type).toBe("cluster")
		expect(sortedBranch[1].type).toBe("index")
		expect(sortedBranch[2].type).toBe("comparison")
	})

	it("Creates a query execution plan", () => {
		const query: IQuery = [
			{ type: "comparison", value: "dummy" },
			"AND",
			{ type: "comparison", value: "dummy" },
			"AND",
			{ type: "cluster", id: "dummy" },
			"AND",
			{ type: "index", value: "dummy" },
			"OR",
			{ type: "comparison", value: "dummy" },
			"AND",
			{ type: "index", value: "dummy" },
			"AND",
			{ type: "index", value: "dummy" }
		]
		const queryPlan = getQueryPlan(query)
		expect(queryPlan[0].length).toBe(3)
		expect(queryPlan[1].length).toBe(4)
		expect(queryPlan[0][0].type).toBe("index")
		expect(queryPlan[1][0].type).toBe("cluster")
	})
})
