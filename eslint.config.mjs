import eslintPlugin from 'eslint-plugin-eslint-plugin'

import { configs } from './dist/index.js'
export default [
  ...configs.recommended,
  {
    ...eslintPlugin.configs['flat/recommended'],
    files: ['src/**'],
  },
]
