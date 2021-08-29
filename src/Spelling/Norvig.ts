import ISpelling from "../Model/ISpelling"
import { NORMALIZE_CHARACTERS } from "../PreProcessing/NormalizeCharacters"
import IWordMeta from "../Model/IWordMeta"

/**
 * Based on Peter Norvigs example spelling corrector:
 * http://www.norvig.com/spell-correct.html
 * Norvig's example is farily rudimentary (as is this implementation), and has many areas in which it can be improved.
 * That being said it does do an "OK" job.
 */

interface IWordData {
	/** Counter for how many times the word has been seen */
	count: number
	/** Variations of the words with different special characters that may exist */
	variations: string[]
}

interface INorvigSpellerBuildOptions {
	customDataset?: Map<string, IWordMeta>
}

const DEFAULT_CONFIG: INorvigSpellerBuildOptions = {}

export class NORVIG implements ISpelling {
	/** Identifier for the speller module */
	id: string
	/** Options for the module */
	private options: INorvigSpellerBuildOptions
	/** Counter lookup table */
	private wordData: Map<string, IWordData> = new Map()
	/** Sum of all words */
	private wordSum = 0
	/** All letters from the English alphabet */
	private letters = "abcdefghijklmnopqrstuvwxyz".split("")

	constructor(id: string, options?: INorvigSpellerBuildOptions) {
		this.id = id
		this.options = {
			...DEFAULT_CONFIG
		}
		if (options) {
			this.options = {
				...this.options,
				...options
			}
		}
	}

	edits1(word: string): string[] {
		const splits = []
		for (let i = 0; i < word.length + 1; i++) {
			splits.push([word.slice(0, i), word.slice(i)])
		}
		const deletes = []
		for (let i = 0; i < splits.length - 1; i++) {
			const split = splits[i]
			deletes.push(split[0] + split[1].slice(1))
		}
		const transposes = []
		for (let i = 0; i < splits.length - 2; i++) {
			const split = splits[i]
			transposes.push(split[0] + split[1][1] + split[1][0] + split[1].slice(2))
		}
		const replaces = []
		for (let i = 0; i < splits.length - 1; i++) {
			const split = splits[i]
			for (let j = 0; j < this.letters.length; j++) {
				replaces.push(split[0] + this.letters[j] + split[1].slice(1))
			}
		}
		const inserts = []
		for (let i = 0; i < splits.length; i++) {
			const split = splits[i]
			for (let j = 0; j < this.letters.length; j++) {
				inserts.push(split[0] + this.letters[j] + split[1])
			}
		}
		return Array.from(new Set(deletes.concat(transposes).concat(replaces).concat(inserts)))
	}

	edits2(word: string): string[] {
		const resultSet: Set<string> = new Set()
		this.edits1(word).forEach(edit1 => {
			this.edits1(edit1).forEach(edit2 => {
				resultSet.add(edit2)
			})
		})
		return Array.from(resultSet)
	}

	known(words: string[]): string[] {
		return words.filter(word => this.wordData.has(word))
	}

	candidates(word: string): string[] {
		const knownEdits1 = this.known(this.edits1(word))
		if (knownEdits1.length) {
			return knownEdits1
		}
		const knownEdits2 = this.known(this.edits2(word))
		if (knownEdits2.length) {
			return knownEdits2
		}
		return []
	}

	getProbability(word: string) {
		return this.wordData.get(word)!.count / this.wordSum
	}

	build(values: Map<string, IWordMeta>) {
		const dataset = this.options.customDataset ? this.options.customDataset : values
		Array.from(dataset.keys()).forEach(value => {
			const meta = dataset.get(value)!
			this.wordSum += meta.count
			const normalizedValue = NORMALIZE_CHARACTERS(value.toLowerCase()).replace(/[^a-z]/g, "")
			!this.wordData.has(normalizedValue) && this.wordData.set(normalizedValue, { count: 0, variations: []})
			const dataObject = this.wordData.get(normalizedValue)!
			dataObject.count += 1
			dataObject.variations.push(value.toLowerCase())
		})
	}

	evaluate(value: string): string | null {
		if (!value) {
			return null
		}
		const normalizedValue = NORMALIZE_CHARACTERS(value.toLowerCase()).replace(/[^a-z]/g, "")
		const candidates = this.candidates(normalizedValue)
		if (candidates.length === 0) {
			return null
		}
		const topCandidate = candidates.reduce(
			(acc, candidate) => {
				const probability = this.getProbability(candidate)
				if (probability > acc[1]) {
					return [candidate, probability]
				}
				return acc
			},
			["", 0]
		)
		return this.wordData.get(<string>topCandidate[0])!.variations[0]
	}
}
