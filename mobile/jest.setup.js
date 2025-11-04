// Jest setup file
// @testing-library/react-native v12.4+ includes matchers by default

// Polyfill for Expo
global.setImmediate = global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
