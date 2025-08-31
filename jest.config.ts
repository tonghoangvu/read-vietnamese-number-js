import type { Config } from 'jest'

const config: Config = {
	preset: 'ts-jest/presets/default-esm',
	collectCoverageFrom: ['./src/**'],
	coveragePathIgnorePatterns: ['./src/index.ts'],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	// https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: 'tsconfig.jest.json',
			},
		],
	},
}

export default config
