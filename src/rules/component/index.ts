import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { relative } from 'path'

/**
 * 문자열을 파스칼 케이스로 변환합니다.
 * @param str 변환할 문자열
 * @returns 파스칼 케이스로 변환된 문자열
 */
function toPascal(str: string) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

// 검사 제외 파일 패턴
const EXCLUDE_PATTERNS = [
  /[\\/]utils[\\/]/,
  /[\\/](__)?tests?(__)?[\\/]/,
  /\.(test|css|stories)\.[jt]sx$/,
]

// 검사 대상 파일 패턴
const INCLUDE_PATTERNS = [
  /(src[/\\])?(app[/\\](?!.*[\\/]?(page|layout|404)\.[jt]sx$)|components[/\\]).*\.[jt]sx$/,
]

export const component = createRule({
  name: 'component',
  defaultOptions: [],
  meta: {
    schema: [],
    messages: {
      componentNameShouldBeFollowDirectoryStructure:
        '컴포넌트 이름은 디렉토리명 혹은 파일명을 따라야 합니다.',
      componentFileShouldExportComponent:
        '컴포넌트 파일은 컴포넌트를 내보내야 합니다. (컴포넌트명: {targetComponentName})',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'required 컴포넌트 이름은 디렉터리 혹은 파일명을 따라야 합니다.',
    },
  },
  create(context) {
    const filename = relative(context.cwd, context.physicalFilename)

    // 검사 대상이 아닌 파일은 빈 객체 반환
    const isIncluded = INCLUDE_PATTERNS.some((pattern) =>
      pattern.test(filename),
    )
    const isExcluded = EXCLUDE_PATTERNS.some((pattern) =>
      pattern.test(filename),
    )

    if (!isIncluded || isExcluded) {
      return {}
    }

    // 파일 경로에서 컴포넌트 이름 추출
    const targetComponentRegex = /([^/\\]+)[/\\]([^/\\]+)\.[jt]sx$/i.exec(
      filename,
    )!

    const isIndex = targetComponentRegex[2].startsWith('index')
    const targetComponentName = isIndex
      ? toPascal(targetComponentRegex[1])
      : toPascal(targetComponentRegex[2])

    const exportFunc: TSESTree.Node[] = []
    let ok = false

    /**
     * 선언이 타겟 컴포넌트 이름과 일치하는지 확인
     * @param name 선언된 이름
     * @returns 일치 여부
     */
    const isTargetComponent = (name: string) => name === targetComponentName

    return {
      ExportDefaultDeclaration() {
        ok = true
      },
      ExportNamedDeclaration(namedExport) {
        if (ok) return

        // index 파일에서 export 구문이 있는 경우 검사 통과
        if (namedExport.specifiers.length && isIndex) {
          ok = true
          return
        }

        const declaration = namedExport.declaration
        if (!declaration) return

        // 함수 선언 검사
        if (declaration.type === 'FunctionDeclaration' && declaration.id) {
          if (isTargetComponent(declaration.id.name)) {
            ok = true
            return
          }
          exportFunc.push(declaration.id)
        }

        // 클래스 선언 검사
        if (declaration.type === 'ClassDeclaration' && declaration.id) {
          if (isTargetComponent(declaration.id.name)) {
            ok = true
            return
          }
        }

        // 변수 선언 검사 (화살표 함수, 함수 표현식 등)
        if (declaration.type === 'VariableDeclaration') {
          for (const el of declaration.declarations) {
            if (el.id.type !== 'Identifier') continue

            if (isTargetComponent(el.id.name)) {
              ok = true
              return
            }

            const isComponentFunction =
              el.init?.type === 'ArrowFunctionExpression' ||
              el.init?.type === 'FunctionExpression'

            if (isComponentFunction) {
              exportFunc.push(el.id)
            }
          }
        }
      },
      'Program:exit'(program) {
        if (ok) return

        // 컴포넌트 이름이 일치하지 않는 경우 수정 제안
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

        // 컴포넌트를 내보내지 않는 경우 기본 컴포넌트 추가 제안
        context.report({
          node: program,
          messageId: 'componentFileShouldExportComponent',
          data: {
            targetComponentName,
          },
          fix(fixer) {
            const hasContent = context.sourceCode.text.trim().length > 0
            const newline = hasContent ? '\n' : ''
            return fixer.insertTextAfter(
              context.sourceCode.ast,
              `${newline}export function ${targetComponentName}(){return <></>}`,
            )
          },
        })
      },
    }
  },
})
