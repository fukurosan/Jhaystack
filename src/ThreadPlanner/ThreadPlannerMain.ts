import { ObjectLiteral } from "../Utility/JsonUtility"

/**
 * Interface for workers that adopts the browser standard
 */
export interface IThreaderWorker {
	onmessage: (result: { data: any }) => void
	onerror: (...args: any[]) => any
	postMessage: (...args: any[]) => any
	terminate: () => void
}

/**
 * Interface for a promise that is stored for later resolution
 */
export interface IThreaderPromise {
	resolve: (resolution: any) => void
	reject: (reason: any) => void
}

/**
 * A type for a function with x arguments that result in a value of type x
 */
export interface IThreaderFunction {
	(...args: any[]): any
	_jhaystack?: {
		dependencies?: ObjectLiteral
		dependencyString?: string
	}
}

/**
 * Main Thread Planner Class.
 * The threadplanner will serialize functions into strings and create worker objects that can execute these.
 * Worker objects are reused between executions, but will terminate after x milliseconds of being idle.
 * The threadplanner will try to determine the optimal amount of threads that can be started on the host, and will run only that many threads concurrently.
 */
export class ThreadPlanner {
	/** Map that holds free workers for a given function */
	private freeThreads: WeakMap<IThreaderFunction, IThreaderWorker[]>
	/** A list of queued jobs. The first item is the promise that is waiting for the resolution of the thread. The second is the function to execute, and the third is a list of arguments. */
	private threadQueue: [IThreaderPromise, IThreaderFunction, any[]][]
	/** Currently running number of threads */
	private numberOfRunningThreads: 0
	/** A map between functions and information about how many tasks are currently pending, as well as a timeout object used to keep track of worker idle time for auto-termination. */
	private metaData: WeakMap<
		IThreaderFunction,
		{ pendingTasks: number; dependencyString: string; terminationTimeout: ReturnType<typeof setTimeout> | undefined }
	>

	/** Maximum idle time before workers are terminated (in ms) */
	private readonly MAXIMUM_IDLE_TIME_MS = 10000 //10 seconds

	/** Maximum allowed number of threads (determined in extending classes) */
	protected maxThreads: number

	constructor() {
		this.freeThreads = new WeakMap()
		this.threadQueue = []
		this.numberOfRunningThreads = 0
		this.maxThreads = -1
		this.metaData = new WeakMap()
	}

	/**
	 * Creates an inline worker
	 */
	createInlineWorker(fn: IThreaderFunction, dependencyString: string): IThreaderWorker {
		return this.createInlineWorker(fn, dependencyString) //This is just for the TS-compiler to calm down. The real implementation can be found in extending classes
	}

	/**
	 * Executes a worker
	 * @param worker - Worker to be executed
	 * @param args - arguments for the worker
	 */
	executeWorker(worker: IThreaderWorker, ...args: any[]) {
		return new Promise((resolve, reject) => {
			worker.onmessage = result => {
				resolve(result.data)
			}
			worker.onerror = reject
			worker.postMessage(args)
		})
	}

	/**
	 * Terminates all workers for a given function
	 * @param fn - Function for which workers should be terminated
	 */
	terminate(fn: IThreaderFunction) {
		if (this.freeThreads.has(fn)) {
			this.freeThreads.get(fn)!.forEach(worker => {
				worker.terminate()
			})
			this.freeThreads.delete(fn)
		}
		if (this.metaData.has(fn)) {
			const timeout = this.metaData.get(fn)!.terminationTimeout
			if (timeout) {
				clearTimeout(timeout)
			}
			this.metaData.delete(fn)
		}
		this.threadQueue.filter(thread => thread[1] === fn).forEach(thread => thread[0].reject("Thread terminated"))
		this.threadQueue = this.threadQueue.filter(thread => thread[1] !== fn)
	}

	/**
	 * Executes the next thread in the queue
	 */
	next() {
		if (this.threadQueue.length) {
			const nextItem = this.threadQueue.splice(0, 1)[0]
			this.runThread(nextItem[1], ...nextItem[2])
				.then(result => {
					nextItem[0].resolve(result)
				})
				.catch(error => {
					nextItem[0].reject(error)
				})
		}
	}

	getDependencyString(obj: any, result = "") {
		if (obj._jhaystack && obj._jhaystack.dependencyString) {
			result += `${obj._jhaystack.dependencyString}
			
			`
		}
		if (obj._jhaystack && obj._jhaystack.dependencies) {
			const dependencies = obj._jhaystack.dependencies
			Object.keys(dependencies).forEach(key => {
				const dependency = dependencies[key]
				result += `var ${key} = ${dependency.toString ? dependency.toString() : dependency}
				
				`
				result = this.getDependencyString(dependency, result)
			})
		}
		return result
	}

	/**
	 * queues a function in the thread planner (and executes it immediately if possible)
	 * @param fn - Function to run
	 * @param args - Arguments for the function
	 */
	async run(fn: IThreaderFunction, ...args: any[]) {
		if (!this.metaData.has(fn)) {
			this.metaData.set(fn, {
				pendingTasks: 0,
				terminationTimeout: undefined,
				dependencyString: this.getDependencyString(fn)
			})
		}
		const metaData = this.metaData.get(fn)!
		if (metaData.terminationTimeout) {
			clearTimeout(metaData.terminationTimeout)
			delete metaData.terminationTimeout
		}
		metaData.pendingTasks++
		const result = this.runThread(fn, ...args)
		return result
	}

	/**
	 * Executes a given function as a separate thread.
	 * @param fn - Function to execute
	 * @param args - Arguments for the function to be executed
	 */
	async runThread(fn: IThreaderFunction, ...args: any[]) {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let resolve: IThreaderFunction = () => {}
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let reject: IThreaderFunction = () => {}
		const result = new Promise((outerResolve: (resolution: any) => void, outerReject: (reason: any) => void) => {
			resolve = outerResolve
			reject = outerReject
		})
		if (!this.freeThreads.has(fn)) {
			this.freeThreads.set(fn, [])
		}
		if (this.numberOfRunningThreads === this.maxThreads) {
			this.threadQueue.push([{ resolve, reject }, fn, [...args]])
			return result
		}
		const threads = this.freeThreads.get(fn)
		if (!threads!.length) {
			threads!.push(this.createInlineWorker(fn, this.metaData.get(fn)!.dependencyString))
		}
		const thread = threads!.splice(0, 1)[0]
		this.numberOfRunningThreads++
		this.executeWorker(thread, ...args)
			.then(executionResult => {
				this.handleThreadCompleted(fn, thread)
				resolve(executionResult)
			})
			.catch(error => {
				this.handleThreadCompleted(fn, thread)
				reject(error)
			})
		return result
	}

	/**
	 * Handles when a worker completes an operation
	 * @param fn - Function that completed
	 * @param thread - Worker that completed
	 */
	handleThreadCompleted(fn: IThreaderFunction, thread: IThreaderWorker) {
		const metaData = this.metaData.get(fn)!
		this.freeThreads.get(fn)!.push(thread)
		this.numberOfRunningThreads--
		metaData.pendingTasks--
		if (!metaData.pendingTasks) {
			metaData.terminationTimeout = setTimeout(() => {
				this.terminate(fn)
			}, this.MAXIMUM_IDLE_TIME_MS)
		}
		this.next()
	}
}
