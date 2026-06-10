import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  /* .claude holds local tooling state (including temporary git worktrees with their own tsconfigs)
     that must never be linted or treated as a TypeScript project root. */
  globalIgnores(['dist', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        /* Pin the project root so stray tsconfigs elsewhere on disk cannot break parsing. */
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
