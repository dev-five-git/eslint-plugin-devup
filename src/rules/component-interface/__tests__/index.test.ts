import { RuleTester } from '@typescript-eslint/rule-tester'

import { componentInterface } from '../index'

describe('component rule', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  })
  ruleTester.run('component rule', componentInterface, {
    valid: [
      {
        code: 'interface HelloProps{}\ninterface Hello1Props{}\nexport function Hello({}:HelloProps){return <></>}',
        filename: 'src/components/hello.tsx',
      },
    ],
    invalid: [
      {
        code: 'function Hello({}){return <></>}',
        output:
          'interface HelloProps{}\nfunction Hello({}:HelloProps){return <></>}',
        filename: 'src/components/hello.tsx',
        errors: [
          {
            messageId:
              'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
          },
        ],
      },
      {
        code: 'export function Hello({}){return <></>}',
        output:
          'interface HelloProps{}\nexport function Hello({}:HelloProps){return <></>}',
        filename: 'src/components/hello.tsx',
        errors: [
          {
            messageId:
              'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
          },
        ],
      },
      {
        code: 'export default function Hello({}){return <></>}',
        output:
          'interface HelloProps{}\nexport default function Hello({}:HelloProps){return <></>}',
        filename: 'src/components/hello.tsx',
        errors: [
          {
            messageId:
              'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
          },
        ],
      },
    ],
  })
})
