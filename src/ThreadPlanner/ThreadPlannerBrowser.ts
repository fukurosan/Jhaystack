import { ThreadPlanner, IThreaderFunction, IThreaderWorker } from "./ThreadPlannerMain"

export default class BrowserThreadPlanner extends ThreadPlanner {
	constructor() {
		super()
		this.maxThreads = navigator.hardwareConcurrency - 1
	}

	/**
	 * Creates a Worker object from a given function by serializing it to a string
	 * @param fn - Function to be inlined
	 */
	createInlineWorker(fn: IThreaderFunction, dependencyString: string): IThreaderWorker {
		const functionString = fn.toString()
		const args = functionString.substring(functionString.indexOf("(") + 1, functionString.indexOf(")"))
		const content = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"))
		const code = `
		${dependencyString}

        function execute(${args}) {
            ${content}
        }
            self.onmessage = async (params) => {
				let result = []
				for(let i = 0; i < params.length; i++) {
					result.push(execute(...params[i]))
				}
				for(let i = 0; i < params.length; i++)
				if(result[i] instanceof Promise) {
					result[i] = await result[i]
				}
				postMessage(result)
        }
    `
		const worker = new Worker(URL.createObjectURL(new Blob([code], { type: "text/javascript" })))
		return <IThreaderWorker>(<unknown>worker)
	}
}
