import { QueryPlanner } from "./QueryPlanner"
import { IQuery } from "../Model/IQuery"
import SearchEngine from "../Engine"

describe("Query Planner", () => {
	const query1 = [1, "AND", 2, "AND", 3]
	const query2 = [1, "OR", 2, "OR", 3]
	const query3 = [1, "AND", [2, "OR", 3], "AND", 4]
	const query4 = [1, "AND", [2, "AND", 3], "OR", 4]
	const documents = ["hello world", "good morning tokyo", "good evening london", "And hi to you too!"]
	const engine = new SearchEngine({ data: documents })
	const queryPlanner = new QueryPlanner(engine)

	it("Computes branch tree", () => {
		expect(queryPlanner.getBranchTree(query1)).toStrictEqual([[1, 2, 3]])
		expect(queryPlanner.getBranchTree(query2)).toStrictEqual([[1], [2], [3]])
		expect(queryPlanner.getBranchTree(query3)).toStrictEqual([[1, [[2], [3]], 4]])
		expect(queryPlanner.getBranchTree(query4)).toStrictEqual([[1, [[2, 3]]], [4]])
	})

	it("Flattens branch tree", () => {
		expect(queryPlanner.flattenBranchTree(queryPlanner.getBranchTree(query1))).toStrictEqual([[1, 2, 3]])
		expect(queryPlanner.flattenBranchTree(queryPlanner.getBranchTree(query2))).toStrictEqual([[1], [2], [3]])
		expect(queryPlanner.flattenBranchTree(queryPlanner.getBranchTree(query3))).toStrictEqual([
			[1, 4, 2],
			[1, 4, 3]
		])
		expect(queryPlanner.flattenBranchTree(queryPlanner.getBranchTree(query4))).toStrictEqual([[1, 2, 3], [4]])
	})

	it("Computes criteria difficulty", () => {
		//Clusters
		expect(
			queryPlanner.computeCriteriaCost({
				type: "cluster",
				id: "dummy"
			})
		).toBe(0)

		//Index
		expect(
			queryPlanner.computeCriteriaCost({
				type: "index",
				value: "dummy"
			})
		).toBe(1)
		expect(
			queryPlanner.computeCriteriaCost({
				type: "index",
				value: "dummy",
				field: "dummy"
			})
		).toBe(2)
		expect(
			queryPlanner.computeCriteriaCost({
				type: "index",
				value: "dummy",
				exact: true
			})
		).toBe(1)
		expect(
			queryPlanner.computeCriteriaCost({
				type: "index",
				value: "dummy dummy",
				exact: true
			})
		).toBe(2.5)

		//Comparison
		expect(
			queryPlanner.computeCriteriaCost({
				type: "comparison",
				value: "dummy"
			})
		).toBe(99)
		expect(
			queryPlanner.computeCriteriaCost({
				type: "comparison",
				field: "dummy",
				value: "dummy"
			})
		).toBe(100)
	})

	it("Computes the total cost of an execution path", () => {
		const totalCost = queryPlanner.computeExecutionPathDifficulty([
			{ type: "comparison", value: "dummy" },
			{ type: "cluster", id: "dummy" },
			{ type: "index", value: "dummy" }
		])
		expect(totalCost).toBe(100)
	})

	it("Orders an execution branch in order of difficulty", () => {
		const sortedBranch = queryPlanner.sortExecutionPath([
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
		const queryPlan = queryPlanner.getQueryPlan(query)
		expect(queryPlan[0].length).toBe(3)
		expect(queryPlan[1].length).toBe(4)
		expect(queryPlan[0][0].type).toBe("index")
		expect(queryPlan[1][0].type).toBe("cluster")
	})

	it("Computes intersection list", () => {
		const listOne = [1, 2, 3, 4, 5]
		const listTwo = [5, 6, 7, 8, 9]
		const intersection = queryPlanner.getIntersectionList(listOne, listTwo)
		expect(intersection.length).toBe(1)
		expect(intersection[0]).toBe(5)
	})

	it("Computes outer join list", () => {
		const listOne = [1, 2, 3, 4, 5]
		const listTwo = [5, 6, 7, 8, 9]
		const outerJoin = queryPlanner.getOuterJoinList(listOne, listTwo)
		expect(outerJoin.length).toBe(9)
		expect(outerJoin).toContain(1)
		expect(outerJoin).toContain(9)
	})

	it("Executes a query", () => {
		const query: IQuery = [
			{
				type: "comparison",
				value: "hello"
			},
			"OR",
			{
				type: "comparison",
				value: "hi"
			},
			"OR",
			{
				type: "comparison",
				value: "good morning"
			},
			"AND",
			{
				type: "comparison",
				value: "tokyo"
			}
		]
		const result1 = queryPlanner.executeQuery(query)
		const result2 = queryPlanner.executeQuery(query, undefined, 2)
		expect(result1.length).toBe(3)
		expect(result1).toContain(0)
		expect(result1).toContain(3)
		expect(result1).toContain(1)
		expect(result2.length).toBe(2)
		expect(result2).toContain(0)
		expect(result2).toContain(3)
	})

	it("Executes an async query", async () => {
		const strategy = (term: any, context: any) => {
			return context.includes(term) ? 1 : 0
		}
		const query: IQuery = [
			{
				type: "comparison",
				value: "hello",
				strategy
			},
			"OR",
			{
				type: "comparison",
				value: "hi",
				strategy
			},
			"OR",
			{
				type: "comparison",
				value: "good morning",
				strategy
			},
			"AND",
			{
				type: "comparison",
				value: "tokyo",
				strategy
			}
		]
		const result1 = await queryPlanner.executeQueryAsync(query)
		const result2 = await queryPlanner.executeQueryAsync(query, undefined, 2)
		expect(result1.length).toBe(3)
		expect(result1).toContain(0)
		expect(result1).toContain(3)
		expect(result1).toContain(1)
		expect(result2.length).toBe(2)
		expect(result2).toContain(0)
		expect(result2).toContain(3)
	})
})
