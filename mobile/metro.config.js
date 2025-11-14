const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro bundler configuration for RelaAI mobile app
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    alias: {
      '@': './src',
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);

