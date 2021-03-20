import Declaration from "./Declaration"
import IndexEvaluationResult from "./IndexEvaluationResult"

interface IndexMap {
	[key: string]: Declaration[]
}

export interface IIndex {
	new (declarations: Declaration[]): Index
}

export default abstract class Index {
	/** A tag that labels the index (essentially a name) */
	abstract tag: string
	/**
	 * Takes a string and breaks it down into sub-components.
	 * Every index works slightly different, so the implementation of this is left up to the extended class.
	 * @param {string} string - The string to be broken down
	 * @return {string[]} - An array of sub-component strings
	 */
	abstract extractStringTokens(string: string): string[]

	declarations: Declaration[] = []
	index: IndexMap

	constructor(declarations: Declaration[]) {
		this.declarations = declarations
		this.index = {}
		this.build()
	}

	/**
	 * Builds the index map using the extractStringTokens function.
	 * Each extracted sub-component becomes a key to an array, containing all declarations that match said sub-component.
	 **/
	build(): void {
		this.index = {}
		this.declarations.forEach(declaration => {
			const value = `${declaration.value}`.toUpperCase()
			const tokens = this.extractStringTokens(value)
			tokens.forEach(token => {
				if (!this.index[token]) {
					this.index[token] = []
				}
				this.index[token].push(declaration)
			})
		})
	}

	/**
	 * Evaluates a search value against the index.
	 * Score is evaluated by building an index of the term, and then seeing if any declarations match the same index keys within a certain range.
	 * @param {unknown} term - The term that should be evaluated
	 */
	evaluate(term: unknown): IndexEvaluationResult[] {
		const termTokens = this.extractStringTokens(`${term}`.toUpperCase())
		const indexQueryResult = new Map<Declaration, number>()
		for (let i = 0; i < termTokens.length; i++) {
			const declarationArray = this.index[termTokens[i]]
			if (declarationArray) {
				for (let j = 0; j < declarationArray.length; j++) {
					const declaration = declarationArray[j]
					if (!indexQueryResult.has(declaration)) {
						indexQueryResult.set(declaration, 1)
					} else {
						indexQueryResult.set(declaration, indexQueryResult.get(declaration)! + 1)
					}
				}
			}
		}
		const result: IndexEvaluationResult[] = []
		Array.from(indexQueryResult.keys()).forEach(key => {
			const matchRatio = indexQueryResult.get(key)! / termTokens.length
			matchRatio > 0.25 && result.push(new IndexEvaluationResult(key, matchRatio))
		})
		return result
	}

	/**
	 * Removes any existing index and builds a new index based on the provided declarations.
	 * @param {Declaration[]} declarations - Array of declarations that the index should be built on
	 */
	setDeclarations(declarations: Declaration[]): void {
		this.declarations = declarations
		this.build()
	}
}
