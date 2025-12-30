import { ESLintUtils } from '@typescript-eslint/utils'
import { relative } from 'path'

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

export const appPage = createRule({
  name: 'app-page',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      pageOrLayoutComponentShouldDefaultExport:
        'Page or layout component must be exported with `export default`.',
      nameOfPageOrLayoutComponentShouldHaveSuffix:
        'Page or layout component name must end with `Page` or `Layout`.',
      pathParamsShouldExist:
        '`params` must exist when path parameters are available.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Require page or layout component to be exported with export default.',
    },
  },
  create(context) {
    const filename = relative(context.cwd, context.physicalFilename)

    if (!/src[/\\]app[/\\]/.test(filename)) return {}
    const type = /page\.[j|t]sx?$/.test(filename)
      ? 'page'
      : /layout\.[j|t]sx?$/.test(filename)
        ? 'layout'
        : /404\.[j|t]sx?$/.test(filename)
          ? '404'
          : 'component'
    if (type === 'component') return {}

    const functionSuffix = type === 'layout' ? 'Layout' : 'Page'
    const pathParams = filename.match(/\[.*?]/g) ?? []
    // Ignore when only locale param exists
    const onlyLocale = pathParams.length === 1 && pathParams[0] === '[locale]'

    let ok = false
    return {
      ExportDefaultDeclaration(defaultExport) {
        ok = true
        const declaration = defaultExport.declaration
        if (declaration.type !== 'FunctionDeclaration') return
        if (
          declaration.id?.name &&
          !declaration.id.name.endsWith(functionSuffix)
        ) {
          const func = declaration.id
          context.report({
            node: func,
            messageId: 'nameOfPageOrLayoutComponentShouldHaveSuffix',
            fix(fixer) {
              return fixer.replaceText(func, func.name + functionSuffix)
            },
          })
        }
        if (
          declaration.id &&
          pathParams.length &&
          declaration.params.length === 0 &&
          !onlyLocale
        ) {
          context.report({
            node: declaration,
            messageId: 'pathParamsShouldExist',
            fix(fixer) {
              return fixer.replaceTextRange(
                [
                  declaration.id!.range[1],
                  declaration.returnType
                    ? declaration.returnType.range[0]
                    : declaration.body.range[0],
                ],
                `({params}:{params:Promise<{${pathParams
                  .map((param) => `${param.slice(1, -1)}:string`)
                  .join(';')}}>})`,
              )
            },
          })
        }
        return
      },
      'Program:exit'(program) {
        // Auto-generate if source code is empty
        if (ok) return
        context.report({
          node: program,
          messageId: 'pageOrLayoutComponentShouldDefaultExport',
          fix(fixer) {
            return fixer.insertTextAfter(
              program,
              `${context.sourceCode.text.trim().length ? '\n' : ''}export default function ` +
                (type === '404' ? 'NotFoundPage' : functionSuffix) +
                `(${
                  pathParams.length
                    ? `{params}:{params:Promise<{${pathParams
                        .map((param) => `${param.slice(1, -1)}:string`)
                        .join(';')}}>}`
                    : ''
                }){return <></>}`,
            )
          },
        })
      },
    }
  },
})
