module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@store': './src/store',
          '@services': './src/services',
          '@theme': './src/theme',
          '@navigation': './src/navigation',
          '@utils': './src/utils',
          '@contracts': '../contracts',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

