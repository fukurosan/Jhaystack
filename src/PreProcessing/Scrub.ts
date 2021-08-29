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
