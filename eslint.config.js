import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: [
      'api/**/*.{js,jsx}',
      '*.{config,conf}.{js,jsx}',
      'vite.config.{js,jsx}',
      'tailwind.config.{js,jsx}',
      'postcss.config.{js,jsx}',
      'eslint.config.{js,jsx}',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // This project doesn't use PropTypes; avoid hundreds of noisy errors.
      'react/prop-types': 'off',

      // Many shadcn/ui components use custom attributes; don't block builds on this.
      'react/no-unknown-property': 'off',

      // Allow apostrophes/quotes in JSX text without forcing HTML entities.
      'react/no-unescaped-entities': 'off',

      // Used in filename sanitisation.
      'no-control-regex': 'off',

      // React 17+ JSX runtime doesn't require importing React.
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],

      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
