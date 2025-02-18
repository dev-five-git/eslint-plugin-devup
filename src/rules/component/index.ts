import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
function toPascal(str: string) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

export const component = createRule({
  name: 'component',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      componentNameShouldBeFollowDirectoryStructure:
        '컴포넌트 이름은 디렉토리명 혹은 파일명을 따라야 합니다.',
      componentFileShouldExportComponent:
        '컴포넌트 파일은 컴포넌트를 내보내야 합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'required 컴포넌트 이름은 디렉터리 혹은 파일명을 따라야 합니다.',
    },
  },
  create(context) {
    const filename = context.physicalFilename

    if (
      !/(src[/\\])?(app[/\\](?!.*[\\/]?(page|layout|404)\.[jt]sx$)|components[/\\]).*\.[jt]sx$/.test(
        filename,
      ) ||
      /[\\/]utils[\\/]|[\\/](__)?tests?(__)?[\\/]|\.(test|css|stories)\.[jt]sx$/.test(
        filename,
      )
    )
      return {}
    const targetComponentRegex = /([^/\\]+)[/\\]([^/\\]+)\.[jt]sx$/i.exec(
      filename,
    )!
    let targetComponentName
    const isIndex = targetComponentRegex[2].startsWith('index')

    if (isIndex) targetComponentName = toPascal(targetComponentRegex[1])
    else targetComponentName = toPascal(targetComponentRegex[2])
    const exportFunc: TSESTree.Node[] = []
    let ok = false

    return {
      ExportNamedDeclaration(namedExport) {
        if (ok) return
        if (namedExport.specifiers.length && isIndex) {
          // export 용
          ok = true
          return
        }
        const declaration = namedExport.declaration
        if (!declaration) return
        if (declaration.type === 'FunctionDeclaration') {
          // export 아래기 때문에 반드시 id가 있습니다.
          if (targetComponentName === declaration.id!.name) {
            ok = true
            return
          }
          exportFunc.push(declaration.id!)
        }
        if (declaration.type === 'VariableDeclaration') {
          for (const el of declaration.declarations) {
            if (el.id.type !== 'Identifier') continue
            if (el.id.name === targetComponentName) {
              ok = true
              return
            }
            if (
              el.init?.type === 'ArrowFunctionExpression' ||
              el.init?.type === 'FunctionExpression'
            )
              exportFunc.push(el.id)
          }
        }
      },
      'Program:exit'(program) {
        if (ok) return
        if (exportFunc.length) {
          for (const exported of exportFunc) {
            context.report({
              node: exported,
              messageId: 'componentNameShouldBeFollowDirectoryStructure',
              fix(fixer) {
                return fixer.replaceText(exported, targetComponentName)
              },
            })
          }
          return
        }
        context.report({
          node: program,
          messageId: 'componentFileShouldExportComponent',
          fix(fixer) {
            return fixer.insertTextAfter(
              context.sourceCode.ast,
              `${context.sourceCode.text.trim().length ? '\n' : ''}export function ${targetComponentName}(){return <></>}`,
            )
          },
        })
      },
    }
  },
})
