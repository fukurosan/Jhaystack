/**
 * Normalizes English word stems using the porter2 (aka snowball) algorithm.
 * This code is based on the explanation found at:
 * https://snowballstem.org/algorithms/english/stemmer.html
 * Processes either a string value or an array of string values
 * @param {unknown} value - The value to be processed
 * @return {number} - Resulting value
 */
export const PORTER2 = (value: unknown): unknown => {
	if (typeof value === "string") {
		return value
			.split(" ")
			.map(subValue => stem(subValue))
			.join(" ")
	} else if (Array.isArray(value)) {
		return value.map(subValue => stem(subValue))
	}
	return value
}

//First item is the search, second is the replacement position, third is the replacement.
//Some suffixes have been merged to speed things up
const step2Replacements = [
	[/ational$/, /(\w*)ational$/, "$1ate"],
	[/ization$/, /(\w*)ization$/, "$1ize"],
	[/fulness$/, /(\w*)fulness$/, "$1ful"],
	[/(ousness|ousli)$/, /(\w*)(ousness|ousli)$/, "$1ous"],
	[/(iveness|iviti)$/, /(\w*)(iveness|iviti)$/, "$1ive"],
	[/tional$/, /(\w*)tional$/, "$1tion"],
	[/(biliti|bli)$/, /(\w*)(biliti|bli)$/, "$1ble"],
	[/lessli$/, /(\w*)lessli$/, "$1less"],
	[/(ation|ator)$/, /(\w*)(ation|ator)$/, "$1ate"],
	[/(alism|aliti|alli)$/, /(\w*)(alism|aliti|alli)$/, "$1al"],
	[/entli$/, /(\w*)entli$/, "$1ent"],
	[/fulli$/, /(\w*)fulli$/, "$1ful"],
	[/enci$/, /(\w*)enci$/, "$1ence"],
	[/anci$/, /(\w*)anci$/, "$1ance"],
	[/abli$/, /(\w*)abli$/, "$1able"],
	[/logi$/, /(\w*)logi$/, "$1og"]
]
const step3ReplacementsR1 = [
	[/ational$/, /(\w*)ational$/, "$1ate"],
	[/tional$/, /(\w*)tional$/, "$1tion"],
	[/alize$/, /(\w*)alize$/, "$1al"],
	[/(icate|iciti|ical)$/, /(\w*)(icate|iciti|ical)$/, "$1ic"],
	[/(ful|ness)$/, /(\w*)(ful|ness)$/, "$1"]
]
const step3ReplacementsR2 = [[/ative$/, /(\w*)ative$/, "$1"]]

//Check if a syllable is "short"
const isShortSyllable = (word: string, R1: number) => {
	return word.match(/^([aeouiy][^aeouiy]|\w*[^aeiouy][aeouiy][^aeouiyYwx])$/) !== null && R1 >= word.length
}

//Some ys are to be treated as consonants. Mark them by capitalization.
const changeY = (word: string) => {
	if (word.indexOf("y") === -1) {
		return word
	}
	return word[0] === "y" ? `Y${word.slice(1)}` : word.replace(/([aeiou])y/g, "$1Y")
}

//Find R1
const getR1 = (word: string) => {
	//Handle exceptional forms
	const exceptional = word.match(/^(gener|commun|arsen)(.*)/)
	if (exceptional) {
		return exceptional[2].length
	}
	//Otherwise...
	const R1 = word.search(/[aeiouy][^aeiouy]/)
	return R1 === -1 ? word.length : R1 + 2
}

//Find R2
const getR2 = (word: string, R1: number) => {
	if (R1 === word.length) {
		return R1
	}
	const afterR1 = word.slice(R1)
	const R2 = afterR1.search(/[aeiouy][^aeiouy]/)
	return R2 === -1 ? word.length : R1 + R2 + 2
}

//Remove apstrophes indicating posession.
const removeApostrophe = (word: string) => {
	const match = word.match(/^(\w*)'s?'?$/)
	return match ? match[1] : word
}

//Replace suffixes (1)
const step1A = (word: string) => {
	if (word.match(/sses$/)) {
		return word.replace(/(\w*)sses$/, "$1ss")
	}
	const iedies = word.match(/(\w*)(ied|ies)$/)
	if (iedies) {
		if (iedies[1].length > 1) {
			return word.replace(/(\w*)(ied|ies)$/, "$1i")
		} else {
			return word.replace(/(\w*)(ied|ies)$/, "$1ie")
		}
	} else if (word.match(/(\w*)(u|s)s$/)) {
		return word
	} else if (word.match(/\w*?[aeiouy]\w+s$/)) {
		return word.slice(0, word.length - 1)
	}
	return word
}

