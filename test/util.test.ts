/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from '@jest/globals'
import { splitToDigits, trimLeft, trimRight, validateNumber } from '../src/util.js'

describe('Trim left function', () => {
	it('Should return empty', () => {
		expect(trimLeft('', '')).toBe('')
		expect(trimLeft('', 'x')).toBe('')
		expect(trimLeft('', 'xy')).toBe('')
	})

	it('Should return itself', () => {
		expect(trimLeft('abc', '')).toBe('abc')
		expect(trimLeft('abc', 'x')).toBe('abc')
		expect(trimLeft('abc', 'xy')).toBe('abc')
	})

	it('Should trim all leading specified characters', () => {
		expect(trimLeft('abc', 'a')).toBe('bc')
		expect(trimLeft('abc', 'ab')).toBe('bc')
		expect(trimLeft('aaababc', 'a')).toBe('babc')
	})
})

describe('Trim right function', () => {
	it('Should return empty', () => {
		expect(trimRight('', '')).toBe('')
		expect(trimRight('', 'x')).toBe('')
		expect(trimRight('', 'xy')).toBe('')
	})

	it('Should return itself', () => {
		expect(trimRight('abc', '')).toBe('abc')
		expect(trimRight('abc', 'x')).toBe('abc')
		expect(trimRight('abc', 'xy')).toBe('abc')
		expect(trimRight('abc', 'bc')).toBe('abc')
	})

	it('Should trim all trailing specified characters', () => {
		expect(trimRight('abc', 'c')).toBe('ab')
		expect(trimRight('abc', 'cb')).toBe('ab')
		expect(trimRight('abccccc', 'c')).toBe('ab')
	})
})

describe('Split to digits function', () => {
	it('Should return empty array', () => {
		expect(splitToDigits('')).toEqual([])
	})

	it('Should return array of digits', () => {
		expect(splitToDigits('123')).toEqual([1, 2, 3])
		expect(splitToDigits('012333')).toEqual([0, 1, 2, 3, 3, 3])
	})

	it('Should return null', () => {
		expect(splitToDigits('123x')).toBeNull()
		expect(splitToDigits('12 34x5')).toBeNull()
	})
})

describe('Validate number function', () => {
	it('Should return itself', () => {
		expect(validateNumber('-12345.67890')).toBe('-12345.67890')
	})

	it('Should return as string', () => {
		expect(validateNumber(-12345n)).toBe('-12345')
		expect(validateNumber(11111111111111111111112345n)).toBe('11111111111111111111112345')
	})

	it('Should throw TypeError', () => {
		expect(() => validateNumber(1 as any as string)).toThrow(TypeError)
		expect(() => validateNumber({} as string)).toThrow(TypeError)
		expect(() => validateNumber(null as any as string)).toThrow(TypeError)
		expect(() => validateNumber(undefined as any as string)).toThrow(TypeError)
		expect(() => validateNumber(false as any as bigint)).toThrow(TypeError)
		expect(() => validateNumber(Symbol('test') as any as bigint)).toThrow(TypeError)
		expect(() => validateNumber((() => 'test') as any as bigint)).toThrow(TypeError)
	})
})
