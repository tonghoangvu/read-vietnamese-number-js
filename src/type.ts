export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Period = [Digit, Digit, Digit]
export type InputNumber = string | bigint

/**
 * The base error class for all errors in the library.
 */
export class ReadVietnameseNumberError extends Error {}

/**
 * The error class used when the input number is invalid.
 */
export class InvalidNumberError extends ReadVietnameseNumberError {}

export interface NumberData {
	isNegative: boolean
	integralPart: Period[]
	fractionalPart: Digit[]
}

/**
 * The reading configuration class containing default options for reading numbers.
 */
export class ReadingConfig {
	public static readonly PERIOD_SIZE = 3
	public static readonly FILLED_DIGIT = '0'

	// Input parsing options
	public negativeSign = '-'
	public pointSign = '.' // point/comma
	public thousandSign = ',' // comma/point/space

	// Output building options
	public separator = ' ' // space/newline/tab
	public unit = ['đơn', 'vị'] // đơn vị/đồng
	public units = [[], ['nghìn'], ['triệu'], ['tỉ']] // nghìn/ngàn, tỉ/tỷ
	public digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'] // bảy/bẩy
	public negativeText = 'âm' // âm/trừ
	public pointText = 'chấm' // chấm/phẩy
	public oddText = 'lẻ' // lẻ/linh
	public tenText = 'mười'
	public hundredText = 'trăm'
	public oneToneText = 'mốt'
	public fourToneText = 'tư' // tư/bốn
	public fiveToneText = 'lăm'
	public tenToneText = 'mươi'

	// Conditional options
	public skipTenTone = false
}
