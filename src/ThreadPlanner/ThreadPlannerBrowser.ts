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
	createInlineWorker(fn: IThreaderFunction): IThreaderWorker {
		const functionString = fn.toString()
		const args = functionString.substring(functionString.indexOf("(") + 1, functionString.indexOf(")"))
		const content = functionString.substring(functionString.indexOf("{") + 1, functionString.lastIndexOf("}"))
		const code = `
        function execute(${args}) {
            ${content}
        }
            self.onmessage = async (params) => {
                let result = execute(...params.data)
                if(result instanceof Promise) {
                    result = await result
                }
            postMessage(result)
        }
    `
		const worker = new Worker(URL.createObjectURL(new Blob([code], { type: "text/javascript" })))
		return <IThreaderWorker>(<unknown>worker)
	}
}
