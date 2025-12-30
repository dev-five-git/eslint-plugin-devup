import { describe, expect, it } from 'bun:test'

import * as index from '../index'

describe('export index', () => {
  it('should export rules object', () => {
    expect(index.rules).toBeDefined()
    expect(typeof index.rules).toBe('object')
  })

  it('should export configs with recommended', () => {
    expect(index.configs).toBeDefined()
    expect(index.configs.recommended).toBeDefined()
  })

  it('should export default with configs', () => {
    expect(index.default).toBeDefined()
    expect(index.default.configs).toBeDefined()
    expect(index.default.configs.recommended).toBeDefined()
  })
})
