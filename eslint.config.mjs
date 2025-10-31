import nextConfig from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      '.vercel/**',
      'dist/**',
    ],
  },
  ...nextConfig,
];

export default eslintConfig;

