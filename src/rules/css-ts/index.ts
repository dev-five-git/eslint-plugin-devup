import { ESLintUtils } from '@typescript-eslint/utils'
function toPascal(str: string) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

export const cssTs = createRule({
  name: 'css-ts',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      cssTsFileShouldExportStyle: '`css.ts` 파일은 `Style`을 내보내야 합니다.',
      styleInCssTsShouldHaveStylePostfix:
        'css.ts 에 정의된 스타일은 반드시 `Style`로 끝나야 합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'required 스타일 파일은 `Style`을 내보내야 합니다.',
    },
  },
  create(context) {
    const filename = context.physicalFilename
    if (!filename.endsWith('.css.ts')) return {}
    let hasExport = false
    let hasCssImport = false
    const targetComponentRegex = /([^/\\]+)[/\\]([^/\\]+)\.css\.ts$/i.exec(
      filename,
    )!
    let targetComponentName
    const isIndex = targetComponentRegex[2].startsWith('index')

    if (isIndex) targetComponentName = toPascal(targetComponentRegex[1])
    else targetComponentName = toPascal(targetComponentRegex[2])
    return {
      ExportNamedDeclaration(node) {
        hasExport = true
        if (node.declaration?.type === 'VariableDeclaration') {
          for (const specifier of node.declaration.declarations) {
            if (
              specifier.id.type === 'Identifier' &&
              specifier.init?.type === 'CallExpression' &&
              specifier.init.callee.type === 'Identifier' &&
              specifier.init.callee.name === 'css' &&
              !specifier.id.name.endsWith('Style')
            ) {
              const target = specifier.id.name
              context.report({
                node: specifier.id,
                messageId: 'styleInCssTsShouldHaveStylePostfix',
                fix(fixer) {
                  return fixer.replaceText(specifier.id, `${target}Style`)
                },
              })
            }
          }
        }
      },
      ImportDeclaration(node) {
        if (node.source.value === '@devup/css') {
          node.specifiers.forEach((specifier) => {
            if (specifier.local.name === 'css') {
              hasCssImport = true
            }
          })
        }
      },
      'Program:exit'(program) {
        if (!hasExport)
          context.report({
            node: program,
            messageId: 'cssTsFileShouldExportStyle',
            fix(fixer) {
              const fix = []
              if (!hasCssImport)
                fix.push(
                  fixer.insertTextBefore(
                    context.sourceCode.ast,
                    `import {css} from "@devup/css"\n`,
                  ),
                )
              fix.push(
                fixer.insertTextAfter(
                  context.sourceCode.ast,
                  `${context.sourceCode.text.trim().length ? '\n' : ''}export const ${targetComponentName}Style=css({})`,
                ),
              )

              return fix
            },
          })
      },
    }
  },
})
