import type { Rule } from 'eslint'

export const layout: Rule.RuleModule = {
  meta: {
    schema: [],
    messages: {
      rowChildShouldBeCol: 'Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'enforce Row 컴포넌트의 자식은 Col 컴포넌트만 가능합니다.',
      recommended: true,
    },
  },
  create(context) {
    let colImported = false
    let devupReactImportNode: Omit<
      Rule.Node & {
        type: 'ImportDeclaration'
      },
      'parent'
    > | null = null
    return {
      ImportSpecifier(specifier) {
        if (
          specifier.parent.type === 'ImportDeclaration' &&
          specifier.parent.source.value === '@devup/react'
        ) {
          devupReactImportNode = specifier.parent

          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === 'Col'
          )
            colImported = true
        }
      },
      'ImportDeclaration:exit'(node) {
        if (devupReactImportNode !== null) return
        if (
          node.source.value === '@devup/react' &&
          node.specifiers.length === 0
        )
          devupReactImportNode = node
      },
      JSXElement(node: any) {
        const parent: any = node.parent
        if (
          parent.type !== 'JSXElement' ||
          parent.openingElement.name.name !== 'Row'
        )
          return
        if (node.openingElement.name.name !== 'Col') {
          context.report({
            node: node,
            messageId: 'rowChildShouldBeCol',
            fix(fixer) {
              return [
                ...(colImported
                  ? []
                  : devupReactImportNode
                    ? [
                        devupReactImportNode.specifiers.length === 0
                          ? fixer.replaceText(
                              devupReactImportNode,
                              `import { Col } from '@devup/react';`,
                            )
                          : fixer.insertTextAfter(
                              devupReactImportNode.specifiers[0],
                              ', Col',
                            ),
                      ]
                    : [
                        fixer.insertTextBeforeRange(
                          [0, 0],
                          "import { Col, Row } from '@devup/react';\n",
                        ),
                      ]),
                fixer.insertTextBefore(node, '<Col>'),
                fixer.insertTextAfter(node, '</Col>'),
              ]
            },
          })
        }
      },
    }
  },
}
