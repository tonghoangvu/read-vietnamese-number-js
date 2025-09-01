import { Digit, InputNumber } from './type.js'

/**
 * Remove the given character from the left side of the string.
 *
 * @param str the string
 * @param char the character to remove
 * @returns the string with the given character removed from the start
 */
export function trimLeft(str: string, char: string): string {
	if (str === '') {
		return ''
	}
	let pos = 0
	while (str[pos] === char[0]) {
		pos++
	}
	return str.substring(pos)
}

/**
 * Remove the given character from the right side of the string.
 *
 * @param str the string
 * @param char the character to remove
 * @returns the string with the given character removed from the end
 */
export function trimRight(str: string, char: string): string {
	if (str === '') {
		return ''
	}
	let lastPos = str.length - 1
	while (str[lastPos] === char[0]) {
		lastPos--
	}
	return str.substring(0, lastPos + 1)
}

/**
 * Split the given string into an array of digits.
 *
 * @param str the string
 * @returns an array of digits, or null if the string contains invalid characters
 */
export function splitToDigits(str: string): Digit[] | null {
	const digits = str.split('').map((digit) => {
		const value = parseInt(digit, 10)
		return isNaN(value) || value < 0 || value > 9 ? null : value
	})
	return digits.includes(null) ? null : (digits as Digit[])
}

/**
 * Validate the given input number and convert it to a string.
 *
 * @param number the input number
 * @returns a string representation of the number
 * @throws TypeError if the input number is not in a valid type
 */
export function validateNumber(number: InputNumber): string {
	switch (typeof number) {
		case 'string': {
			return number
		}
		case 'bigint': {
			return number.toString()
		}
		default: {
			// Throw error on number, object, undefined, boolean, symbol, function
			// Some numbers may cause errors when in parsing process:
			// - Loss precision: Number.isInteger(value) && !Number.isSafeInteger(value)
			// - Cannot parse scientific notation: value.toString().includes('e')
			throw new TypeError('The input number must be of type string or bigint')
		}
	}
}
