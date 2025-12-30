import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { relative } from 'path'

/**
 * Converts a string to PascalCase.
 * @param str The string to convert
 * @returns The PascalCase converted string
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

// File patterns to exclude from checking
const EXCLUDE_PATTERNS = [
  /[\\/]utils[\\/]/,
  /[\\/](__)?tests?(__)?[\\/]/,
  /\.(test|css|stories)\.[jt]sx$/,
]

// File patterns to include for checking
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
        'Component name should follow directory or file name.',
      componentFileShouldExportComponent:
        'Component file should export a component. (Component name: {targetComponentName})',
    },
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Require component name to follow directory or file name.',
    },
  },
  create(context) {
    const filename = relative(context.cwd, context.physicalFilename)

    // Return empty object for files not subject to checking
    const isIncluded = INCLUDE_PATTERNS.some((pattern) =>
      pattern.test(filename),
    )
    const isExcluded = EXCLUDE_PATTERNS.some((pattern) =>
      pattern.test(filename),
    )

    if (!isIncluded || isExcluded) {
      return {}
    }

    // Extract component name from file path
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
     * Check if the declaration matches the target component name
     * @param name The declared name
     * @returns Whether it matches
     */
    const isTargetComponent = (name: string) => name === targetComponentName

    return {
      ExportDefaultDeclaration() {
        ok = true
      },
      ExportNamedDeclaration(namedExport) {
        if (ok) return

        // Pass check if there are export specifiers in index file
        if (namedExport.specifiers.length && isIndex) {
          ok = true
          return
        }

        const declaration = namedExport.declaration
        if (!declaration) return

        // Check function declaration
        if (declaration.type === 'FunctionDeclaration' && declaration.id) {
          if (isTargetComponent(declaration.id.name)) {
            ok = true
            return
          }
          exportFunc.push(declaration.id)
        }

        // Check class declaration
        if (declaration.type === 'ClassDeclaration' && declaration.id) {
          if (isTargetComponent(declaration.id.name)) {
            ok = true
            return
          }
        }

        // Check variable declaration (arrow functions, function expressions, etc.)
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

        // Suggest fix when component name does not match
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

        // Suggest adding default component when no component is exported
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
