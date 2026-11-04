import js from '@eslint/js';
import router from '@tanstack/eslint-plugin-router';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Recommended rule sets as they ship, without local overrides.
export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  router.configs['flat/recommended'],
  reactHooks.configs.flat.recommended,
  // routeTree.gen.ts is written by the router generator and committed.
  globalIgnores(['dist/**', 'src/routeTree.gen.ts']),
]);
