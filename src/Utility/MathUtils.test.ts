import { getRelativeRelevance, getStackedRelevance, minMax, sigmoid, sigmoidPositive } from "./MathUtils"

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

	it("Normalizes Values", () => {
		const max = 2
		const min = 0
		const high = 2
		const middle = 1
		const low = 0

		expect(minMax(high, max, min)).toBe(1)
		expect(minMax(middle, max, min)).toBe(0.5)
		expect(minMax(low, max, min)).toBe(0)
	})

	it("Calculates sigmoid function", () => {
		const zero = 0
		const highValue = 300
		const lowValue = -300

		expect(sigmoid(zero)).toBe(0.5)
		expect(sigmoid(highValue)).toBeGreaterThan(0.5)
		expect(sigmoid(highValue)).toBeLessThan(1.0)
		expect(sigmoid(lowValue)).toBeGreaterThan(0.0)
		expect(sigmoid(lowValue)).toBeLessThan(0.5)
	})

	it("Calculates sigmoid function of positive numbers", () => {
		const zero = 0
		const highValue = 300
		const lowValue = 1
		expect(sigmoidPositive(zero)).toBe(0)
		expect(sigmoidPositive(highValue)).toBeGreaterThan(0)
		expect(sigmoidPositive(highValue)).toBeLessThan(1)
		expect(sigmoidPositive(lowValue)).toBeGreaterThan(0)
		expect(sigmoidPositive(lowValue)).toBeLessThan(1)
		expect(sigmoidPositive(lowValue)).toBeLessThan(sigmoidPositive(highValue))
	})
})
