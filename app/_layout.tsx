import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <>
            {/* Use StatusBar from expo-status-bar for better cross-platform support */}
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#0F0D23" },
                    animation: "slide_from_right",
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="movie/[id]"
                    options={{
                        headerShown: false,
                        presentation: "modal", // Makes transitions more elegant
                    }}
                />
            </Stack>
        </>
    );
}