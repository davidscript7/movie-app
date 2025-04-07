import { useState, useEffect } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Image,
    useWindowDimensions,
    Platform,
    TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { images } from "../../../mobile_movie_app/constants/images";
import { icons } from "../../../mobile_movie_app/constants/icons";

import useFetch from "../../services/useFetch";
import { fetchMovies } from "../../services/api";
import { updateSearchCount } from "../../services/appwrite";

import SearchBar from "../../components/SearchBar";
import MovieCard from "../../components/MovieCard";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    // Calculate dynamic styles and layout based on screen size
    const isLargeScreen = width > 768;
    const paddingTop = Platform.OS === 'ios' ? insets.top + 10 : 20;
    const numColumns = width < 640 ? 3 : width < 1024 ? 4 : 5;

    const {
        data: movies = [],
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();

                // Call updateSearchCount only if there are results
                if (movies?.length! > 0 && movies?.[0]) {
                    await updateSearchCount(searchQuery, movies[0]);
                }
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                key={`flatlist-${numColumns}`}
                className={`${isLargeScreen ? 'px-10' : 'px-5'}`}
                data={movies as Movie[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
                numColumns={numColumns}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: isLargeScreen ? 24 : 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingTop: paddingTop,
                    paddingBottom: 100
                }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center items-center mt-5">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="absolute left-0"
                                accessibilityLabel="Go back"
                            >
                                <Image
                                    source={icons.arrow}
                                    className="size-5 rotate-180"
                                    tintColor="#fff"
                                />
                            </TouchableOpacity>
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search for a movie"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#AB8BFF"
                                className="my-3"
                            />
                        )}

                        {error && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}

                        {!loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies?.length! > 0 && (
                                <Text className={`${isLargeScreen ? 'text-2xl' : 'text-xl'} text-white font-bold mb-2`}>
                                    Search Results for{" "}
                                    <Text className="text-accent">{searchQuery}</Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim()
                                    ? "No movies found"
                                    : "Start typing to search for movies"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default Search;