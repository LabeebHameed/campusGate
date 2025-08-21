const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Add support for react-native-reanimated
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = withNativeWind(config, { input: './global.css' });