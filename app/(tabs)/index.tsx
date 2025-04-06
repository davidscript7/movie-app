import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    FlatList,
    useWindowDimensions,
    Platform,
    RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useCallback } from "react";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

// Error message component to avoid repetition
const ErrorMessage = ({ message }: { message?: string }) => (
    <View className="bg-red-900/30 p-4 rounded-lg mt-6">
        <Text className="text-red-400 text-center">
            {message || "Something went wrong. Please try again."}
        </Text>
    </View>
);

// Header component to improve code organization
const Header = ({ isLargeScreen }: { isLargeScreen: boolean }) => (
    <Image
        source={icons.logo}
        className={`w-12 h-10 ${isLargeScreen ? 'mt-5' : 'mt-20'} mb-5 mx-auto`}
        accessibilityLabel="App logo"
    />
);

const Index = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    // Calculate dynamic styles and layout based on screen size
    const isLargeScreen = width > 768;
    const paddingTop = Platform.OS === 'ios' ? insets.top + 10 : 20;
    const numColumns = width < 640 ? 3 : width < 1024 ? 4 : 5;

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
        refetch: refetchTrending,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: refetchMovies,
    } = useFetch(() => fetchMovies({ query: "" }));

    // Pull-to-refresh functionality
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchTrending(), refetchMovies()]);
        setRefreshing(false);
    }, [refetchTrending, refetchMovies]);

    const isLoading = moviesLoading || trendingLoading || refreshing;
    const hasError = moviesError || trendingError;

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="absolute w-full h-full z-0"
                resizeMode="cover"
            />

            <ScrollView
                className={`flex-1 ${isLargeScreen ? 'px-10' : 'px-5'}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    minHeight: "100%",
                    paddingTop: paddingTop,
                    paddingBottom: 100
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#AB8BFF"
                        colors={["#AB8BFF"]}
                    />
                }
            >
                <Header isLargeScreen={isLargeScreen} />

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#AB8BFF"
                        className="mt-10 self-center"
                    />
                ) : hasError ? (
                    <ErrorMessage
                        message={moviesError?.message || trendingError?.message}
                    />
                ) : (
                    <View className="flex-1 mt-5">
                        <SearchBar
                            onPress={() => {
                                router.push("/search");
                            }}
                            placeholder="Search for a movie"
                        />

                        {trendingMovies && trendingMovies.length > 0 && (
                            <View className="mt-10">
                                <Text className={`${isLargeScreen ? 'text-xl' : 'text-lg'} text-white font-bold mb-3`}>
                                    Trending Movies
                                </Text>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    className="mb-4 mt-3"
                                    data={trendingMovies}
                                    contentContainerStyle={{
                                        gap: isLargeScreen ? 32 : 26,
                                        paddingRight: 20, // Give breathing room at the end
                                    }}
                                    renderItem={({ item, index }) => (
                                        <TrendingCard movie={item} index={index} />
                                    )}
                                    keyExtractor={(item) => item.movie_id.toString()}
                                    ItemSeparatorComponent={() => <View className="w-4" />}
                                />
                            </View>
                        )}

                        {movies && movies.length > 0 && (
                            <>
                                <Text className={`${isLargeScreen ? 'text-xl' : 'text-lg'} text-white font-bold mt-5 mb-3`}>
                                    Latest Movies
                                </Text>

                                <FlatList
                                    data={movies}
                                    renderItem={({ item }) => <MovieCard {...item} />}
                                    keyExtractor={(item) => item.id.toString()}
                                    numColumns={numColumns}
                                    columnWrapperStyle={{
                                        justifyContent: "flex-start",
                                        gap: isLargeScreen ? 24 : 20,
                                        paddingRight: 5,
                                        marginBottom: 10,
                                    }}
                                    className="mt-2 pb-32"
                                    scrollEnabled={false}
                                />
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Index;