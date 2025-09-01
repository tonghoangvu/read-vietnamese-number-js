import {
	Digit,
	InputNumber,
	InvalidNumberError,
	NumberData,
	Period,
	ReadingConfig,
} from './type.js'
import { splitToDigits, trimLeft, trimRight, validateNumber } from './util.js'

/**
 * Read the last two digits of a number.
 *
 * @param config the reading configuration
 * @param b the digit in the tens place
 * @param c the digit in the units place
 * @returns an array of words
 */
export function readLastTwoDigits(config: ReadingConfig, b: Digit, c: Digit): string[] {
	const output: string[] = []
	switch (b) {
		case 0: {
			// In case b is 0, the parent function is responsible for reading b in some way or not
			output.push(config.digits[c])
			break
		}
		case 1: {
			output.push(config.tenText)
			if (c === 5) {
				output.push(config.fiveToneText)
			} else if (c !== 0) {
				output.push(config.digits[c])
			}
			break
		}
		default: {
			output.push(config.digits[b])
			if (!config.skipTenTone || c === 0) {
				output.push(config.tenToneText)
			}
			if (c === 1) {
				output.push(config.oneToneText)
			} else if (c === 4) {
				output.push(config.fourToneText)
			} else if (c === 5) {
				output.push(config.fiveToneText)
			} else if (c !== 0) {
				output.push(config.digits[c])
			}
			break
		}
	}
	return output
}

/**
 * Read three digits in a period of a number.
 *
 * @param config the reading configuration
 * @param a the digit in the hundreds place
 * @param b the digit in the tens place
 * @param c the digit in the units place
 * @param readZeroHundred whether to read "zero" in the hundreds place
 * @returns an array of words
 */
export function readThreeDigits(
	config: ReadingConfig,
	a: Digit,
	b: Digit,
	c: Digit,
	readZeroHundred: boolean
): string[] {
	const output: string[] = []
	const hasHundred = a !== 0 || readZeroHundred
	if (hasHundred) {
		output.push(config.digits[a], config.hundredText)
	}
	if (hasHundred && b === 0) {
		if (c === 0) {
			return output
		}
		output.push(config.oddText)
	}
	output.push(...readLastTwoDigits(config, b, c))
	return output
}

/**
 * Remove thousands separators from the number string.
 *
 * @param config the reading configuration
 * @param number the number string
 * @returns the number string without thousands separators
 */
export function removeThousandsSeparators(config: ReadingConfig, number: string): string {
	const regex = new RegExp(config.thousandSign, 'g')
	return number.replace(regex, '')
}

/**
 * Remove redundant zeros from the number string from both ends.
 *
 * @param config the reading configuration
 * @param number the number string
 * @returns the number string without redundant zeros from both ends
 */
export function trimRedundantZeros(config: ReadingConfig, number: string): string {
	return number.includes(config.pointSign)
		? trimLeft(trimRight(number, ReadingConfig.FILLED_DIGIT), ReadingConfig.FILLED_DIGIT)
		: trimLeft(number, ReadingConfig.FILLED_DIGIT)
}

/**
 * Add leading zeros to the number string so its length is a multiple of the period size.
 *
 * @param number the number string
 * @returns the number string with leading zeros added
 */
export function addLeadingZerosToFitPeriod(number: string): string {
	const newLength = Math.ceil(number.length / ReadingConfig.PERIOD_SIZE) * ReadingConfig.PERIOD_SIZE
	return number.padStart(newLength, ReadingConfig.FILLED_DIGIT)
}

/**
 * Group the digits in the integral part into periods of three digits each.
 *
 * @param digits the digits in the integral part
 * @returns an array of periods
 */
export function zipIntegralPeriods(digits: Digit[]): Period[] {
	const output: Period[] = []
	const periodCount = Math.ceil(digits.length / ReadingConfig.PERIOD_SIZE)
	for (let i = 0; i < periodCount; i++) {
		const [a, b, c] = digits.slice(
			i * ReadingConfig.PERIOD_SIZE,
			(i + 1) * ReadingConfig.PERIOD_SIZE
		)
		output.push([a, b, c])
	}
	return output
}

