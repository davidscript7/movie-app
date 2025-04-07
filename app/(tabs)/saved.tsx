import { icons } from "../../../mobile_movie_app/constants/icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Save = () => {
    const router = useRouter();

    const navigateToSearch = () => {
        router.push('/search');
    };

    return (
        <SafeAreaView className="bg-primary flex-1 px-10">
            <View className="flex justify-center items-center flex-1 flex-col gap-5">
                <Image
                    source={icons.save}
                    className="size-16"
                    tintColor="#A8B5DB"
                    accessibilityLabel="Save icon"
                />
                <Text className="text-white text-xl font-semibold">No Saved Movies</Text>
                <Text className="text-gray-500 text-base text-center px-8">
                    You haven't saved any movies yet. Search for movies and save them to view them here.
                </Text>

                <TouchableOpacity
                    className="mt-6 bg-accent py-3 px-8 rounded-full"
                    onPress={navigateToSearch}
                    accessibilityLabel="Search for movies"
                >
                    <Text className="text-white font-medium">Search for Movies</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Save;