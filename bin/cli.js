#!/usr/bin/env node
/* eslint-disable no-console */
import { ReadingConfig, doReadNumber } from '../dist/esm/index.js'

const number = process.argv[2]
if (number) {
	read(number)
} else {
	console.warn('Please provide a number to read')
}

function read(number) {
	try {
		const config = new ReadingConfig()
		const result = doReadNumber(number, config)
		console.log(result)
	} catch (error) {
		console.error(error.message)
	}
}