/**
 * Parse the number string into a number data.
 *
 * @param config the reading configuration
 * @param number the number string
 * @returns a parsed number data
 * @throws InvalidNumberError if the number string is invalid
 */
export function parseNumberData(config: ReadingConfig, number: string): NumberData {
	let numberString = removeThousandsSeparators(config, number)

	const isNegative = numberString.startsWith(config.negativeSign)
	numberString = isNegative ? numberString.substring(config.negativeSign.length) : numberString
	numberString = trimRedundantZeros(config, numberString)

	const pointPos = numberString.indexOf(config.pointSign)
	let integralString = pointPos === -1 ? numberString : numberString.substring(0, pointPos)
	const fractionalString = pointPos === -1 ? '' : numberString.substring(pointPos + 1)
	integralString = addLeadingZerosToFitPeriod(integralString)

	const integralDigits = splitToDigits(integralString)
	const fractionalDigits = splitToDigits(fractionalString)
	if (integralDigits === null) {
		throw new InvalidNumberError('Invalid integral part')
	}
	if (fractionalDigits === null) {
		throw new InvalidNumberError('Invalid fractional part')
	}

	const integralPart = zipIntegralPeriods(integralDigits)
	if (integralPart.length === 0) {
		integralPart.push([0, 0, 0])
	}
	const fractionalPart = fractionalDigits
	return { isNegative, integralPart, fractionalPart }
}

/**
 * Read the periods in the integral part of a number.
 *
 * @param config the reading configuration
 * @param periods the periods in the integral part
 * @returns an array of words
 */
export function readIntegralPart(config: ReadingConfig, periods: Period[]): string[] {
	const output: string[] = []
	for (const [index, period] of periods.entries()) {
		const [a, b, c] = period
		const isSinglePeriod = periods.length === 1
		const reverseIndex = periods.length - 1 - index
		const periodLimit = config.units.length - 1
		if (a !== 0 || b !== 0 || c !== 0 || isSinglePeriod) {
			const isFirstPeriod = index === 0
			output.push(
				...readThreeDigits(config, a, b, c, !isFirstPeriod),
				...config.units[reverseIndex % periodLimit]
			)
		}
		if (reverseIndex % periodLimit === 0 && reverseIndex !== 0) {
			output.push(...config.units[periodLimit])
		}
	}
	return output
}

/**
 * Read the digits in the fractional part of a number.
 *
 * @param config the reading configuration
 * @param digits the digits in the fractional part
 * @returns an array of words
 */
export function readFractionalPart(config: ReadingConfig, digits: Digit[]): string[] {
	const output: string[] = []
	switch (digits.length) {
		case 2: {
			const [b, c] = digits
			if (b === 0 && c !== 0) {
				output.push(config.digits[b])
			}
			output.push(...readLastTwoDigits(config, b, c))
			break
		}
		case 3: {
			const [a, b, c] = digits
			output.push(...readThreeDigits(config, a, b, c, true))
			break
		}
		default: {
			for (const digit of digits) {
				output.push(config.digits[digit])
			}
			break
		}
	}
	return output
}

/**
 * Read the parsed number data.
 *
 * @param config the reading configuration
 * @param numberData the parsed number data
 * @returns a string representation of the number
 */
export function readNumber(config: ReadingConfig, numberData: NumberData): string {
	const output: string[] = []
	output.push(...readIntegralPart(config, numberData.integralPart))
	if (numberData.fractionalPart.length !== 0) {
		output.push(config.pointText, ...readFractionalPart(config, numberData.fractionalPart))
	}
	if (numberData.isNegative) {
		output.unshift(config.negativeText)
	}
	output.push(...config.unit)
	return output.filter((value) => value !== '').join(config.separator)
}

/**
 * Validate, parse, and read the input number.
 *
 * @param number the input number
 * @param config the reading configuration
 * @returns a string representation of the number
 */
export function doReadNumber(
	number: InputNumber,
	config: ReadingConfig = new ReadingConfig()
): string {
	const validatedNumber = validateNumber(number)
	const numberData = parseNumberData(config, validatedNumber)
	return readNumber(config, numberData)
}
