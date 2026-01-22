import { ESLintUtils } from '@typescript-eslint/utils'
import { relative } from 'path'

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

// Pre-compiled regex patterns
const APP_DIR_PATTERN = /src[/\\]app[/\\]/
const FILE_TYPE_PATTERN = /(page|layout|404)\.[jt]sx?$/
const PATH_PARAMS_PATTERN = /\[.*?]/g

function generateParamsType(pathParams: string[]): string {
  return `{params}:{params:Promise<{${pathParams.map((param) => `${param.slice(1, -1)}:string`).join(';')}}>}`
}

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
        'require page or layout component to be exported with export default',
    },
  },
  create(context) {
    const filename = relative(context.cwd, context.physicalFilename)

    if (!APP_DIR_PATTERN.test(filename)) return {}

    const fileTypeMatch = FILE_TYPE_PATTERN.exec(filename)
    if (!fileTypeMatch) return {}

    const type = fileTypeMatch[1] as 'page' | 'layout' | '404'

    const functionSuffix = type === 'layout' ? 'Layout' : 'Page'
    const pathParams = filename.match(PATH_PARAMS_PATTERN) ?? []
    // Ignore when only locale param exists
    const onlyLocale = pathParams.length === 1 && pathParams[0] === '[locale]'

    const hasPathParams = pathParams.length > 0
    const requiresParams = hasPathParams && !onlyLocale
    const paramsType = hasPathParams ? generateParamsType(pathParams) : ''

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
          context.report({
            node: declaration.id,
            messageId: 'nameOfPageOrLayoutComponentShouldHaveSuffix',
            fix: (fixer) =>
              fixer.replaceText(
                declaration.id!,
                declaration.id!.name + functionSuffix,
              ),
          })
        }

        if (
          declaration.id &&
          requiresParams &&
          declaration.params.length === 0
        ) {
          context.report({
            node: declaration,
            messageId: 'pathParamsShouldExist',
            fix: (fixer) =>
              fixer.replaceTextRange(
                [
                  declaration.id!.range[1],
                  declaration.returnType?.range[0] ?? declaration.body.range[0],
                ],
                `(${paramsType})`,
              ),
          })
        }
      },
      'Program:exit'(program) {
        if (ok) return

        const functionName = type === '404' ? 'NotFoundPage' : functionSuffix
        const prefix = context.sourceCode.text.trim().length ? '\n' : ''

        context.report({
          node: program,
          messageId: 'pageOrLayoutComponentShouldDefaultExport',
          fix: (fixer) =>
            fixer.insertTextAfter(
              program,
              `${prefix}export default function ${functionName}(${paramsType}){return <></>}`,
            ),
        })
      },
    }
  },
})
