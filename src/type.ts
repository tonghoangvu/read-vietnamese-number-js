export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Period = [Digit, Digit, Digit]
export type InputNumber = string | bigint

export interface NumberData {
	isNegative: boolean
	integralPart: Period[]
	fractionalPart: Digit[]
}

/**
 * The base error class for all errors in the library.
 */
export class ReadVietnameseNumberError extends Error {}

/**
 * The error class used when the input number is invalid.
 */
export class InvalidNumberError extends ReadVietnameseNumberError {}

/**
 * The reading configuration class containing default options for reading numbers.
 */
export class ReadingConfig {
	static readonly PERIOD_SIZE = 3
	static readonly FILLED_DIGIT = '0'

	// Input parsing options
	negativeSign = '-'
	pointSign = '.' // point/comma
	thousandSign = ',' // comma/point/space

	// Output building options
	separator = ' ' // space/newline/tab
	unit = ['đơn', 'vị'] // đơn vị/đồng
	units = [[], ['nghìn'], ['triệu'], ['tỉ']] // nghìn/ngàn, tỉ/tỷ
	digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'] // bảy/bẩy
	negativeText = 'âm' // âm/trừ
	pointText = 'chấm' // chấm/phẩy
	oddText = 'lẻ' // lẻ/linh
	tenText = 'mười'
	hundredText = 'trăm'
	oneToneText = 'mốt'
	fourToneText = 'tư' // tư/bốn
	fiveToneText = 'lăm'
	tenToneText = 'mươi'

	// Conditional options
	skipTenTone = false
}
