const { getDefaultConfig } = require("expo/metro-config");

// For NativeWind v4
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "@/app/global.css" });