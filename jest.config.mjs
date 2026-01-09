// jest.config.mjs
export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.mjs$': '$1', // 支援 .mjs import
  },
  transform: {}, // ESM 不需要 babel/ts-jest 轉譯
  testMatch: ['**/?(*.)+(spec|test).mjs?(x)'],
  verbose: true,
}
