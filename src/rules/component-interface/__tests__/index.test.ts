import { RuleTester } from '@typescript-eslint/rule-tester'

import { componentInterface } from '../index'

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

ruleTester.run('component-interface rule', componentInterface, {
  valid: [
    {
      code: 'interface HelloProps{}\ninterface Hello1Props{}\nexport function Hello({}:HelloProps){return <></>}',
      filename: 'src/components/hello.tsx',
    },
    {
      code: '',
      filename: 'src/components/hello.ts',
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
    {
      code: 'function Hello({}){return <></>}\nfunction Hello2({}){return <></>}',
      output:
        'interface HelloProps{}\nfunction Hello({}:HelloProps){return <></>}\ninterface Hello2Props{}\nfunction Hello2({}:Hello2Props){return <></>}',
      filename: 'src/components/hello.tsx',
      errors: [
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
      ],
    },
    {
      code: 'function Hello({}){return <></>}\nfunction Hello2({}){return <></>}\nexport function Hello3({}){return <></>}\nexport default function Hello4({}){return <></>}',
      output:
        'interface HelloProps{}\nfunction Hello({}:HelloProps){return <></>}\ninterface Hello2Props{}\nfunction Hello2({}:Hello2Props){return <></>}\ninterface Hello3Props{}\nexport function Hello3({}:Hello3Props){return <></>}\ninterface Hello4Props{}\nexport default function Hello4({}:Hello4Props){return <></>}',
      filename: 'src/components/hello.tsx',
      errors: [
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
        {
          messageId:
            'componentPropsShouldHaveTypeAnnotationWhenEmptyObjectPattern',
        },
      ],
    },
  ],
})
