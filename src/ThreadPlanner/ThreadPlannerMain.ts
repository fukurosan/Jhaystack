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

export interface IThreaderThreadMetaData {
	freeThreads: IThreaderWorker[]
	pendingTasks: number
	dependencyString: string
	terminationTimeout: ReturnType<typeof setTimeout> | undefined
}

/**
 * Main Thread Planner Class.
 * The threadplanner will serialize functions into strings and create worker objects that can execute these.
 * Worker objects are reused between executions, but will terminate after x milliseconds of being idle.
 * The threadplanner will try to determine the optimal amount of threads that can be started on the host, and will run only that many threads concurrently.
 */
export class ThreadPlanner {
	/** A list of queued jobs. The first item is the promise that is waiting for the resolution of the thread. The second is the function to execute, and the third is a list of arguments. */
	private threadQueue: [IThreaderPromise, IThreaderFunction, any[]][]
	/** Currently running number of threads */
	private numberOfRunningThreads: number
	/** Maximum allowed number of threads (determined in extending classes) */
	protected maxThreads: number
	/** A map between functions and information about how many tasks are currently pending, a timeout object used to keep track of worker idle time for auto-termination, worker dependencies, as well as free worker threads. */
	private metaData: WeakMap<IThreaderFunction, IThreaderThreadMetaData>
	/** Maximum idle time before workers are terminated (in ms) */
	private MAXIMUM_IDLE_TIME_MS = 10000 //10 seconds
	/** All registered functions */
	private registeredFns: IThreaderFunction[] = []

	constructor() {
		this.threadQueue = []
		this.numberOfRunningThreads = 0
		this.maxThreads = -1
		this.metaData = new WeakMap()
	}

	setMaxThreadCount(maxThreadCount: number) {
		this.maxThreads = maxThreadCount
	}

	setMaxIdleTime(maxIdleTime: number) {
		this.MAXIMUM_IDLE_TIME_MS = maxIdleTime
	}

	getMaxThreadCount() {
		return this.maxThreads
	}

	getMaxIdleTime() {
		return this.MAXIMUM_IDLE_TIME_MS
	}

	getNumberOfQueuedJobs() {
		return this.threadQueue.length
	}

	getNumberOfRunningJobs() {
		return this.numberOfRunningThreads
	}

	hasNext() {
		return !!this.threadQueue.length
	}

	createInlineWorker(fn: IThreaderFunction, dependencyString: string): IThreaderWorker {
		return this.createInlineWorker(fn, dependencyString) //This is just for the TS-compiler to calm down. The real implementation can be found in extending classes
	}

	/**
	 * Terminates all workers for a given function
	 * @param fn - Function for which workers should be terminated
	 */
	terminate(fn: IThreaderFunction) {
		if (this.metaData.has(fn)) {
			const meta = this.metaData.get(fn)!
			if (meta.terminationTimeout) {
				clearTimeout(meta.terminationTimeout)
			}
			meta.freeThreads.forEach(worker => {
				worker.terminate()
			})
			this.metaData.delete(fn)
		}
		this.threadQueue.filter(thread => thread[1] === fn).forEach(thread => thread[0].reject("Thread was terminated."))
		this.threadQueue = this.threadQueue.filter(thread => thread[1] !== fn)
	}

	/**
	 * Recursively computes a dependency string for a given function
	 * @param obj - Object to compute dependency string for
	 * @param result - Should never be set externally! Recursively updated dependency string
	 */
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
	 * Retrieves meta data for a function from the threadplanner. If no meta data exists then it will be created by this function.
	 */
	getMetaData(fn: IThreaderFunction): IThreaderThreadMetaData {
		if (!this.metaData.has(fn)) {
			this.metaData.set(fn, {
				pendingTasks: 0,
				terminationTimeout: undefined,
				dependencyString: this.getDependencyString(fn),
				freeThreads: []
			})
			this.registeredFns.push(fn)
		}
		return this.metaData.get(fn)!
	}

	/**
	 * Warms up threads for a given function for later use.
	 */
	warmup(fn: IThreaderFunction, number?: number) {
		const metaData = this.getMetaData(fn)
		const threads = metaData.freeThreads
		const loops = number ? number : Math.max(0, this.maxThreads - threads.length)
		for (let i = 0; i < loops; i++) {
			threads.push(this.createInlineWorker(fn, metaData.dependencyString))
		}
	}

	/**
	 * Terminates all threads in the thread planner.
	 */
	terminateAllThreads() {
		let fn
		while ((fn = this.registeredFns.pop())) {
			this.terminate(fn)
		}
	}

	/**
	 * Queues a function in the thread planner (and starts a thread execution loop if possible).
	 * @param fn - Function to run
	 * @param args - Arguments for the function
	 */
	async run(fn: IThreaderFunction, ...args: any[]) {
		const metaData = this.getMetaData(fn)
		if (metaData.terminationTimeout) {
			clearTimeout(metaData.terminationTimeout)
			delete metaData.terminationTimeout
		}
		metaData.pendingTasks++
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let resolve: IThreaderFunction = () => {}
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let reject: IThreaderFunction = () => {}
		const result = new Promise((outerResolve: (resolution: any) => void, outerReject: (reason: any) => void) => {
			resolve = outerResolve
			reject = outerReject
		})
		this.threadQueue.push([{ resolve, reject }, fn, [...args]])
		if (this.numberOfRunningThreads !== this.maxThreads) {
			//There should never be more execution loops than max thread count.
			this.executeQueueLoop()
		}
		return result
	}

	/**
	 * Executes threads one by one until the queue is empty.
	 * @param fn - Function to execute
	 * @param args - Arguments for the function to be executed
	 */
	async executeQueueLoop() {
		while (this.hasNext()) {
			const nextItem = this.threadQueue.shift()!
			const resolve = nextItem[0].resolve
			const reject = nextItem[0].reject
			const fn = nextItem[1]
			const args = nextItem[2]
			const threads = this.metaData.get(fn)!.freeThreads
			if (!threads.length) {
				threads!.push(this.createInlineWorker(fn, this.metaData.get(fn)!.dependencyString))
			}
			const thread = threads!.splice(0, 1)[0]
			this.numberOfRunningThreads++
			try {
				await this.executeWorker(thread, ...args)
					.then(executionResult => {
						this.handleThreadCompleted(fn, thread)
						resolve(executionResult)
					})
					.catch(error => {
						this.handleThreadCompleted(fn, thread)
						reject(error)
					})
			} catch (e) {
				console.error(e)
			}
			this.numberOfRunningThreads--
		}
	}

	/**
	 * Executes a worker and returns a promise with the result
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
	 * Handles when a worker completes an operation
	 * @param fn - Function that completed
	 * @param thread - Worker that completed
	 */
	handleThreadCompleted(fn: IThreaderFunction, thread: IThreaderWorker) {
		const metaData = this.metaData.get(fn)
		if (!metaData) {
			//A termination command must have been executed
			return
		}
		metaData.freeThreads.push(thread)
		metaData.pendingTasks--
		if (!metaData.pendingTasks) {
			if (this.MAXIMUM_IDLE_TIME_MS) {
				metaData.terminationTimeout = setTimeout(() => {
					this.terminate(fn)
					this.registeredFns = this.registeredFns.filter(registeredFn => registeredFn !== fn)
				}, this.MAXIMUM_IDLE_TIME_MS)
			}
		}
	}
}
