//This is primarily used for calculating relevance based on two different criteria at the same time, where one is a predefined number length.
//The length is the number length, the depth point is the point to be calculated (lower will result in higher return), and divider is the second criteria
export const findReverseTweenPoint = (length: number, point: number, secondaryValue: number): number => {
    const increment = 1 / length
    const startPosition = increment * (length - point)
    const endPosition = startPosition + increment
    const tween = (increment * secondaryValue) + startPosition
    return tween === endPosition ? (tween - 0.00000001) : tween === startPosition ? (tween + 0.00000001) : tween
}