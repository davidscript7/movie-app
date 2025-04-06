import { Tabs } from "expo-router";
import { ImageBackground, Image, Text, View, Platform, useWindowDimensions } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { memo } from "react";

interface TabIconProps {
    focused: boolean;
    icon: any;
    title: string;
}

// Memoize TabIcon to prevent unnecessary re-renders
const TabIcon = memo(({ focused, icon, title }: TabIconProps) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[112px] min-h-14 mt-2 justify-center items-center rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className="text-secondary text-base font-semibold ml-2">
                    {title}
                </Text>
            </ImageBackground>
        );
    }
    return (
        <View className="size-full justify-center items-center mt-2 rounded-full">
            <Image source={icon} tintColor="#A8B5DB" className="size-5" />
        </View>
    );
});

// Add display name for debugging purposes
TabIcon.displayName = "TabIcon";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    // Adjust tab bar position and style based on platform and screen width
    const isLargeScreen = width > 768;
    const tabBarMarginBottom = Platform.OS === 'ios' ? Math.max(20, insets.bottom) : 20;
    const tabBarWidth = isLargeScreen ? "70%" : "90%";

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    tabBarActiveTintColor: "#FFA500",
                    headerShown: false,
                },
                tabBarStyle: {
                    backgroundColor: "#0F0D23",
                    borderRadius: 50,
                    borderTopWidth: 0,
                    marginHorizontal: "auto",
                    marginBottom: tabBarMarginBottom,
                    height: 60,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0F0D23",
                    width: tabBarWidth,
                    alignSelf: "center",
                },
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                // Add animations and transitions for better UX
                headerShown: false,
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <TabIcon focused={focused} icon={icons.home} title="Home" />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <TabIcon focused={focused} icon={icons.search} title="Search" />
                    ),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: "Save",
                    headerShown: false,
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <TabIcon focused={focused} icon={icons.save} title="Save" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }: { focused: boolean }) => (
                        <TabIcon focused={focused} icon={icons.person} title="Profile" />
                    ),
                }}
            />
        </Tabs>
    );
}