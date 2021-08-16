/**
 * Normalizes English word stems using the Lancaster algorithm.
 * You can read more about the algorithm here:
 * https://web.archive.org/web/20140827005744/http://www.comp.lancs.ac.uk/computing/research/stemming/index.htm
 * Processes either a string value or an array of string values
 * @param {any} value - The value to be processed
 * @return {number} - Resulting value
 */
export const LANCASTER = (value: any): any => {
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

const vowels = /[aeiouy]/

enum ACTIONS {
	STOP,
	INTACT,
	CONTINUE,
	PROTECT
}

interface RULE {
	endsWith: string
	replacement: string
	actionType: ACTIONS
}

interface CHARACTER_RULE {
	[key: string]: RULE[]
}

const CHARACTER_RULES: CHARACTER_RULE = Object.freeze({
	a: [
		{ endsWith: "ia", replacement: "", actionType: ACTIONS.INTACT },
		{ endsWith: "a", replacement: "", actionType: ACTIONS.INTACT }
	],
	b: [{ endsWith: "bb", replacement: "b", actionType: ACTIONS.STOP }],
	c: [
		{ endsWith: "ytic", replacement: "ys", actionType: ACTIONS.STOP },
		{ endsWith: "ic", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "nc", replacement: "nt", actionType: ACTIONS.CONTINUE }
	],
	d: [
		{ endsWith: "dd", replacement: "d", actionType: ACTIONS.STOP },
		{ endsWith: "ied", replacement: "y", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ceed", replacement: "cess", actionType: ACTIONS.STOP },
		{ endsWith: "eed", replacement: "ee", actionType: ACTIONS.STOP },
		{ endsWith: "ed", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "hood", replacement: "", actionType: ACTIONS.CONTINUE }
	],
	e: [{ endsWith: "e", replacement: "", actionType: ACTIONS.CONTINUE }],
	f: [
		{ endsWith: "lief", replacement: "liev", actionType: ACTIONS.STOP },
		{ endsWith: "if", replacement: "", actionType: ACTIONS.CONTINUE }
	],
	g: [
		{ endsWith: "ing", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "iag", replacement: "y", actionType: ACTIONS.STOP },
		{ endsWith: "ag", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "gg", replacement: "g", actionType: ACTIONS.STOP }
	],
	h: [
		{ endsWith: "th", replacement: "", actionType: ACTIONS.INTACT },
		{ endsWith: "guish", replacement: "ct", actionType: ACTIONS.STOP },
		{ endsWith: "ish", replacement: "", actionType: ACTIONS.CONTINUE }
	],
	i: [
		{ endsWith: "i", replacement: "", actionType: ACTIONS.INTACT },
		{ endsWith: "i", replacement: "y", actionType: ACTIONS.CONTINUE }
	],
	j: [
		{ endsWith: "ij", replacement: "id", actionType: ACTIONS.STOP },
		{ endsWith: "fuj", replacement: "fus", actionType: ACTIONS.STOP },
		{ endsWith: "uj", replacement: "ud", actionType: ACTIONS.STOP },
		{ endsWith: "oj", replacement: "od", actionType: ACTIONS.STOP },
		{ endsWith: "hej", replacement: "her", actionType: ACTIONS.STOP },
		{ endsWith: "verj", replacement: "vert", actionType: ACTIONS.STOP },
		{ endsWith: "misj", replacement: "mit", actionType: ACTIONS.STOP },
		{ endsWith: "nj", replacement: "nd", actionType: ACTIONS.STOP },
		{ endsWith: "j", replacement: "s", actionType: ACTIONS.STOP }
	],
	l: [
		{ endsWith: "ifiabl", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "iabl", replacement: "y", actionType: ACTIONS.STOP },
		{ endsWith: "abl", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ibl", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "bil", replacement: "bl", actionType: ACTIONS.CONTINUE },
		{ endsWith: "cl", replacement: "c", actionType: ACTIONS.STOP },
		{ endsWith: "iful", replacement: "y", actionType: ACTIONS.STOP },
		{ endsWith: "ful", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ul", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "ial", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ual", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "al", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ll", replacement: "l", actionType: ACTIONS.STOP }
	],
	m: [
		{ endsWith: "ium", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "um", replacement: "", actionType: ACTIONS.INTACT },
		{ endsWith: "ism", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "mm", replacement: "m", actionType: ACTIONS.STOP }
	],
	n: [
		{ endsWith: "sion", replacement: "j", actionType: ACTIONS.CONTINUE },
		{ endsWith: "xion", replacement: "ct", actionType: ACTIONS.STOP },
		{ endsWith: "ion", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ian", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "an", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "een", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "en", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "nn", replacement: "n", actionType: ACTIONS.STOP }
	],
	p: [
		{ endsWith: "ship", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "pp", replacement: "p", actionType: ACTIONS.STOP }
	],
	r: [
		{ endsWith: "er", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ear", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "ar", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "ior", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "or", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ur", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "rr", replacement: "r", actionType: ACTIONS.STOP },
		{ endsWith: "tr", replacement: "t", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ier", replacement: "y", actionType: ACTIONS.CONTINUE }
	],
	s: [
		{ endsWith: "ies", replacement: "y", actionType: ACTIONS.CONTINUE },
		{ endsWith: "sis", replacement: "s", actionType: ACTIONS.STOP },
		{ endsWith: "is", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ness", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ss", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "ous", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "us", replacement: "", actionType: ACTIONS.INTACT },
		{ endsWith: "s", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "s", replacement: "", actionType: ACTIONS.STOP }
	],
	t: [
		{ endsWith: "plicat", replacement: "ply", actionType: ACTIONS.STOP },
		{ endsWith: "at", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ment", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ent", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ant", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ript", replacement: "rib", actionType: ACTIONS.STOP },
		{ endsWith: "orpt", replacement: "orb", actionType: ACTIONS.STOP },
		{ endsWith: "duct", replacement: "duc", actionType: ACTIONS.STOP },
		{ endsWith: "sumpt", replacement: "sum", actionType: ACTIONS.STOP },
		{ endsWith: "cept", replacement: "ceiv", actionType: ACTIONS.STOP },
		{ endsWith: "olut", replacement: "olv", actionType: ACTIONS.STOP },
		{ endsWith: "sist", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "ist", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "tt", replacement: "t", actionType: ACTIONS.STOP }
	],
	u: [
		{ endsWith: "iqu", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "ogu", replacement: "og", actionType: ACTIONS.STOP }
	],
	v: [
		{ endsWith: "siv", replacement: "j", actionType: ACTIONS.CONTINUE },
		{ endsWith: "eiv", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "iv", replacement: "", actionType: ACTIONS.CONTINUE }
	],
	y: [
		{ endsWith: "bly", replacement: "bl", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ily", replacement: "y", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ply", replacement: "", actionType: ACTIONS.PROTECT },
		{ endsWith: "ly", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ogy", replacement: "og", actionType: ACTIONS.STOP },
		{ endsWith: "phy", replacement: "ph", actionType: ACTIONS.STOP },
		{ endsWith: "omy", replacement: "om", actionType: ACTIONS.STOP },
		{ endsWith: "opy", replacement: "op", actionType: ACTIONS.STOP },
		{ endsWith: "ity", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ety", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "lty", replacement: "l", actionType: ACTIONS.STOP },
		{ endsWith: "istry", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "ary", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ory", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "ify", replacement: "", actionType: ACTIONS.STOP },
		{ endsWith: "ncy", replacement: "nt", actionType: ACTIONS.CONTINUE },
		{ endsWith: "acy", replacement: "", actionType: ACTIONS.CONTINUE }
	],
	z: [
		{ endsWith: "iz", replacement: "", actionType: ACTIONS.CONTINUE },
		{ endsWith: "yz", replacement: "ys", actionType: ACTIONS.STOP }
	]
})

const traverse = (word: string, isintact: boolean): string => {
	const ruleset = CHARACTER_RULES[word[word.length - 1]]
	if (!ruleset) {
		return word
	}
	for (let i = 0; i < ruleset.length; i++) {
		const rule = ruleset[i]
		if (!isintact && rule.actionType === ACTIONS.INTACT) {
			continue
		}
		const breakpoint = word.length - rule.endsWith.length
		if (breakpoint < 0 || word.slice(breakpoint) !== rule.endsWith) {
			continue
		}
		if (rule.actionType === ACTIONS.PROTECT) {
			return word
		}
		const next = word.slice(0, breakpoint) + rule.replacement
		if (!(vowels.test(next[0]) ? next.length > 1 : next.length > 2 && vowels.test(next))) {
			continue
		}
		if (rule.actionType === ACTIONS.CONTINUE) {
			return traverse(next, false)
		}
		return next
	}
	return word
}

const stem = (word: string) => {
	return traverse(word.toLowerCase(), true)
}
