import { ThreadPlanner } from "./ThreadPlannerMain"
import NodeThreadPlanner from "./ThreadPlannerNode"
import BrowserThreadPlanner from "./ThreadPlannerBrowser"

let threadPlanner: ThreadPlanner
if (typeof window === "undefined") {
	threadPlanner = new NodeThreadPlanner()
} else {
	threadPlanner = new BrowserThreadPlanner()
}

export const runThread = (fn: (...args: any[]) => any, ...args: any[]) => {
	return threadPlanner.run(fn, ...args)
}

export const terminateThread = (fn: (...args: any[]) => any) => {
	threadPlanner.terminate(fn)
}
