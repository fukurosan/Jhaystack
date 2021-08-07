import { ThreadPlanner, IThreaderFunction, IThreaderWorker } from "./ThreadPlannerMain"

export default class NodeThreadPlanner extends ThreadPlanner {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	private Worker = require("worker_threads").Worker

	constructor() {
		super()
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		this.maxThreads = require("os").cpus().length - 1
	}

	/**
	 * @param fn - Function to be inlined
	 */
	createInlineWorker(fn: IThreaderFunction): IThreaderWorker {
		const functionString = fn.toString()
		const args = functionString.substring(functionString.indexOf("(") + 1, functionString.indexOf(")"))
		const content = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"))
		const code = `
        const { workerData, parentPort } = require("worker_threads")
        function execute(${args}) {
            ${content}
        }
        parentPort.on("message", async (params) => {
            let result = execute(...params)
            if(result instanceof Promise) {
                result = await result
            }
            parentPort.postMessage(result)
        })
        `
		const worker = new this.Worker(code, { eval: true })
		const workerInterface: IThreaderWorker = {
			//This will be assigned by the threadplanner at a later time
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onmessage: () => {},
			//This will be assigned by the threadplanner at a later time
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			onerror: () => {},
			postMessage: (...args: any[]) => worker.postMessage(...args),
			terminate: () => worker.terminate()
		}
		worker.on("message", (message: any) => workerInterface.onmessage({ data: message }))
		worker.on("error", (...args: any[]) => workerInterface.onerror(...args))
		return workerInterface
	}
}
