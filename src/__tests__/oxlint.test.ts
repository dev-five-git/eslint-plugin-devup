import { describe, expect, it } from 'bun:test'
import type { Rule } from 'eslint'

import packageJson from '../../package.json'
import oxlintPlugin from '../oxlint'
import oxlintConfig, { createOxlintConfig } from '../oxlint-config'

type MinimalRuleContext = Parameters<Rule.RuleModule['create']>[0]

describe('oxlint config', () => {
  it('should only enable devup rules exported by the oxlint plugin', () => {
    const exportedRules = oxlintPlugin.rules as Record<string, unknown>
    const configuredRules = Object.keys(oxlintConfig.rules)
      .filter((ruleName) => ruleName.startsWith('devup/'))
      .map((ruleName) => ruleName.replace('devup/', ''))

    for (const ruleName of configuredRules) {
      expect(exportedRules[ruleName]).toBeDefined()
    }
  })

  it('should enable every devup rule exported by the oxlint plugin', () => {
    const exportedRuleNames = Object.keys(oxlintPlugin.rules)
    const configuredRules = oxlintConfig.rules as Record<string, unknown>

    for (const ruleName of exportedRuleNames) {
      expect(configuredRules[`devup/${ruleName}`]).toBeDefined()
    }
  })

  it('should publish the dynamic oxlint config entry point', () => {
    expect(packageJson.exports['./oxlint-config']).toBeDefined()
  })

  it('should configure exported devup rules that are not in known groups', () => {
    const config = createOxlintConfig({
      additionalRuleNames: ['future-plugin/z-rule', 'future-plugin/a-rule'],
    })

    expect(config.rules['devup/future-plugin/a-rule']).toBe('error')
    expect(config.rules['devup/future-plugin/z-rule']).toBe('error')
  })
})

describe('oxlint plugin', () => {
  it('should wrap ESLint rules with an oxlint-compatible parserPath', () => {
    const rule = oxlintPlugin.rules.prettier
    const listener = rule.create({
      filename: 'fixture.ts',
      options: [{}, {}],
      physicalFilename: 'fixture.ts',
      sourceCode: {
        ast: { type: 'Program' },
        text: '',
      },
    } as MinimalRuleContext)

    expect(listener).toBeDefined()
  })
})
