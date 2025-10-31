import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import nextConfig from 'eslint-config-next';

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  ignores: [
    '.next/**',
    'node_modules/**',
    'out/**',
    '.vercel/**',
    'dist/**',
  ],
}, ...nextConfig];

export default eslintConfig;

