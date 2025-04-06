import { Stack, Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "./globals.css";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Componente para las pestañas principales
function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0A0A0A",
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: "#FFA500",
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <MaterialIcons name="home" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#0F0D23" },
                    animation: "slide_from_right",
                }}
            >
                {/* Configuración de las pantallas principales */}
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />

                {/* Pantalla de detalles de película */}
                <Stack.Screen
                    name="movie/[id]"
                    options={{
                        presentation: "modal",
                        animation: "fade",
                        gestureEnabled: true,
                    }}
                />
            </Stack>
        </GestureHandlerRootView>
    );
}