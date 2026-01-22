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
import type { Rule } from 'eslint'
// @ts-ignore
import eslintPluginPrettier from 'eslint-plugin-prettier'

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
 * Build wrapped devup-ui rules with "ui/" prefix
 */
function buildDevupUiRules(): Record<string, Rule.RuleModule> {
  const rules: Record<string, Rule.RuleModule> = {}
  for (const [name, rule] of Object.entries(devupUiRules)) {
    const kebabName = toKebabCase(name)
    rules[`ui/${kebabName}`] = wrapRuleForOxlint(
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
    ...buildDevupUiRules(),
  },
}

export default plugin
