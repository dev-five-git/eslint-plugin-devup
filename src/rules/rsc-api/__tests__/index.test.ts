import { RuleTester } from 'eslint'

import { rscApi } from '../'
describe('rsc api rule', () => {
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
  ruleTester.run('rec-api', rscApi, {
    valid: [
      {
        code: 'export default function Index(){getSingle({})}',
      },
      {
        code: 'function Index(){getSingle({})}',
      },
      {
        code: 'export function Index(){getSingle({})}',
      },
      {
        code: 'export function Index(){const A=()=>getSingle({})}',
      },
      {
        code: 'export function generateMetadata(){cacheGetSingle()}',
      },
      {
        code: 'export function Index(){cacheGetSingle();const A=()=>getSingle({})}',
      },
      {
        code: 'export function Index(){const A=function(){getSingle({})}}',
      },
      {
        code: 'export function Index(){cacheGetSingle({})}',
      },
      {
        code: 'async function Index(){}',
      },
      {
        code: 'const Index=()=>{getSingle({})}',
      },
      {
        code: 'const Index=function*(){getSingle({})}',
      },
      {
        code: 'export async function Index(){}',
      },
      {
        code: 'export async function Index(){async function B(){ getSingle({}) }}',
      },
      {
        code: '"use client"\nasync function Index(){}',
      },
      {
        code: 'export default function Index(){ getSingle({}) }',
      },
      {
        code: '"use client"\nexport default async function Index(){ getSingle({}) }',
      },
      {
        code: '"use client"\nexport default async function Index(){ const a=()=>getSingle({}) }',
      },
      {
        code: '"use client"\nexport default async function Index(){ const a=async ()=>getSingle({}) }',
      },
      {
        code: '"use client"\nexport default async function Index(){function A(){getSingle({})}}',
      },
      {
        code: '"use client"\nlet a=null;a= async ()=>{ getList({}) }',
      },
      {
        code: '"use client"\nlet a=null;a= async function(){ getList({}) }',
      },
      {
        code: 'let a=null;a= async function(){ cacheGetList({}) }',
      },
    ],
    invalid: [
      {
        code: 'async function Index(){ getList() }',
        output: `async function Index(){ cacheGetList() }`,
        errors: [
          {
            message:
              '`getList`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export async function Index(){ getOne({}) }',
        output: `export async function Index(){ cacheGetOne({}) }`,
        errors: [
          {
            message:
              '`getOne`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export default async function Index(){ getSingle({}) }',
        output: `export default async function Index(){ cacheGetSingle({}) }`,
        errors: [
          {
            message:
              '`getSingle`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export default async function(){ custom({}) }',
        output: `export default async function(){ cacheCustom({}) }`,
        errors: [
          {
            message:
              '`custom`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export default async ()=>{ getList({}) }',
        output: `export default async ()=>{ cacheGetList({}) }`,
        errors: [
          {
            message:
              '`getList`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'let A=null;A= async ()=>{ getList({}) }',
        output: `let A=null;A= async ()=>{ cacheGetList({}) }`,
        errors: [
          {
            message:
              '`getList`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export async function Index(){await getSingle();const A=()=>getSingle({})}',
        output: `export async function Index(){await cacheGetSingle();const A=()=>getSingle({})}`,
        errors: [
          {
            message:
              '`getSingle`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'const Index=async ()=>{getSingle({})}',
        output: `const Index=async ()=>{cacheGetSingle({})}`,
        errors: [
          {
            message:
              '`getSingle`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export function generateMetadata(){getSingle()}',
        output: 'export function generateMetadata(){cacheGetSingle()}',
        errors: [
          {
            message:
              '`getSingle`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
      {
        code: 'export async function generateMetadata(){getSingle()}',
        output: 'export async function generateMetadata(){cacheGetSingle()}',
        errors: [
          {
            message:
              '`getSingle`는 서버 컴포넌트에서는 반드시 cache 버전을 사용해야 합니다.',
          },
        ],
      },
    ],
  })
})
