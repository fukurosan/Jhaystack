/**
 * Cleans an array or a string from common special characters.
 * @param {any} value - The value to be processed
 * @return {number} - Cleaned value
 */
export const SCRUB = (value: any): any => {
	if (Array.isArray(value)) {
		return value.map(val => getScrubbedWord(val))
	} else if (typeof value === "string") {
		return getScrubbedWord(value)
	}
	return value
}

const getScrubbedWord = (word: string) => {
	return word
		.replace(/[àáâãäå]/g, "a")
		.replace(/æ/g, "ae")
		.replace(/ç/g, "c")
		.replace(/[èéêë]/g, "e")
		.replace(/[ìíîï]/g, "i")
		.replace(/ñ/g, "n")
		.replace(/[òóôõö]/g, "o")
		.replace(/œ/g, "oe")
		.replace(/[ùúûü]/g, "u")
		.replace(/[ýÿ]/g, "y")
		.replace(/[ÀÁÂÃÄÅ]/g, "A")
		.replace(/[ÈÉÊË]/g, "E")
		.replace(/[ÌÍÎÏ]/g, "i")
		.replace(/Ñ/g, "N")
		.replace(/[ÒÓÔÕÖ]/g, "O")
		.replace(/[ÙÚÛÜ]/g, "U")
		.replace(/[ÝŸ]/g, "Y")
		.split("")
		.filter(character => !stopCharacters.has(character))
		.join("")
		.split("  ")
		.join(" ")
}

export const stopCharacters = new Set([
	".",
	",",
	"!",
	"?",
	"'",
	'"', // eslint-disable-line quotes
	"#",
	"¤",
	"%",
	"&",
	"/",
	"(",
	")",
	"=",
	"´",
	"@",
	"£",
	"$",
	"€",
	"{",
	"[",
	"]",
	"}",
	"\\",
	"+",
	"-",
	"_",
	";",
	"<",
	">",
	"§"
])
