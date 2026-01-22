import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

const PASCAL_CASE_PATTERN = /^[A-Z]/
const EXPORTABLE_PARENT_TYPES = new Set([
  'Program',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
])

export const componentInterface = createRule({
  name: 'component-interface',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern:
        'Component `props` must have type annotation when empty object pattern.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'require type annotation for component props when empty object pattern.',
    },
  },
  create(context) {
    if (!context.physicalFilename.endsWith('.tsx')) return {}

    return {
      FunctionDeclaration(node) {
        const funcName = node.id?.name
        if (!funcName || !PASCAL_CASE_PATTERN.test(funcName)) return

        const firstParam = node.params[0]
        if (
          node.params.length !== 1 ||
          firstParam.type !== 'ObjectPattern' ||
          firstParam.typeAnnotation ||
          firstParam.properties.length !== 0 ||
          !EXPORTABLE_PARENT_TYPES.has(node.parent.type)
        ) {
          return
        }

        const insertTarget = node.parent.type === 'Program' ? node : node.parent

        context.report({
          node,
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
          fix: (fixer) => [
            fixer.insertTextAfter(firstParam, `:${funcName}Props`),
            fixer.insertTextBefore(
              insertTarget,
              `interface ${funcName}Props{}\n`,
            ),
          ],
        })
      },
    }
  },
})
