import { ESLintUtils } from '@typescript-eslint/utils'

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

export const componentInterface = createRule({
  name: 'component-interface',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern:
        '컴포넌트의 `props`가 비어있고 타입이 없을 경우 반드시 타입을 명시해야 합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'required type annotation for component props when empty object pattern',
    },
  },
  create(context) {
    const filename = context.physicalFilename

    if (!filename.endsWith('.tsx')) return {}

    return {
      FunctionDeclaration(node) {
        const funcName = node.id?.name

        if (
          funcName &&
          node.params.length === 1 &&
          node.params[0].type === 'ObjectPattern' &&
          !node.params[0].typeAnnotation &&
          node.params[0].properties.length === 0 &&
          (node.parent.type === 'Program' ||
            node.parent.type === 'ExportNamedDeclaration' ||
            node.parent.type === 'ExportDefaultDeclaration') &&
          /^[A-Z]/.test(funcName)
        ) {
          context.report({
            node,
            messageId:
              'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
            fix(fixer) {
              return [
                fixer.insertTextAfter(node.params[0], `:${funcName}Props`),
                // 1줄 전
                fixer.insertTextBefore(
                  node.parent.type === 'Program' ? node : node.parent,
                  `interface ${funcName}Props{}\n`,
                ),
              ]
            },
          })
        }
      },
    }
  },
})
