import { describe, expect, it } from 'bun:test'

import recommended from '../recommended'

describe('recommended', () => {
  it('should export recommended config as array', () => {
    expect(Array.isArray(recommended)).toBe(true)
    expect(recommended.length).toBeGreaterThan(0)
  })

  it('should have ignores config', () => {
    const ignoresConfig = recommended.find(
      (config) => 'ignores' in config && !('rules' in config),
    )
    expect(ignoresConfig).toBeDefined()
    expect(ignoresConfig?.ignores).toContain('**/node_modules/')
    expect(ignoresConfig?.ignores).toContain('**/dist/')
  })

  it('should have @devup plugin rules', () => {
    const pluginConfig = recommended.find(
      (config) =>
        config.plugins && '@devup' in (config.plugins as Record<string, any>),
    )
    expect(pluginConfig).toBeDefined()
    expect(pluginConfig?.rules?.['@devup/component']).toBe('error')
    expect(pluginConfig?.rules?.['@devup/app-page']).toBe('error')
    expect(pluginConfig?.rules?.['@devup/component-interface']).toBe('error')
  })
})
