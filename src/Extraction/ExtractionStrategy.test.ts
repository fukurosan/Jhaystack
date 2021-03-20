import { BY_VALUE, BY_OBJECT, BY_NESTED_OBJECT } from "./ExtractionStrategy"
import Declaration from "../Model/Declaration"

describe("Comparison Strategy Module", () => {
	const data = {
		firstName: "Albert",
		lastName: "Johnsson",
		numbers: [
			123,
			456,
			{
				nestedNumber: 789
			}
		],
		address: {
			city: "Quacksburg"
		}
	}

	const dataAsArray = ["One", "Two", "Three", ["Four", ["Five"]]]

	const dataAsString = "Hello World!"

	it("BY_VALUE extraction works", () => {
		const expectedDataResult = [
			[new Declaration("Albert", ["firstName"])],
			[new Declaration("Johnsson", ["lastName"])],
			[new Declaration(123, ["numbers", 0])],
			[new Declaration(456, ["numbers", 1])],
			[new Declaration(789, ["numbers", 2, "nestedNumber"])],
			[new Declaration("Quacksburg", ["address", "city"])]
		].sort((a, b) => {
			if (a[0].path.length < b[0].path.length) return -1
			if (a[0].path.length > b[0].path.length) return 1
			return 0
		})

		const expectedArrayResult = [
			[new Declaration("One", [0])],
			[new Declaration("Two", [1])],
			[new Declaration("Three", [2])],
			[new Declaration("Four", [3, 0])],
			[new Declaration("Five", [3, 1, 0])]
		].sort((a, b) => {
			if (a[0].path.length < b[0].path.length) return -1
			if (a[0].path.length > b[0].path.length) return 1
			return 0
		})

		const expectedStringResult = [[new Declaration("Hello World!", [])]]

		expect(BY_VALUE(data)).toStrictEqual(expectedDataResult)
		expect(BY_VALUE(dataAsArray)).toStrictEqual(expectedArrayResult)
		expect(BY_VALUE(dataAsString)).toStrictEqual(expectedStringResult)
	})

	it("BY_OBJECT extraction works", () => {
		const expectedDataResult = [
			[
				new Declaration("Albert", ["firstName"]),
				new Declaration("Johnsson", ["lastName"]),
				new Declaration(123, ["numbers", 0]),
				new Declaration(456, ["numbers", 1]),
				new Declaration(789, ["numbers", 2, "nestedNumber"]),
				new Declaration("Quacksburg", ["address", "city"])
			]
		]
		expectedDataResult[0].sort((a, b) => {
			if (a.path.length < b.path.length) return -1
			if (a.path.length > b.path.length) return 1
			return 0
		})

		const expectedArrayResult = [
			[
				new Declaration("One", [0]),
				new Declaration("Two", [1]),
				new Declaration("Three", [2]),
				new Declaration("Four", [3, 0]),
				new Declaration("Five", [3, 1, 0])
			]
		]
		expectedArrayResult[0].sort((a, b) => {
			if (a.path.length < b.path.length) return -1
			if (a.path.length > b.path.length) return 1
			return 0
		})

		const expectedStringResult = [[new Declaration("Hello World!", [])]]

		expect(BY_OBJECT(data)).toStrictEqual(expectedDataResult)
		expect(BY_OBJECT(dataAsArray)).toStrictEqual(expectedArrayResult)
		expect(BY_OBJECT(dataAsString)).toStrictEqual(expectedStringResult)
	})

	it("BY_NESTED extraction works", () => {
		const expectedDataResult = [
			[
				new Declaration("Albert", ["firstName"]),
				new Declaration("Johnsson", ["lastName"]),
				new Declaration(123, ["numbers", 0]),
				new Declaration(456, ["numbers", 1])
			],
			[new Declaration(789, ["numbers", 2, "nestedNumber"])],
			[new Declaration("Quacksburg", ["address", "city"])]
		]
		expectedDataResult[0].sort((a, b) => {
			if (a.path.length < b.path.length) return -1
			if (a.path.length > b.path.length) return 1
			return 0
		})

		const expectedArrayResult = [
			[
				new Declaration("One", [0]),
				new Declaration("Two", [1]),
				new Declaration("Three", [2]),
				new Declaration("Four", [3, 0]),
				new Declaration("Five", [3, 1, 0])
			]
		]
		expectedArrayResult[0].sort((a, b) => {
			if (a.path.length < b.path.length) return -1
			if (a.path.length > b.path.length) return 1
			return 0
		})

		const expectedStringResult = [[new Declaration("Hello World!", [])]]

		expect(BY_NESTED_OBJECT(data)).toStrictEqual(expectedDataResult)
		expect(BY_NESTED_OBJECT(dataAsArray)).toStrictEqual(expectedArrayResult)
		expect(BY_NESTED_OBJECT(dataAsString)).toStrictEqual(expectedStringResult)
	})
})
