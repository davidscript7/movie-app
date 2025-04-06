import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    FlatList,
    useWindowDimensions,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Calculate dynamic styles and layout based on screen size
    const isLargeScreen = width > 768;
    const paddingTop = Platform.OS === 'ios' ? insets.top + 10 : 20;
    const numColumns = width < 640 ? 3 : width < 1024 ? 4 : 5;

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
    } = useFetch(() => fetchMovies({ query: "" }));

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bg}
                className="absolute w-full z-0"
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
            >
                <Image
                    source={icons.logo}
                    className={`w-12 h-10 ${isLargeScreen ? 'mt-5' : 'mt-20'} mb-5 mx-auto`}
                />

                {moviesLoading || trendingLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#AB8BFF"
                        className="mt-10 self-center"
                    />
                ) : moviesError || trendingError ? (
                    <Text className="text-red-500 text-center mt-10">
                        Error: {moviesError?.message || trendingError?.message}
                    </Text>
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