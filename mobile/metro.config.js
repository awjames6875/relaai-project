const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro bundler configuration for RelaAI mobile app
 * Updated for Expo SDK 54 with New Architecture support
 */
const config = getDefaultConfig(__dirname);

// Add path aliases
config.resolver.alias = {
  '@': './src',
};

module.exports = config;

