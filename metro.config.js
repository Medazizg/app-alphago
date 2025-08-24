const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  'react-native-vector-icons': '@expo/vector-icons',
};

// Force disable bridgeless mode
config.transformer.experimentalImportSupport = false;
config.transformer.unstable_allowRequireContext = false;

module.exports = config;
