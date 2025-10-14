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
        '페이지나 레이아웃 컴포넌트는 반드시 `export default`로 내보내야 합니다.',

      nameOfPageOrLayoutComponentShouldHaveSuffix:
        '페이지나 레이아웃 컴포넌트의 이름은 반드시 `Page`나 `Layout`으로 끝나야 합니다.',
      pathParamsShouldExist:
        '경로 변수를 사용할 수 있을 경우 `params`는 반드시 존재해야 합니다.',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'required 페이지나 레이아웃 컴포넌트는 반드시 export default로 내보내야 합니다.',
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
    const onlyLocale = pathParams.length === 1 && pathParams[0] === '[locale]'
    // locale 만 있을 경우 무시합니다.

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
        // 소스코드가 비어있으면 자동생성
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
