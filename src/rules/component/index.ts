import { ESLintUtils, TSESTree } from '@typescript-eslint/utils'
import { relative } from 'path'

function toPascal(str: string) {
  return str
    .replace(/[-_](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
}

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/dev-five-git/devup/tree/main/packages/eslint-plugin/src/rules/${name}`,
)

// Combined regex patterns for better performance (single regex test instead of multiple)
const EXCLUDE_PATTERN =
  /[\\/]utils[\\/]|[\\/](__)?tests?(__)?[\\/]|\.(test|css|stories)\.[jt]sx$/
const INCLUDE_PATTERN =
  /(src[/\\])?(app[/\\](?!.*[\\/]?(page|layout|404)\.[jt]sx$)|components[/\\]).*\.[jt]sx$/
const COMPONENT_NAME_PATTERN = /([^/\\]+)[/\\]([^/\\]+)\.[jt]sx$/i

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
      description: 'require component name to follow directory or file name.',
    },
  },
  create(context) {
    const filename = relative(context.cwd, context.physicalFilename)

    // Early return: check exclusion first (more likely to match, faster exit)
    if (EXCLUDE_PATTERN.test(filename) || !INCLUDE_PATTERN.test(filename)) {
      return {}
    }

    // Extract component name from file path
    const targetComponentRegex = COMPONENT_NAME_PATTERN.exec(filename)!

    const isIndex = targetComponentRegex[2].startsWith('index')
    const targetComponentName = isIndex
      ? toPascal(targetComponentRegex[1])
      : toPascal(targetComponentRegex[2])

    const exportFunc: TSESTree.Identifier[] = []
    let ok = false

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

        switch (declaration.type) {
          case 'FunctionDeclaration':
            if (declaration.id) {
              if (declaration.id.name === targetComponentName) {
                ok = true
              } else {
                exportFunc.push(declaration.id)
              }
            }
            break
          case 'ClassDeclaration':
            if (declaration.id?.name === targetComponentName) {
              ok = true
            }
            break
          case 'VariableDeclaration':
            for (const el of declaration.declarations) {
              if (el.id.type !== 'Identifier') continue

              if (el.id.name === targetComponentName) {
                ok = true
                return
              }

              if (
                el.init?.type === 'ArrowFunctionExpression' ||
                el.init?.type === 'FunctionExpression'
              ) {
                exportFunc.push(el.id)
              }
            }
            break
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
              fix: (fixer) => fixer.replaceText(exported, targetComponentName),
            })
          }
          return
        }

        // Suggest adding default component when no component is exported
        context.report({
          node: program,
          messageId: 'componentFileShouldExportComponent',
          data: { targetComponentName },
          fix: (fixer) =>
            fixer.insertTextAfter(
              context.sourceCode.ast,
              context.sourceCode.text.trim().length
                ? `\nexport function ${targetComponentName}(){return <></>}`
                : `export function ${targetComponentName}(){return <></>}`,
            ),
        })
      },
    }
  },
})
