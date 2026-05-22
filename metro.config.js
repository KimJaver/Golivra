const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

/** Metro web/Android fails to resolve lucide's ESM barrel (`*.mjs` subpaths). Force the CJS entry. */
const lucideReactNativeMain = path.resolve(
  __dirname,
  'node_modules/lucide-react-native/dist/cjs/lucide-react-native.js'
);

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'lucide-react-native') {
    return { type: 'sourceFile', filePath: lucideReactNativeMain };
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;
