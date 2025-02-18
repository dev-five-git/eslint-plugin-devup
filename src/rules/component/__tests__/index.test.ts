import { RuleTester } from '@typescript-eslint/rule-tester'

import { component } from '../index'

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
  ruleTester.run('component rule', component, {
    valid: [
      {
        code: 'export default function IndexPage(){return <Row><Col></Col></Row>}',
        filename: 'src/app/page.tsx',
      },
      {
        code: 'export default function IndexPage(){return <Row><Col></Col></Row>}',
        filename: 'src/app/aaa/bb/cc/page.tsx',
      },
      {
        code: 'export default function IndexPage(){return <Row><Col></Col></Row>}',
        filename: 'src/app/aaa/bb/cc/layout.tsx',
      },
      {
        code: 'export function Page(){return <Row><Col></Col></Row>}',
        filename: 'src/components/page.tsx',
      },
      {
        // 예외
        code: 'export {a} from "./a"',
        filename: 'src/components/index.tsx',
      },
      {
        // 예외
        code: '',
        filename: 'src/app/404.tsx',
      },
      {
        code: 'export function TestComponent(){return <Row><Col></Col></Row>}',
        filename: 'src/components/test-component.tsx',
      },
      {
        code: 'export function NiceComponentAll(){return <Row><Col></Col></Row>}\nexport function NiceComponent(){return <Row><Col></Col></Row>}',
        filename: 'src/components/nice_component.tsx',
      },
      {
        code: 'export function NiceComponent(){return <Row><Col></Col></Row>}',
        filename: 'src/components/nice_component.tsx',
      },
      {
        code: 'export function Number9(){return <Row><Col></Col></Row>}',
        filename: 'src/components/number9.tsx',
      },
      {
        code: '"use client"\nexport function Number9(){return <Row><Col></Col></Row>}',
        filename: 'src/components/Number9.tsx',
      },
      {
        code: 'export function Number9(){return <Row><Col></Col></Row>}',
        filename: 'src/components/Number9.tsx',
      },
      {
        code: 'export function hello(){return <Row><Col></Col></Row>}',
        filename: 'src/components/utils/Number9.tsx',
      },
      {
        code: 'export function Dir(){return <></>}',
        filename: 'src/components/dir/index.tsx',
      },
      {
        code: 'export const Dir = ()=>{return <></>}',
        filename: 'src/components/dir/index.tsx',
      },
      {
        code: 'export const Dir1 = ()=>{return <></>}\nexport const Dir = ()=>{return <></>}',
        filename: 'src/components/dir/index.tsx',
      },
      {
        code: '\nexport {} from ""\nexport const Dir = ()=><></>',
        filename: 'src/components/dir/index.tsx',
      },
      {
        code: 'export const Dir = ()=><></>',
        filename: 'src/components/__test__/index.test.tsx',
      },
      {
        code: 'export const Dir = ()=><></>',
        filename: 'src/components/__tests__/index.test.tsx',
      },
      {
        code: 'export const Dir = ()=><></>',
        filename: 'src/components/index.css.tsx',
      },
      {
        code: 'export const Dir = function(){return <></>}\nexport const Dir2 = function(){return <></>}',
        filename: 'src/components/dir/index.tsx',
      },
      {
        code: 'export function Dir(){return <></>}',
        filename: 'src/components/dir1/a/b/c/d/dir.tsx',
      },
      {
        code: 'export function Dir(){return <></>}',
        filename: 'src/app/dir1/a/b/c/d/dir.tsx',
      },
      {
        code: 'export function D(){return <></>}',
        filename: 'src/app/dir1/a/b/c/d/index.tsx',
      },
      {
        code: '',
        filename: 'src/none.tsx',
      },
      {
        code: 'interface HelloProps{}\ninterface Hello1Props{}\nexport function Hello({}:HelloProps){return <></>}',
        filename: 'src/components/hello.tsx',
      },
    ],
    invalid: [
      {
        code: '',
        output: 'export function D(){return <></>}',
        filename: 'src/app/d.tsx',
        errors: [
          {
            messageId: 'componentFileShouldExportComponent',
          },
        ],
      },
      {
        code: '',
        output: 'export function D(){return <></>}',
        filename: 'src/app/d/index.tsx',
        errors: [
          {
            messageId: 'componentFileShouldExportComponent',
          },
        ],
      },
      {
        code: '',
        output: 'export function D(){return <></>}',
        filename: 'src/components/d/index.tsx',
        errors: [
          {
            messageId: 'componentFileShouldExportComponent',
          },
        ],
      },
      {
        code: 'export function Wrong(){return <></>}',
        output: 'export function D(){return <></>}',
        filename: 'src/components/d.tsx',
        errors: [
          {
            messageId: 'componentNameShouldBeFollowDirectoryStructure',
          },
        ],
      },
      {
        code: 'export function d(){return <></>}',
        output: 'export function D(){return <></>}',
        filename: 'src/app/d.tsx',
        errors: [
          {
            messageId: 'componentNameShouldBeFollowDirectoryStructure',
          },
        ],
      },
      {
        code: 'export function d(){return <></>}',
        output: 'export function D(){return <></>}',
        filename: 'src/app/d/index.tsx',
        errors: [
          {
            messageId: 'componentNameShouldBeFollowDirectoryStructure',
          },
        ],
      },
      {
        code: 'export function d(){return <></>}',
        output: 'export function D(){return <></>}',
        filename: 'src/components/d/index.tsx',
        errors: [
          {
            messageId: 'componentNameShouldBeFollowDirectoryStructure',
          },
        ],
      },
      {
        code: 'export const d=function(){return <></>}',
        output: 'export const D=function(){return <></>}',
        filename: 'src/components/d/index.tsx',
        errors: [
          {
            messageId: 'componentNameShouldBeFollowDirectoryStructure',
          },
        ],
      },
      {
        code: 'export const num=1\nexport const {num1}={num1:1}',
        output:
          'export const num=1\nexport const {num1}={num1:1}\nexport function Just(){return <></>}',
        filename: 'src/components/just.tsx',
        errors: [
          {
            messageId: 'componentFileShouldExportComponent',
          },
        ],
      },
    ],
  })
})
