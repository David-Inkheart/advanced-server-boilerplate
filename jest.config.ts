import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test|spec).ts'],
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  globalSetup: './global-setup.js',
  // globalTeardown: './global-teardown.js',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  resetMocks: true,
};

export default config;