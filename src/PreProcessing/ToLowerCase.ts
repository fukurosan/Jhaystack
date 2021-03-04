/**
 * Makes strings lower case, and simply passes through other values.
 * @param {unknown} value - The value to be processed
 * @return {number} - Resulting value
 */
export const TO_LOWER_CASE = (value: unknown): unknown => {
	return typeof value === "string" ? value.toLowerCase() : value
}
