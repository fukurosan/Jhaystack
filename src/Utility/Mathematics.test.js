import { findReverseTweenPoint } from "./Mathematics"

describe("Mathematics Utility Module", () => {

    it("Correctly finds tween point", () => {
        let length = 3
        let point = 1
        let divider = 1
        expect(findReverseTweenPoint(length, point, divider)).toBe(0.99)
        length = 3
        point = 1
        divider = 0.5
        expect(findReverseTweenPoint(length, point, divider)).toBe(0.8333333333333333)
        length = 3
        point = 2
        divider = 0.5
        expect(findReverseTweenPoint(length, point, divider)).toBe(0.5)
        length = 3
        point = 3
        divider = 0.5
        expect(findReverseTweenPoint(length, point, divider)).toBe(0.16666666666666666)

        length = 10
        point = 3
        divider = 0.35
        expect(findReverseTweenPoint(length, point, divider)).toBe(0.7350000000000001)

    })
    
})