import { describe, expect, it } from 'bun:test'

import * as index from '../index'

describe('export index', () => {
  it('should export component rule', () => {
    expect(index.component).toBeDefined()
    expect(typeof index.component).toBe('object')
  })

  it('should export componentInterface rule', () => {
    expect(index.componentInterface).toBeDefined()
    expect(typeof index.componentInterface).toBe('object')
  })

  it('should export appPage rule', () => {
    expect(index.appPage).toBeDefined()
    expect(typeof index.appPage).toBe('object')
  })
})
