import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Calculate dynamic styles based on screen dimensions
    const isLargeScreen = width > 768;
    const posterHeight = isLargeScreen ? height * 0.6 : 550;
    const contentPadding = isLargeScreen ? "px-8" : "px-5";

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#AB8BFF" />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{
                paddingBottom: Platform.OS === 'ios' ? insets.bottom + 100 : 100
            }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className={`w-full h-[${posterHeight}px]`}
                        resizeMode={isLargeScreen ? "contain" : "cover"}
                    />

                    <TouchableOpacity
                        className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
                        accessibilityLabel="Play trailer"
                    >
                        <Image
                            source={icons.play}
                            className="w-6 h-7 ml-1"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View className={`flex-col items-start justify-center mt-5 ${contentPadding}`}>
                    <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-2">
                        <Text className="text-light-200 text-sm">
                            {movie?.release_date?.split("-")[0] || 'N/A'} •
                        </Text>
                        <Text className="text-light-200 text-sm">
                            {movie?.runtime || 'N/A'}m
                        </Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />

                        <Text className="text-white font-bold text-sm">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>

                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count || 0} votes)
                        </Text>
                    </View>

                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo
                        label="Genres"
                        value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
                    />

                    <View className={`flex ${isLargeScreen ? 'flex-row' : 'flex-col'} justify-between ${isLargeScreen ? 'w-1/2' : 'w-full'}`}>
                        <MovieInfo
                            label="Budget"
                            value={movie?.budget ? `$${(movie.budget / 1_000_000).toFixed(1)} million` : 'N/A'}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={movie?.revenue ? `$${(movie.revenue / 1_000_000).toFixed(1)} million` : 'N/A'}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies?.map((c) => c.name).join(" • ") ||
                            "N/A"
                        }
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                className={`absolute bottom-${Platform.OS === 'ios' ? Math.max(5, insets.bottom) : 5} left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50`}
                onPress={router.back}
                accessibilityLabel="Go back"
            >
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Details;