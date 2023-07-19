import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test|spec).ts'],
  transform: {
    '^.+\\.[jt]sx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  resetMocks: true,
};

export default config;