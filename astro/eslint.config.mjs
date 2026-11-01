import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

// Recommended rule sets as they ship, without local overrides.
export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  globalIgnores(['dist/**', '.astro/**']),
]);
