import { View, TextInput, Image, TouchableOpacity, Platform } from "react-native";
import { icons } from "@/constants/icons";
import { useLayout } from "@/types/layoutContext";

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
    disabled?: boolean;
}

const SearchBar = ({
                       placeholder,
                       value,
                       onChangeText,
                       onPress,
                       disabled = false
                   }: Props) => {
    // We're not using useLayout here anymore to prevent the context error
    // If we need layout information, we'll use props passed from parent

    return (
        <View
            className="flex-row items-center bg-dark-200 rounded-full px-5 py-3"
            style={{
                ...Platform.select({
                    ios: {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                    },
                    android: {
                        elevation: 3,
                    },
                }),
            }}
        >
            <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="cover"
                tintColor="#AB8BFF"
            />

            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                className="flex-1 ml-2 text-white h-8"
                placeholderTextColor="#A8B5DB"
                selectionColor="#AB8BFF"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!disabled}
                onSubmitEditing={onPress} // This triggers search on keyboard Enter/Submit
            />

            {/* Add a search button */}
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                className="ml-2"
            >
                <View className="bg-accent rounded-full p-2">
                    <Image
                        source={icons.arrow || require('@/assets/icons/arrow.png')}
                        className="w-4 h-4"
                        resizeMode="contain"
                        tintColor="#FFFFFF"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;