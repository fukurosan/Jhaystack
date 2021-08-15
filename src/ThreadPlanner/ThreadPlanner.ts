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
 * Executes a thread.
 * E.g. runManyInThread(fn, arg1, arg2)
 * -> Result
 * @param fn Function to execute
 * @param args Arguments for the function are passed as if they were arguments for this function
 */
export const runThread = (fn: (...args: any[]) => any, ...args: any[]) => {
	return threadPlanner.run(fn, [...args]).then(result => result[0])
}

/**
 * Executes a thread multiple times with different arguments. Returns an array of results.
 * E.g. runManyInThread(fn, [arg1, arg2], [arg1, arg2])
 * -> [Result1, Result2]
 * @param fn Function to execute
 * @param args Arguments for the function are passed in arrays, where each array contains a set of arguments to be executed.
 */
export const runManyInThread = (fn: (...args: any[]) => any, ...args: any[]) => {
	return threadPlanner.run(fn, ...args)
}

/**
 * Returns the maximum number of threads that can be executed in parallel
 */
export const getMaxThreadCount = () => {
	return threadPlanner.getMaxThreadCount()
}

/**
 * Sets the maximum number of threads that can be executed in parallel
 */
export const setMaxThreadCount = (maxThreadCount: number) => {
	return threadPlanner.setMaxThreadCount(maxThreadCount)
}

/**
 * Terminates all threads for a given function
 * @param fn - Function to terminate all threads for
 */
export const terminateThread = (fn: (...args: any[]) => any) => {
	threadPlanner.terminate(fn)
}
