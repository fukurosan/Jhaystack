import { TO_STRING, TO_UPPER_CASE } from "./PreProcessingStrategy"

describe("Value Processing Strategy", () => {
	it("Serializes to strings", () => {
		const date = new Date()
		expect(TO_STRING("Hello World")).toBe("Hello World")
		expect(TO_STRING(123)).toBe("123")
		expect(TO_STRING(date)).toBe(`${date}`)
	})

	it("Changes to upper case", () => {
		expect(TO_UPPER_CASE("Hello World")).toBe("HELLO WORLD")
		expect(TO_UPPER_CASE(123)).toBe(123)
		expect(typeof TO_UPPER_CASE(123)).toBe("number")
		expect(typeof new Date()).toBe("object")
	})
})
