import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// @ts-ignore
import react from 'eslint-plugin-react'
// @ts-ignore
import hooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

import { appPage, component, componentInterface, rscApi } from '../rules'

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/build/',
      '**/__snapshots__/',
      '!**/src/**',
      '!vite.config.ts',
      '!**/.storybook/**',
      '**/storybook-static/',
      '**/dist/',
      '**/next-env.d.ts',
      '**/out/',
      '**/.next/',
      '**/public/',
      '**/.df/',
    ],
  },
  react.configs.flat!.recommended,
  ...tseslint.config(
    js.configs.recommended,
    eslintPluginPrettierRecommended,
    ...tseslint.configs.recommended,
    ...pluginQuery.configs['flat/recommended'],
    {
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: {
        'react-hooks': hooksPlugin,
        'unused-imports': unusedImports,
        'simple-import-sort': simpleImportSort,
        '@devup': {
          rules: {
            component,
            'rsc-api': rscApi,
            'app-page': appPage,
            'component-interface': componentInterface,
          },
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'require-jsdoc': 'off',
        'valid-jsdoc': 'off',
        'prettier/prettier': [
          'error',
          {
            endOfLine: 'auto',
            trailingComma: 'all',
            singleQuote: true,
            semi: false,
          },
        ],
        'no-trailing-spaces': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-constant-condition': ['error', { checkLoops: false }],
        'react/jsx-curly-brace-presence': 'error',
        camelcase: 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: false,
            shorthandFirst: false,
            shorthandLast: false,
            ignoreCase: false,
            noSortAlphabetically: false,
            reservedFirst: true,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        'react/sort-default-props': 'error',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 'off',
        'comma-dangle': 'off',
        'react/prop-types': 'off',
        'no-console': [
          'error',
          {
            allow: ['info', 'debug', 'warn', 'error'],
          },
        ],
        'spaced-comment': [
          'error',
          'always',
          {
            markers: ['/'],
          },
        ],
        '@devup/rsc-api': 'error',
        '@devup/component-interface': 'error',
        '@devup/app-page': 'error',
        '@devup/component': 'error',
        ...hooksPlugin.configs.recommended.rules,
        'react-hooks/exhaustive-deps': [
          'warn',
          {
            additionalHooks: 'useSafeEffect',
          },
        ],
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
          },
        ],
      },
    },
    {
      files: ['**/*.test-d.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ),
] as any
