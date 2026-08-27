import pluginCypress from 'eslint-plugin-cypress';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    plugins: {
      cypress: pluginCypress,
    },
    rules: {
      ...pluginCypress.configs.recommended.rules,
    },
  },
];
