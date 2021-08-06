import ICluster from "./ICluster"
import { DocumentID } from "../../Model/Document"
import { IIndexStatistics } from "../IIndexStatistics"
import { getRandomNumberInRange } from "../../Utility/MathUtils"
import IIndexDocument from "../IIndexDocument"

interface IKMeansClusterOptions {
	/** Number of clusters. If set to -1 the optimal number will be estimated by the algorithm. */
	k?: number
	/** Number of times to run the readjustment algorithm. A higher number becomes more accurate, a lower number executes faster at build time. */
	maxRepetition?: number
}

const DEFAULT_OPTIONS: IKMeansClusterOptions = Object.freeze({
	k: -1,
	maxRepetition: 10
})

export class KMeans implements ICluster {
	/** Identifier for the cluster within the index */
	id: string
	/** Configuration for the KMeansCluster module */
	private options: IKMeansClusterOptions
	/** Cluster map that holds the link between the leader vector and the follower documents */
	private clusterMap = new Map<number[], DocumentID[]>()

	constructor(id: any, options: IKMeansClusterOptions) {
		this.id = id
		this.options = {
			...DEFAULT_OPTIONS,
			...options
		}
	}

	evaluate(document: IIndexDocument): DocumentID[] {
		const clusterLeaders = [...this.clusterMap.keys()]
		return this.clusterMap.get(clusterLeaders[this.findLeaderVectorIndex(clusterLeaders, document.vector)])!
	}

	build(documents: IIndexDocument[], statistics: IIndexStatistics) {
		this.buildCluster(documents, statistics, this.options.k, this.options.maxRepetition)
	}

	/** Only for testing */
	getClusterMap() {
		return this.clusterMap
	}

	getDistance(a: number[], b: number[]): number {
		const differences = []
		for (let i = 0; i < a.length; i++) {
			differences.push(a[i] - b[i])
		}
		return differences.reduce((acc, cell) => acc + cell * cell, 0)
	}

	findLeaderVectorIndex(leaders: number[][], followerVector: number[]): number {
		let score = Infinity
		let leader: number
		for (let i = 0; i < leaders.length; i++) {
			const leaderVector = leaders[i]
			const distance = this.getDistance(leaderVector, followerVector)
			if (distance < score) {
				score = distance
				leader = i
			}
		}
		return leader!
	}

	/**
	 * Creates clusters using unsupervised k-means.
	 * @param {IIndexDocument[]} vectors - All index documents
	 * @param {IIndexStatistics} statistics - Index statistics
	 * @param {number} k - Number of clusters. If set to -1 the optimal number will be estimated by the algorithm.
	 * @param {number} maxRepetition - Number of times to run the readjustment algorithm. A higher number becomes more accurate, a lower number executes faster at build time.
	 */
	buildCluster(documents: IIndexDocument[], statistics: IIndexStatistics, k = -1, maxRepetition = 10): void {
		if (k < 1) {
			//Guesstimation
			k = Math.max(2, Math.ceil(Math.sqrt(statistics.numberOfDocuments / 2)))
		}
		if (k > statistics.numberOfDocuments) {
			throw new Error("Cluster size cannot be larger than corpus.")
		}
		const leaders: number[][] = []
		let followerVectors: number[][][] = []
		let followerDocuments: DocumentID[][] = []
		const seenIDs = new Set()
		for (let i = 0; i < k; i++) {
			let found = false
			while (!found) {
				const vector = documents[getRandomNumberInRange(0, documents.length - 1)]
				if (!seenIDs.has(vector.document.id)) {
					leaders.push(vector.vector)
					followerDocuments.push([])
					followerVectors.push([])
					seenIDs.add(vector.document.id)
					found = true
				}
			}
		}
		const run = () => {
			followerDocuments = followerDocuments.map(() => [])
			followerVectors = followerVectors.map(() => [])
			//Find a leader for all the followers
			for (let n = 0; n < documents.length; n++) {
				const followerVector = documents[n].vector
				const leaderIndex = this.findLeaderVectorIndex(leaders, followerVector)
				followerVectors[leaderIndex].push(followerVector)
				followerDocuments[leaderIndex].push(documents[n].document.id)
			}
			//Set the new mean value for the leaders
			for (let i = 0; i < leaders.length; i++) {
				const meanVector: number[] = []
				const followerList = followerVectors[i]
				for (let j = 0; j < leaders[i].length; j++) {
					let point = 0
					for (let n = 0; n < followerList.length; n++) {
						point += followerList[n][j]
					}
					meanVector.push(point / followerList.length)
				}
				leaders[i] = meanVector
			}
		}

		if (maxRepetition > 0) {
			for (let i = 0; i < maxRepetition; i++) {
				run()
			}
		} else {
			//I hope you know what you're doing..
			let lastLeaders = JSON.stringify(leaders)
			while (JSON.stringify(leaders) !== lastLeaders) {
				run()
				lastLeaders = JSON.stringify(leaders)
			}
		}

		const cluster: Map<number[], DocumentID[]> = new Map<number[], DocumentID[]>()
		for (let i = 0; i < leaders.length; i++) {
			cluster.set(leaders[i], followerDocuments[i])
		}

		this.clusterMap = cluster
	}
}