//Check if word is a step1A invariant word
const isStep1AInvariantWord = (word: string) => {
	const invariantWords = ["inning", "outing", "canning", "herring", "earring", "proceed", "exceed", "succeed"]
	return invariantWords.includes(word) ? true : false
}

//Replace Suffixes (2)
const step1B = (word: string, R1: number) => {
	if (word.search(/(eed|eedly)$/) >= R1) {
		return word.replace(/(\w*)(eed|eedly)/, "$1ee")
	}
	const suffixes = word.match(/^(\w*?[aeiouy]\w+)(ed|edly|ing|ingly)$/)
	if (suffixes) {
		word = suffixes[1]
		if (word.match(/(at|bl|iz)$/)) {
			return `${word}e`
		} else if (word.match(/(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/)) {
			return word.slice(0, word.length - 1)
		} else if (isShortSyllable(word, R1)) {
			return `${word}e`
		}
	}
	return word
}

//Replaces "vowel y" or "consonant Y" if preceeded by a non-vowel which is not the first character in the word.
const step1C = (word: string) => {
	return word.replace(/(\w+[^aeiouy])(y|Y)$/, "$1i")
}

//Replace Suffixes (3)
const step2 = (word: string, R1: number) => {
	for (let i = 0; i < step2Replacements.length; i++) {
		if (word.search(step2Replacements[i][0]) >= R1) {
			return word.replace(step2Replacements[i][1], <string>step2Replacements[i][2])
		}
	}
	if (word.search(/[cdeghkmnrt]li$/) >= R1) {
		return word.replace(/(\w*)li$/, "$1")
	}
	return word
}

//Replace suffixes (4)
const step3 = (word: string, R1: number, R2: number) => {
	for (let i = 0; i < step3ReplacementsR1.length; i++) {
		if (word.search(step3ReplacementsR1[i][0]) >= R1) {
			return word.replace(step3ReplacementsR1[i][1], <string>step3ReplacementsR1[i][2])
		}
	}
	for (let i = 0; i < step3ReplacementsR2.length; i++) {
		if (word.search(step3ReplacementsR2[i][0]) >= R2) {
			return word.replace(step3ReplacementsR2[i][1], <string>step3ReplacementsR2[i][2])
		}
	}
	return word
}

//Remove suffixes
const step4 = (word: string, R2: number) => {
	if (word.search(/ement$/) >= R2) {
		return word.replace(/(\w*)ement$/, "$1")
	} else if (word.search(/ment$/) >= R2) {
		return word.replace(/(\w*)ment$/, "$1")
	} else if (word.search(/(al|ance|ence|er|ic|able|ible|ant|ent|ism|ate|iti|ous|ive|ize)$/) >= R2) {
		return word.replace(/(\w*)(al|ance|ence|er|ic|able|ible|ant|ent|ism|ate|iti|ous|ive|ize)$/, "$1")
	} else if (word.search(/(s|t)ion$/) >= R2) {
		return word.replace(/(\w*)(s|t)ion$/, "$1")
	}
	return word
}

//Terminal es and ls have special rules
const step5 = (word: string, R1: number, R2: number) => {
	if (word.search(/e$/) >= R2) {
		return word.substr(0, word.length - 1)
	}
	if (word.search(/e$/) >= R1 && !isShortSyllable(word.match(/(\w*)e$/)![1], R1)) {
		return word.substr(0, word.length - 1)
	}
	if (word.search(/ll$/) >= R2) {
		return word.substr(0, word.length - 1)
	}
	return word
}

//Finalize the stem
const finalize = (word: string) => {
	return word.replace(/Y/g, "y").replace(/'/, "")
}

const stem = (word: string) => {
	//Return words that are 2 or less characters
	if (word.length <= 2) {
		return word
	}

	//Return words that are in the invariant list
	const invariantWords = ["sky", "news", "howe", "atlas", "cosmos", "bias", "andes"]
	if (invariantWords.includes(word)) {
		return word
	}

	let result = word.toLowerCase()
	result = changeY(result)
	const R1 = getR1(result)
	const R2 = getR2(result, R1)
	result = removeApostrophe(result)
	result = step1A(result)
	if (isStep1AInvariantWord(result)) {
		return result
	}
	result = step1B(result, R1)
	result = step1C(result)
	result = step2(result, R1)
	result = step3(result, R1, R2)
	result = step4(result, R2)
	result = step5(result, R1, R2)
	result = finalize(result)
	return result
}
