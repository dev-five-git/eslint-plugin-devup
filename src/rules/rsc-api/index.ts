import { Rule } from 'eslint'

export const rscApi: Rule.RuleModule = {
  meta: {
    schema: [],
    messages: {
      apiShouldBeCached:
        '`{{ api }}`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'required 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
      recommended: true,
    },
  },
  create(context) {
    let isServer = true
    let serverComponent = false
    let depth = 0
    return {
      ExpressionStatement(node) {
        // 프로그램에 바로 선언된 ExpressionStatement 이라면
        if (node.parent.type !== 'Program' || !isServer) return
        isServer = !('directive' in node && node.directive === 'use client')
      },
      FunctionDeclaration(node) {
        if (!isServer) return
        depth++
        if (depth !== 1) return
        if (
          node.parent.type === 'ExportNamedDeclaration' &&
          node.id.name === 'generateMetadata'
        ) {
          serverComponent = true
          return
        }
        if (node.async && !node.generator) {
          serverComponent = true
          return
        }
      },
      'FunctionDeclaration:exit'() {
        if (!isServer) return
        depth--
        if (depth === 0) serverComponent = false
      },
      ArrowFunctionExpression(node) {
        if (!isServer) return
        depth++

        if (depth !== 1) return
        if (node.async && !node.generator) {
          serverComponent = true
          return
        }
      },
      'ArrowFunctionExpression:exit'() {
        if (!isServer) return
        depth--
        if (depth === 0) serverComponent = false
      },
      FunctionExpression(node) {
        if (!isServer) return
        depth++

        if (node.async && !node.generator) {
          serverComponent = true
          return
        }
      },
      'FunctionExpression:exit'() {
        if (!isServer) return
        depth--
        if (depth === 0) serverComponent = false
      },
      CallExpression(node) {
        if (!isServer || depth !== 1 || !serverComponent) return
        if (
          node.callee.type !== 'Identifier' ||
          (node.callee.name !== 'getList' &&
            node.callee.name !== 'getOne' &&
            node.callee.name !== 'getSingle' &&
            node.callee.name !== 'custom')
        )
          return
        // 서버 컴포넌트 내에서 바로 호출하고 있는지 확인합니다.
        const apiName = node.callee.name
        context.report({
          node,
          messageId: 'apiShouldBeCached',
          data: { api: node.callee.name },
          fix(fixer) {
            return [
              fixer.replaceText(
                node.callee,
                'cache' + apiName[0].toUpperCase() + apiName.slice(1),
              ),
            ]
          },
        })
      },
    }
  },
}
