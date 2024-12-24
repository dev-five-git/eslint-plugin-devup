import { RuleTester } from '@typescript-eslint/rule-tester'

import { cssTs } from '../index'

describe('css-ts rule', () => {
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
  ruleTester.run('css-ts rule', cssTs, {
    valid: [
      {
        code: '',
        filename: 'src/app/page.tsx',
      },
      {
        code: 'export const HelloStyle=css({})',
        filename: 'src/app/aaa/bb/cc/hello.css.ts',
      },
      {
        code: 'export const JustString=""',
        filename: 'src/app/aaa/bb/cc/hello.css.ts',
      },
    ],
    invalid: [
      {
        code: 'export const Hello=css({})',
        output: 'export const HelloStyle=css({})',
        filename: 'src/app/d.css.ts',
        errors: [
          {
            messageId: 'styleInCssTsShouldHaveStylePostfix',
          },
        ],
      },
      {
        code: '',
        output: 'import {css} from "@devup/css"\nexport const AbcStyle=css({})',
        filename: 'src/app/abc/index.css.ts',
        errors: [
          {
            messageId: 'cssTsFileShouldExportStyle',
          },
        ],
      },
      {
        code: 'console.log()',
        output:
          'import {css} from "@devup/css"\nconsole.log()\nexport const AbcStyle=css({})',
        filename: 'src/app/abc/index.css.ts',
        errors: [
          {
            messageId: 'cssTsFileShouldExportStyle',
          },
        ],
      },
    ],
  })
})
