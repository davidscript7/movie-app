import { useState, memo } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
    Platform,
    Switch,
    Alert
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { icons } from "../../../mobile_movie_app/constants/icons";

interface SettingsItemProps {
    icon: any;
    title: string;
    onPress?: () => void;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    isToggle?: boolean;
}

// Memoize SettingsItem to prevent unnecessary re-renders
const SettingsItem = memo(({
                               icon,
                               title,
                               onPress,
                               value,
                               onValueChange,
                               isToggle = false
                           }: SettingsItemProps) => (
    <TouchableOpacity
        className="flex-row items-center py-4 border-b border-dark-100"
        onPress={onPress}
        disabled={isToggle}
        accessibilityLabel={title}
        accessibilityRole={isToggle ? "switch" : "button"}
        accessibilityState={isToggle ? { checked: value } : {}}
    >
        <Image source={icon} className="size-6 mr-4" tintColor="#A8B5DB" />
        <Text className="text-white flex-1">{title}</Text>
        {isToggle ? (
            <Switch
                trackColor={{ false: "#767577", true: "#AB8BFF" }}
                thumbColor={value ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={onValueChange}
                value={value}
            />
        ) : (
            <Image source={icons.arrow} className="size-4" tintColor="#A8B5DB" />
        )}
    </TouchableOpacity>
));

// Add display name for debugging purposes
SettingsItem.displayName = "SettingsItem";


const Profile = () => {
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const isLargeScreen = width > 768;

    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    // Calculate padding based on platform
    const paddingTop = Platform.OS === 'ios' ? insets.top : 20;

    const handleItemPress = (title: string) => {
        Alert.alert(title, `${title} will be available soon!`);
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => console.log("User logged out")
                }
            ]
        );
    };

    return (
        <SafeAreaView className="bg-primary flex-1">
            <ScrollView
                className={`flex-1 ${isLargeScreen ? 'px-20' : 'px-6'}`}
                contentContainerStyle={{ paddingTop: paddingTop }}
                showsVerticalScrollIndicator={false}
            >

                {/* Settings Section */}
                <View className="mb-6">
                    <Text className="text-accent font-bold text-lg mb-2">App Settings</Text>

                    <SettingsItem
                        icon={icons.person}
                        title="Account Settings"
                        onPress={() => handleItemPress("Account Settings")}
                    />

                    <SettingsItem
                        icon={icons.save}
                        title="Saved Movies"
                        onPress={() => handleItemPress("Saved Movies")}
                    />

                    <SettingsItem
                        icon={icons.search}
                        title="Dark Mode"
                        isToggle
                        value={darkMode}
                        onValueChange={setDarkMode}
                    />

                    <SettingsItem
                        icon={icons.person}
                        title="Notifications"
                        isToggle
                        value={notifications}
                        onValueChange={setNotifications}
                    />
                </View>

                {/* Help Section */}
                <View className="mb-10">
                    <Text className="text-accent font-bold text-lg mb-2">Support</Text>

                    <SettingsItem
                        icon={icons.person}
                        title="Help Center"
                        onPress={() => handleItemPress("Help Center")}
                    />

                    <SettingsItem
                        icon={icons.person}
                        title="Privacy Policy"
                        onPress={() => handleItemPress("Privacy Policy")}
                    />

                    <SettingsItem
                        icon={icons.person}
                        title="Terms of Service"
                        onPress={() => handleItemPress("Terms of Service")}
                    />
                </View>

                <TouchableOpacity
                    className="my-6 bg-dark-100 py-3 rounded-lg items-center"
                    accessibilityLabel="Log out"
                    onPress={handleLogout}
                >
                    <Text className="text-red-500 font-medium">Log Out</Text>
                </TouchableOpacity>

                <Text className="text-center text-gray-500 mb-10">App Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;