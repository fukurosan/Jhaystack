import { runThread, terminateThread, runManyInThread } from "./ThreadPlanner"

const longRunningFunction = (someNumber: number) => {
	const start = Date.now()
	// eslint-disable-next-line no-empty
	while (start + 500 > Date.now()) {}
	return someNumber
}

const innerReference = () => "World"
const reference = () => "Hello " + innerReference()
const functionWithReference = () => {
	return reference()
}
;(<any>functionWithReference)._jhaystack = { dependencies: { reference } }
;(<any>reference)._jhaystack = { dependencies: { innerReference } }

describe("Threadplanner", () => {
	it("Executes threads", async () => {
		const promises = [
			runThread(longRunningFunction, 1),
			runThread(longRunningFunction, 2),
			runThread(longRunningFunction, 3),
			runThread(longRunningFunction, 4),
			runThread(longRunningFunction, 5)
		]
		const result = await Promise.all(promises)
		terminateThread(longRunningFunction)
		const sum = result.reduce((acc, number) => acc + number, 0)
		expect(sum).toBe(15)
	})

	it("Handles dependencies", async () => {
		const promises = [
			runThread(<(...args: any[]) => any>functionWithReference),
			runThread(<(...args: any[]) => any>functionWithReference),
			runThread(<(...args: any[]) => any>functionWithReference),
			runThread(<(...args: any[]) => any>functionWithReference),
			runThread(<(...args: any[]) => any>functionWithReference)
		]
		const result = await Promise.all(promises)
		terminateThread(longRunningFunction)
		expect(result[0]).toBe("Hello World")
	})

	it("Handles passing many operations simultaneously", async () => {
		const promises = [
			runManyInThread(<(...args: any[]) => any>functionWithReference, [], [], []),
			runManyInThread(<(...args: any[]) => any>functionWithReference, [], [], []),
			runManyInThread(<(...args: any[]) => any>functionWithReference, [], [], []),
			runManyInThread(<(...args: any[]) => any>functionWithReference, [], [], []),
			runManyInThread(<(...args: any[]) => any>functionWithReference, [], [], [])
		]
		const result = await Promise.all(promises)
		expect(result.length).toBe(5)
		expect(result[0].length).toBe(3)
		expect(result[0][1]).toBe("Hello World")
	})
})
