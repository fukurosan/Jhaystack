import { runThread, terminateThread } from "./ThreadPlanner"

const longRunningFunction = (someNumber: number) => {
	const start = Date.now()
	// eslint-disable-next-line no-empty
	while (start + 500 > Date.now()) {}
	return someNumber
}

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
})
