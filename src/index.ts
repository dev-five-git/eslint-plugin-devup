import type { Linter } from 'eslint'

import recommended from './configs/recommended'
export * as rules from './rules'

export const configs: { recommended: Linter.Config[] } = {
  recommended,
} as const

export default {
  configs,
}
