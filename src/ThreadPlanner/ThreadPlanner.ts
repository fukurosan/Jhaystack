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
 * Sets the maximum idle time allowed for a worker thread before it is terminated.
 */
export const setMaxIdleTime = (maxIdleTime: number) => {
	return threadPlanner.setMaxIdleTime(maxIdleTime)
}

/**
 * Gets the maximum idle time allowed for a worker thread before it is terminated.
 */
export const getMaxIdleTime = () => {
	return threadPlanner.getMaxIdleTime()
}

/**
 * Terminates all threads for a given function
 * @param fn - Function to terminate all threads for
 */
export const terminateThread = (fn: (...args: any[]) => any) => {
	threadPlanner.terminate(fn)
}

/**
 * Terminates all threads in the thread planner.
 */
export const terminateAllThreads = () => {
	threadPlanner.terminateAllThreads()
}

/**
 * Pre-allocates a number of threads for a given function. This can be done to lower the initial cost when actually executing a search.
 * If no number is specified the threadplanner will guess.
 * @param fn - Function to allocate threads for
 * @param numberOfThreads - Number of threads to allocate
 */
export const warmupThreads = (fn: (...args: any[]) => any, numberOfThreads?: number) => {
	threadPlanner.warmup(fn, numberOfThreads)
}

/**
 * Returns the number of running threads
 */
export const getNumberOfRunningJobs = (): number => {
	return threadPlanner.getNumberOfRunningJobs()
}

/**
 * Returns the number of queued jobs
 */
export const getNumberOfQueuedJobs = (): number => {
	return threadPlanner.getNumberOfQueuedJobs()
}
