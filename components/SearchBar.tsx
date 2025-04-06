import { View, TextInput, Image, TouchableOpacity, Platform } from "react-native";
import { icons } from "@/constants/icons";

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
                resizeMode="contain"
                tintColor="#AB8BFF"
            />

            {disabled ? (
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.7}
                    className="flex-1 h-8 justify-center"
                >
                    <TextInput
                        editable={false}
                        placeholder={placeholder}
                        value={value}
                        className="flex-1 ml-2 text-white"
                        placeholderTextColor="#A8B5DB"
                    />
                </TouchableOpacity>
            ) : (
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    className="flex-1 ml-2 text-white h-8"
                    placeholderTextColor="#A8B5DB"
                    selectionColor="#AB8BFF"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            )}
        </View>
    );
};

export default SearchBar;