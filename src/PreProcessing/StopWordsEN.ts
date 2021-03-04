/**
 * Cleans an array or a string from common English stop words.
 * @param {unknown} value - The value to be processed
 * @return {number} - Cleaned value
 */
export const STOP_WORDS_EN = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.filter(val => !stopWords.has(getScrubbedWord(val)))
	} else if (typeof value === "string") {
		const result = []
		const words = value.split(" ")
		for (let i = 0; i < words.length; i++) {
			const scrubbedWord = getScrubbedWord(words[i])
			if (!stopWords.has(scrubbedWord)) {
				result.push(words[i])
			}
		}
		return result.join(" ")
	}
	return value
}

const getScrubbedWord = (word: string) => {
	return word
		.split("")
		.filter(character => !stopCharacters.has(character))
		.join("")
		.toLowerCase()
}

const stopCharacters = new Set([".", ",", "!", "?", "'"])

const stopWords = new Set([
	"a",
	"about",
	"above",
	"actually",
	"after",
	"again",
	"against",
	"all",
	"almost",
	"also",
	"although",
	"always",
	"am",
	"an",
	"and",
	"any",
	"are",
	"as",
	"at",
	"be",
	"became",
	"become",
	"because",
	"been",
	"before",
	"being",
	"below",
	"between",
	"both",
	"but",
	"by",
	"can",
	"could",
	"did",
	"do",
	"does",
	"doing",
	"down",
	"during",
	"each",
	"either",
	"else",
	"few",
	"for",
	"from",
	"further",
	"had",
	"has",
	"have",
	"having",
	"he",
	"hed",
	"hell",
	"hence",
	"hes",
	"her",
	"here",
	"heres",
	"hers",
	"herself",
	"him",
	"himself",
	"his",
	"how",
	"hows",
	"I",
	"Id",
	"Ill",
	"Im",
	"Ive",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"its",
	"itself",
	"just",
	"lets",
	"may",
	"maybe",
	"me",
	"might",
	"mine",
	"more",
	"most",
	"must",
	"my",
	"myself",
	"neither",
	"nor",
	"not",
	"of",
	"oh",
	"on",
	"once",
	"only",
	"ok",
	"or",
	"other",
	"ought",
	"our",
	"ours",
	"ourselves",
	"out",
	"over",
	"own",
	"same",
	"she",
	"shed",
	"shell",
	"shes",
	"should",
	"so",
	"some",
	"such",
	"than",
	"that",
	"thats",
	"the",
	"their",
	"theirs",
	"them",
	"themselves",
	"then",
	"there",
	"theres",
	"these",
	"they",
	"theyd",
	"theyll",
	"theyre",
	"theyve",
	"this",
	"those",
	"through",
	"to",
	"too",
	"under",
	"until",
	"up",
	"very",
	"was",
	"we",
	"wed",
	"well",
	"were",
	"weve",
	"were",
	"what",
	"whats",
	"when",
	"whenever",
	"whens",
	"where",
	"whereas",
	"wherever",
	"wheres",
	"whether",
	"which",
	"while",
	"who",
	"whoever",
	"whos",
	"whose",
	"whom",
	"why",
	"whys",
	"will",
	"with",
	"within",
	"would",
	"yes",
	"yet",
	"you",
	"youd",
	"youll",
	"youre",
	"youve",
	"your",
	"yours",
	"yourself",
	"yourselves"
])
