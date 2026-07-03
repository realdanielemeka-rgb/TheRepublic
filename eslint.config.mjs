import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next. "**/" prefixes (rather than
    // just ".next/**") so these still match if this ever runs from a
    // nested checkout — e.g. a `.claude/worktrees/**` agent sandbox some
    // environments create alongside this repo, which otherwise leaks its
    // own stale `.next` build output into a bare `npm run lint` here.
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
  ]),
]);

export default eslintConfig;
