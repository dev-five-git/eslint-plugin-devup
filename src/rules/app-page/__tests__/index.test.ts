import { RuleTester } from '@typescript-eslint/rule-tester'

import { appPage } from '../index'

describe('app-page rule', () => {
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
  ruleTester.run('app-page rule', appPage, {
    valid: [
      {
        code: 'export default function IndexPage(){return <Row><Col></Col></Row>}',
        filename: 'src/app/page.tsx',
      },
      {
        code: 'export default function IndexPage(){return <Row><Col></Col></Row>}',
        filename: 'src/components/page.tsx',
      },
      {
        code: 'export default function IndexLayout(){return <></>}',
        filename: 'src/app/layout.tsx',
      },
      {
        code: 'export default function NotFoundPage(){return <></>}',
        filename: 'src/app/404.tsx',
      },
      {
        code: 'const a=1;\nexport default a',
        filename: 'src/app/a/page.tsx',
      },
      {
        // locale 만 있을 때는 제외입니다.
        code: 'export default function TestPage(){return <></>}',
        filename: 'src/app/[locale]/page.tsx',
      },
      {
        code: 'export default function TestPage({ params }: { params: Promise<{ locale:string }>}){return <></>}',
        filename: 'src/app/[locale]/page.tsx',
      },
      {
        code: '',
        filename: 'src/app/Comp.tsx',
      },
    ],
    invalid: [
      {
        code: 'export default function Index(){return <></>}',
        output: 'export default function IndexLayout(){return <></>}',
        filename: 'src/app/layout.tsx',
        errors: [
          {
            messageId: 'nameOfPageOrLayoutComponentShouldHaveSuffix',
          },
        ],
      },
      {
        code: 'export default function Index(){return <></>}',
        output: 'export default function IndexPage(){return <></>}',
        filename: 'src/app/page.tsx',
        errors: [
          {
            messageId: 'nameOfPageOrLayoutComponentShouldHaveSuffix',
          },
        ],
      },
      {
        code: '',
        filename: 'src/app/page.tsx',
        output: 'export default function Page(){return <></>}',
        errors: [
          {
            messageId: 'pageOrLayoutComponentShouldDefaultExport',
          },
        ],
      },
      {
        code: '',
        filename: 'src/app/[a]/page.tsx',
        output:
          'export default function Page({params}:{params:Promise<{a:string}>}){return <></>}',
        errors: [
          {
            messageId: 'pageOrLayoutComponentShouldDefaultExport',
          },
        ],
      },
      {
        code: '',
        filename: 'src/app/404.tsx',
        output: 'export default function NotFoundPage(){return <></>}',
        errors: [
          {
            messageId: 'pageOrLayoutComponentShouldDefaultExport',
          },
        ],
      },
      {
        code: 'export const A=1',
        filename: 'src/app/page.tsx',
        output:
          'export const A=1\nexport default function Page(){return <></>}',
        errors: [
          {
            messageId: 'pageOrLayoutComponentShouldDefaultExport',
          },
        ],
      },
      {
        code: 'export default function Page(){return <></>}',
        filename: 'src/app/[a]/[b]/page.tsx',
        output:
          'export default function Page({params}:{params:Promise<{a:string;b:string}>}){return <></>}',
        errors: [
          {
            messageId: 'pathParamsShouldExist',
          },
        ],
      },
      {
        code: 'export default function Page():any{return <></>}',
        filename: 'src/app/[a]/[b]/page.tsx',
        output:
          'export default function Page({params}:{params:Promise<{a:string;b:string}>}):any{return <></>}',
        errors: [
          {
            messageId: 'pathParamsShouldExist',
          },
        ],
      },
      {
        code: '',
        filename: 'src/app/[locale]/page.tsx',
        output:
          'export default function Page({params}:{params:Promise<{locale:string}>}){return <></>}',
        errors: [
          {
            messageId: 'pageOrLayoutComponentShouldDefaultExport',
          },
        ],
      },
    ],
  })
})
