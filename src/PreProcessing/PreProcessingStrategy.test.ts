import { TO_STRING, TO_LOWER_CASE, STOP_WORDS_EN, SCRUB, PORTER2, LANCASTER, NORMALIZE_CHARACTERS } from "./PreProcessingStrategy"
import { ObjectLiteral } from "../Utility/JsonUtility"

describe("Value Processing Strategy", () => {
	it("Serializes to strings", () => {
		const date = new Date()
		expect(TO_STRING("Hello World")).toBe("Hello World")
		expect(TO_STRING(123)).toBe("123")
		expect(TO_STRING(date)).toBe(`${date}`)
	})

	it("Changes to lower case", () => {
		expect(TO_LOWER_CASE("HELLO WORLD")).toBe("hello world")
		expect(TO_LOWER_CASE(123)).toBe(123)
		expect(typeof TO_LOWER_CASE(123)).toBe("number")
		expect(typeof new Date()).toBe("object")
	})

	it("Removes stop words", () => {
		const stringValue = "He'll be alright, he's a quick learner he is."
		const arrayValue = stringValue.split(" ")
		expect(STOP_WORDS_EN(stringValue)).toBe("alright, quick learner")
		expect(STOP_WORDS_EN(arrayValue)).toStrictEqual(["alright,", "quick", "learner"])
		expect(STOP_WORDS_EN(123)).toBe(123)
	})

	it("Scrubs values", () => {
		const scrubCharacters = [".,!?'\"#¤%&/()=´@£$€{[]}\\+-_;<>§"]
		const stringValue = `I'm really ${scrubCharacters} happy!`
		const arrayValue = [`I'm really ${scrubCharacters} happy!`, `I'm really ${scrubCharacters} grumpy too though!`]
		expect(SCRUB(stringValue)).toBe("Im really happy")
		expect(SCRUB(arrayValue)).toStrictEqual(["Im really happy", "Im really grumpy too though"])
		expect(SCRUB(123)).toBe(123)
	})

	it("Normalizes characters", () => {
		const stringValue = "ím rêally happy!"
		expect(NORMALIZE_CHARACTERS(stringValue)).toBe("im really happy!")
		expect(NORMALIZE_CHARACTERS(123)).toBe(123)
	})

	it("Porter2 stemmer works", () => {
		const testVocabulary: ObjectLiteral = {
			consign: "consign",
			consigned: "consign",
			consigning: "consign",
			consignment: "consign",
			consist: "consist",
			consisted: "consist",
			consistency: "consist",
			consistent: "consist",
			consistently: "consist",
			consisting: "consist",
			consists: "consist",
			consolation: "consol",
			consolations: "consol",
			consolatory: "consolatori",
			console: "consol",
			consoled: "consol",
			consoles: "consol",
			consolidate: "consolid",
			consolidated: "consolid",
			consolidating: "consolid",
			consoling: "consol",
			consolingly: "consol",
			consols: "consol",
			consonant: "conson",
			consort: "consort",
			consorted: "consort",
			consorting: "consort",
			conspicuous: "conspicu",
			conspicuously: "conspicu",
			conspiracy: "conspiraci",
			conspirator: "conspir",
			conspirators: "conspir",
			conspire: "conspir",
			conspired: "conspir",
			conspiring: "conspir",
			constable: "constabl",
			constables: "constabl",
			constance: "constanc",
			constancy: "constanc",
			constant: "constant",
			knack: "knack",
			knackeries: "knackeri",
			knacks: "knack",
			knag: "knag",
			knave: "knave",
			knaves: "knave",
			knavish: "knavish",
			kneaded: "knead",
			kneading: "knead",
			knee: "knee",
			kneel: "kneel",
			kneeled: "kneel",
			kneeling: "kneel",
			kneels: "kneel",
			knees: "knee",
			knell: "knell",
			knelt: "knelt",
			knew: "knew",
			knick: "knick",
			knif: "knif",
			knife: "knife",
			knight: "knight",
			knightly: "knight",
			knights: "knight",
			knit: "knit",
			knits: "knit",
			knitted: "knit",
			knitting: "knit",
			knives: "knive",
			knob: "knob",
			knobs: "knob",
			knock: "knock",
			knocked: "knock",
			knocker: "knocker",
			knockers: "knocker",
			knocking: "knock",
			knocks: "knock",
			knopp: "knopp",
			knot: "knot",
			knots: "knot"
		}
		Object.keys(testVocabulary).forEach(key => {
			expect(PORTER2(key)).toBe(testVocabulary[key])
		})
	})

	it("Lancaster stemmer works", () => {
		const testVocabulary: ObjectLiteral = {
			consign: "consign",
			consigned: "consign",
			consigning: "consign",
			consignment: "consign",
			consist: "consist",
			consisted: "consist",
			consistency: "consist",
			consistent: "consist",
			consistently: "consist",
			consisting: "consist",
			consists: "consist",
			consolation: "consol",
			consolations: "consol",
			consolatory: "consol",
			console: "consol",
			consoled: "consol",
			consoles: "consol",
			consolidate: "consolid",
			consolidated: "consolid",
			consolidating: "consolid",
			consoling: "consol",
			consolingly: "consol",
			consols: "consol",
			consonant: "conson",
			consort: "consort",
			consorted: "consort",
			consorting: "consort",
			conspicuous: "conspicu",
			conspicuously: "conspicu",
			conspiracy: "conspir",
			conspirator: "conspir",
			conspirators: "conspir",
			conspire: "conspir",
			conspired: "conspir",
			conspiring: "conspir",
			constable: "const",
			constables: "const",
			constance: "const",
			constancy: "const",
			constant: "const",
			knack: "knack",
			knackeries: "knackery",
			knacks: "knack",
			knag: "knag",
			knave: "knav",
			knaves: "knav",
			knavish: "knav",
			kneaded: "knead",
			kneading: "knead",
			knee: "kne",
			kneel: "kneel",
			kneeled: "kneel",
			kneeling: "kneel",
			kneels: "kneel",
			knees: "kne",
			knell: "knel",
			knelt: "knelt",
			knew: "knew",
			knick: "knick",
			knif: "knif",
			knife: "knif",
			knight: "knight",
			knightly: "knight",
			knights: "knight",
			knit: "knit",
			knits: "knit",
			knitted: "knit",
			knitting: "knit",
			knives: "kniv",
			knob: "knob",
			knobs: "knob",
			knock: "knock",
			knocked: "knock",
			knocker: "knock",
			knockers: "knock",
			knocking: "knock",
			knocks: "knock",
			knopp: "knop",
			knot: "knot",
			knots: "knot"
		}
		Object.keys(testVocabulary).forEach(key => {
			expect(LANCASTER(key)).toBe(testVocabulary[key])
		})
	})
})
