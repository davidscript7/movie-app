module.exports = function(api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", {
                "jsxImportSource": "nativewind",
                "disableImportExportTransform": true
            }]
        ],
        plugins: [
            "react-native-reanimated/plugin",
            ["nativewind/babel", {
                mode: "transformOnly",
                input: "./globals.css",
                configPath: "./tailwind.config.js"
            }]
        ]
    };
};