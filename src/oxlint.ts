/**
 * Oxlint plugin for devup
 * Exports the same rules as ESLint plugin for oxlint JS plugins
 *
 * Usage in .oxlintrc.json:
 * {
 *   "extends": ["eslint-plugin-devup/oxlintrc"]
 * }
 */

// @ts-ignore - named export for rules
import { rules as devupUiRules } from '@devup-ui/eslint-plugin'
// @ts-ignore
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query'
import type { Rule } from 'eslint'
import { rules as mdxRules } from 'eslint-plugin-mdx'
import eslintPluginPrettier from 'eslint-plugin-prettier'
// @ts-ignore
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
// @ts-ignore
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

import { appPage, component, componentInterface } from './rules'

/**
 * Wrap a rule to handle unsupported context properties in oxlint
 * (e.g., context.parserPath throws in oxlint)
 */
function wrapRuleForOxlint(rule: Rule.RuleModule): Rule.RuleModule {
  return {
    ...rule,
    create(context) {
      const proxiedContext = new Proxy(context, {
        get(target, prop) {
          // Return undefined for unsupported properties instead of throwing
          if (prop === 'parserPath') {
            return undefined
          }
          // Pass through all other properties directly to preserve Proxy invariants
          // (non-configurable properties must return their actual value)
          return target[prop as keyof typeof target]
        },
      })
      return rule.create(proxiedContext)
    },
  }
}

/**
 * Convert camelCase to kebab-case
 * e.g., "cssUtilsLiteralOnly" -> "css-utils-literal-only"
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Build wrapped rules from external plugin with prefix
 */
function buildWrappedRules(
  externalRules: Record<string, unknown>,
  prefix: string,
): Record<string, Rule.RuleModule> {
  const rules: Record<string, Rule.RuleModule> = {}
  for (const [name, rule] of Object.entries(externalRules)) {
    const kebabName = toKebabCase(name)
    rules[`${prefix}/${kebabName}`] = wrapRuleForOxlint(
      rule as unknown as Rule.RuleModule,
    )
  }
  return rules
}

// ============================================================================
// Plugin Export
// ============================================================================

const plugin = {
  meta: {
    name: 'devup',
  },
  rules: {
    // devup custom rules
    'app-page': appPage,
    component: component,
    'component-interface': componentInterface,

    // prettier (wrapped for oxlint compatibility)
    prettier: wrapRuleForOxlint(eslintPluginPrettier.rules!.prettier),

    // @devup-ui/eslint-plugin rules (auto-wrapped for oxlint compatibility)
    ...buildWrappedRules(devupUiRules, 'ui'),

    // eslint-plugin-mdx rules (auto-wrapped for oxlint compatibility)
    ...buildWrappedRules(mdxRules, 'mdx'),

    // eslint-plugin-simple-import-sort rules (auto-wrapped for oxlint compatibility)
    ...buildWrappedRules(simpleImportSortPlugin.rules!, 'simple-import-sort'),

    // eslint-plugin-unused-imports rules (auto-wrapped for oxlint compatibility)
    ...buildWrappedRules(unusedImportsPlugin.rules!, 'unused-imports'),

    // @tanstack/eslint-plugin-query rules (auto-wrapped for oxlint compatibility)
    ...buildWrappedRules(tanstackQueryPlugin.rules!, 'query'),
  },
}

export default plugin
