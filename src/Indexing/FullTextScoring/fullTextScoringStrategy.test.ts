import { FULLTEXT_COSINE, FULLTEXT_MAGNITUDE } from "./fullTextScoringStrategy"

describe("Scoring Strategy Module", () => {
	const vector1 = [10, 50, 200]
	const vector2 = [400, 100, 20]
	const vector3 = [10, 5, 1]

	const vector1UnitLength = [0.04845016, 0.24225079, 0.96900317]
	const vector2UnitLength = [0.96900317, 0.24225079, 0.04845016]
	const vector3UnitLength = [0.89087081, 0.4454354, 0.08908708]

	const v1false = {
		vector: vector1,
		isUnitLength: false
	}
	const v2false = {
		vector: vector2,
		isUnitLength: false
	}
	const v3false = {
		vector: vector3,
		isUnitLength: false
	}
	const v1true = {
		vector: vector1UnitLength,
		isUnitLength: true
	}
	const v2true = {
		vector: vector2UnitLength,
		isUnitLength: true
	}
	const v3true = {
		vector: vector3UnitLength,
		isUnitLength: true
	}

	it("Cosine works", () => {
		expect(FULLTEXT_COSINE(v1false, v2false)).toBe(0.15257992107514465)
		expect(FULLTEXT_COSINE(v1false, v3false)).toBe(0.23645632318535478)
		expect(FULLTEXT_COSINE(v2false, v3false)).toBe(0.9716290809077709)
		expect(FULLTEXT_COSINE(v1true, v2true)).toBe(0.1525821625096385)
		expect(FULLTEXT_COSINE(v1true, v3true)).toBe(0.23739557375383918)
		expect(FULLTEXT_COSINE(v2true, v3true)).toBe(0.9754799997743666)
	})

	it("Magnitude works", () => {
		expect(FULLTEXT_MAGNITUDE(v1false, v2false)).toBe(260)
		expect(FULLTEXT_MAGNITUDE(v1false, v3false)).toBe(92)
		expect(FULLTEXT_MAGNITUDE(v2false, v3false)).toBe(178.66666666666666)
		expect(FULLTEXT_MAGNITUDE(v1true, v2true)).toBe(0.8398027466666665) //Rounding error
		expect(FULLTEXT_MAGNITUDE(v1true, v3true)).toBe(0.89503247)
		expect(FULLTEXT_MAGNITUDE(v2true, v3true)).toBe(0.89503247)
	})
})
