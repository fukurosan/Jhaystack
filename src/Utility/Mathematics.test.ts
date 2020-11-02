import { getRelativeRelevance, getStackedRelevance, getTweenedRelevance, getCombinedRelevanceScore } from "./Mathematics"

describe("Mathematics Utility Module", () => {
	it("Correctly calculates relative relevance", () => {
		let length = 3
		let point = 1
		let divider = 1
		expect(getRelativeRelevance(length, point, divider)).toBe(0.99999999)
		length = 3
		point = 1
		divider = 0.5
		expect(getRelativeRelevance(length, point, divider)).toBe(0.8333333333333333)
		length = 3
		point = 2
		divider = 0.5
		expect(getRelativeRelevance(length, point, divider)).toBe(0.5)
		length = 3
		point = 3
		divider = 0.5
		expect(getRelativeRelevance(length, point, divider)).toBe(0.16666666666666666)
		length = 10
		point = 3
		divider = 0.35
		expect(getRelativeRelevance(length, point, divider)).toBe(0.7350000000000001)
	})

	it("Correctly calculates stacked relevance", () => {
		let relevanceOne = 2
		let relevanceTwo = 0.5
		expect(getStackedRelevance(relevanceOne, relevanceTwo)).toBe(0.29166666666666663)
		relevanceOne = 0
		relevanceTwo = 0.43
		expect(getStackedRelevance(relevanceOne, relevanceTwo)).toBe(0.715)
		relevanceOne = 0
		relevanceTwo = 1
		expect(getStackedRelevance(relevanceOne, relevanceTwo)).toBe(0.99999999)
	})

	it("Correctly calculates tweened relevance", () => {
		let relevanceOne = 2
		let relevanceTwo = 9
		expect(getTweenedRelevance(relevanceOne, relevanceTwo)).toBe(0.2583333333333333)
		relevanceOne = 0
		relevanceTwo = 4
		expect(getTweenedRelevance(relevanceOne, relevanceTwo)).toBe(0.6)
		relevanceOne = 0
		relevanceTwo = 0
		expect(getTweenedRelevance(relevanceOne, relevanceTwo)).toBe(0.99999999)
	})

	it("Correctly combines absolute relevance", () => {
		let relevance: number[] = []
		expect(getCombinedRelevanceScore(relevance)).toBe(0)
		relevance = [-1]
		expect(getCombinedRelevanceScore(relevance)).toBe(0)
		relevance = [0]
		expect(getCombinedRelevanceScore(relevance)).toBe(1)
		relevance = [1]
		expect(getCombinedRelevanceScore(relevance)).toBe(0.5)
		relevance = [0, 0, 0]
		expect(getCombinedRelevanceScore(relevance)).toBe(0.999999995)
		relevance = [1, 1, 1]
		expect(getCombinedRelevanceScore(relevance)).toBe(0.4027777777777778)
		relevance = [2, 2, 2]
		expect(getCombinedRelevanceScore(relevance)).toBe(0.27314814814814814)
	})
})
