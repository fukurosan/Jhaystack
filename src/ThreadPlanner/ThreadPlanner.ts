import { ThreadPlanner } from "./ThreadPlannerMain"
import NodeThreadPlanner from "./ThreadPlannerNode"
import BrowserThreadPlanner from "./ThreadPlannerBrowser"

let threadPlanner: ThreadPlanner
if (typeof window === "undefined") {
	threadPlanner = new NodeThreadPlanner()
} else {
	threadPlanner = new BrowserThreadPlanner()
}

/**
 * Executes a thread
 * @param fn Function to execute
 * @param args Arguments for the function (note the spread operator!)
 */
export const runThread = (fn: (...args: any[]) => any, ...args: any[]) => {
	return threadPlanner.run(fn, [...args]).then(result => result[0])
}

/**
 * Executes a thread multiple times with different arguments.
 * @param fn Function to execute
 * @param args Arrays of arguments for the different executions (note the spread operator!)
 */
export const runManyInThread = (fn: (...args: any[]) => any, ...args: any[]) => {
	return threadPlanner.run(fn, ...args)
}

/**
 * Terminates all threads for a given function
 * @param fn - Function to terminate all threads for
 */
export const terminateThread = (fn: (...args: any[]) => any) => {
	threadPlanner.terminate(fn)
}
