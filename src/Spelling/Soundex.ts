import ISpelling from "../Model/ISpelling"
import { NORMALIZE_CHARACTERS } from "../PreProcessing/NormalizeCharacters"
import { DAMERAU } from "../Comparison/Damerau"
import { ObjectLiteral } from "../Utility/JsonUtility"
import IWordMeta from "../Model/IWordMeta"

/**
 * Based on the American Soundex encoding.
 * Originally developed by Robert C Russels and Margaret King Odell, patent US1261167, later refined by a variety of inidividuals
 * Fuzzy improvements in this library are based on work developed by David Holmes and M. Catherine McCabe ("Improving Precision and Recall for Soundex Retrieval", 2002)
 * http://web.archive.org/web/20100629121128/http://www.ir.iit.edu/publications/downloads/IEEESoundexV5.pdf
 */

interface IFuzzyReplacements {
	rule: RegExp
	replacement: string
}

interface ISoundexSpellerBuildOptions {
	fuzzy?: boolean
	customCodes?: ObjectLiteral
	customReplacements?: IFuzzyReplacements[]
}

const DEFAULT_CONFIG: ISoundexSpellerBuildOptions = {
	fuzzy: true
}

interface ISoundexCodes {
	[key: string]: number
}

export class SOUNDEX implements ISpelling {
	/** Identifier for the speller module */
	id: string
	/** Options for the module */
	private options: ISoundexSpellerBuildOptions
	/** Soundex translation table */
	// prettier-ignore
	private codes: ISoundexCodes = {
		a: 0, e: 0, i: 0, o: 0, u: 0, h: 0, w: 0, y: 0,
		b: 1, f: 1, p: 1, v: 1,
		c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
		d: 3, t: 3,
		l: 4,
		m: 5, n: 5,
		r: 6
	}

	/** Fuzzy replacement table */
	private fuzzyReplacements: IFuzzyReplacements[] = [
		{ rule: /ca/g, replacement: "ka" },
		{ rule: /c[ck]/g, replacement: "kk" },
		{ rule: /ce/g, replacement: "se" },
		{ rule: /ch$/g, replacement: "kk" },
		{ rule: /ch?l/g, replacement: "kl" },
		{ rule: /ch?r/g, replacement: "kr" },
		{ rule: /ci/g, replacement: "si" },
		{ rule: /co/g, replacement: "ko" },
		{ rule: /^[ct][sz]/g, replacement: "ss" },
		{ rule: /cu/g, replacement: "ku" },
		{ rule: /cy/g, replacement: "sy" },
		{ rule: /dg/g, replacement: "gg" },
		{ rule: /gh/g, replacement: "hh" },
		{ rule: /^gn/g, replacement: "nn" },
		{ rule: /"^[hw]r"/g, replacement: "rr" },
		{ rule: /"^hw"/g, replacement: "ww" },
		{ rule: /"^kn|ng"/g, replacement: "nn" },
		{ rule: /"ma?c"/g, replacement: "mk" },
		{ rule: /"nst"/g, replacement: "nss" },
		{ rule: /"^nt"/g, replacement: "tt" },
		{ rule: /"p[fh]"/g, replacement: "ff" },
		{ rule: /"rd?t$"/g, replacement: "rr" },
		{ rule: /"sch"/g, replacement: "sss" },
		{ rule: /"ti[ao]"/g, replacement: "sio" },
		{ rule: /"tch"/g, replacement: "chh" }
	]

	/** Fuzzy Codes */
	// prettier-ignore
	private fuzzyCodes: ISoundexCodes = {
		a: 0, e: 0, i: 0, o: 0, u: 0, h: 0, w: 0, y: 0,
		b: 1, p: 1, f: 1, v: 1,
		d: 3, t: 3,
		l: 4, 
		m: 5, n: 5,
		r: 6,
		g: 7, j: 7, k: 7, q: 7, x: 7,
		c: 9, s: 9, z: 9
	}

	/** Map of identity -> Word(s) */
	private index: Map<string, string[]> = new Map()

	constructor(id: string, options?: ISoundexSpellerBuildOptions) {
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

	encode(value: string) {
		//Normalize the string
		const normalized = <string>NORMALIZE_CHARACTERS(value)
			.toLowerCase()
			.replace(/[^a-z]/g, "")
		if (normalized === "") {
			return null
		}
		//Retrieve the first letter
		const firstCharacter = normalized.charAt(0)
		//Remove the first character from the string
		const formatted = normalized.substring(1)
		if (this.options.fuzzy) {
			const replacements = this.options.customReplacements ? this.options.customReplacements : this.fuzzyReplacements
			replacements.forEach(replacement => {
				formatted.replace(replacement.rule, replacement.replacement)
			})
		}
		//Split the string into an array of letters
		const characters = formatted.split("")
		//Encode letters to digits using the soundex table
		const digits = characters.map(character => {
			if (this.options.customCodes) {
				return this.options.customCodes[character]
			} else if (this.options.fuzzy) {
				return this.fuzzyCodes[character]
			}
			return this.codes[character]
		})
		//Remove consecutive identical digits
		const noDuplicates = digits.filter((character, index, array) => {
			if (index === 0) {
				return true
			}
			return array[index - 1] !== character
		})
		//Remove all 0 values
		const noZero = noDuplicates.filter(character => character !== 0)
		//Join result, pad with 000 suffix and return first 4 characters
		return (firstCharacter + noZero.join("") + "000").slice(0, 4)
	}

	build(values: Map<string, IWordMeta>) {
		Array.from(values.keys()).forEach(value => {
			const encodedValue = this.encode(value)
			if (!encodedValue) {
				return
			}
			!this.index.has(encodedValue) && this.index.set(encodedValue, [])
			this.index.get(encodedValue)!.push(value.toLowerCase())
		})
	}

	evaluate(value: string): string | null {
		if (!value) {
			return null
		}
		const encodedValue = this.encode(value)
		if (!encodedValue) {
			return null
		}
		if (!this.index.has(encodedValue)) {
			return null
		}
		const result = this.index.get(encodedValue)!.reduce(
			(acc, word) => {
				const score = DAMERAU(value, word)
				return score > acc[1] ? [word, score] : acc
			},
			["", 0]
		)
		return <string>result[0]
	}
}
