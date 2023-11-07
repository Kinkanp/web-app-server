const fs = require('fs');
const path = require('path');

const DOMAIN_PATH = path.join(process.cwd(), 'src/domain');
const LIB_PATH = path.join(process.cwd(), 'packages');
const domains = fs.readdirSync(DOMAIN_PATH);
const packages = fs.readdirSync(LIB_PATH);

const domainRules = domains.map(domain => ({
  target: `src/domain/${domain}/**/*`,
  from: `src/domain/!(${domain})/**/*`,
  message: `Domain '${domain}' should not import anything from other domains. Use aggregation instead`
}));

const packagesRules = packages.map(lib => ({
  'target': `packages/${lib}/**/*`,
  'from': `./packages/!(${lib})/**/*`
}));

const restrictedPaths = [
  {
    'target': 'src/!(aggregation|domain)/**/*',
    'from': 'src/domain/**/*'
  },
  {
    'target': 'src/**/*',
    'from': './packages/**/*'
  },
  ...domainRules,
  ...packagesRules
];

module.exports = {
  'env': {
    'node': true,
    'es2021': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'ignorePatterns': ['packages/*/dist/**', 'tsconfig.*.json'],
  'plugins': ['@typescript-eslint', 'import', 'workspaces'],
  'settings': {
    'import/resolver': {
      'node': {
        'extensions': [
          '.ts'
        ]
      }
    }
  },
  'rules': {
    'workspaces/no-relative-imports': 'error',
    'workspaces/no-cross-imports': 'error',
    'workspaces/no-absolute-imports': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        'zones': restrictedPaths
      }
    ],
    'quotes': ['warn', 'single'],
    '@typescript-eslint/ban-ts-comment': 'off'
  }
}
