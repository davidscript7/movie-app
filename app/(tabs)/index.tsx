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
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useCallback, useMemo, useContext } from "react";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { LayoutContext } from '@/types/layoutContext';

// Error message component to avoid repetition
const ErrorMessage = ({ message }: { message?: string }) => (
    <View className="bg-red-900/30 p-4 rounded-lg mt-6">
        <Text className="text-red-400 text-center">
            {message || "Something went wrong. Please try again."}
        </Text>
    </View>
);


// Header component to improve code organization
const Header = () => {
    const layout = useContext(LayoutContext);
    return (
        <Image
            source={icons.logo}
            className={`w-12 h-10 ${layout?.isLargeScreen ? 'mt-5' : 'mt-16'} mb-5 mx-auto`}
            accessibilityLabel="App logo"
        />
    );
};

const Index = () => {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debugInfo, setDebugInfo] = useState("");

    // Mejora: Usar useMemo para valores calculados que dependen de dimensiones
    const layoutConfig = useMemo(() => {
        // Configuración responsive basada en breakpoints
        const isSmallDevice = width < 375;
        const isLargeScreen = width >= 768;
        const isTablet = width >= 600 && width < 768;
        const isLandscape = width > height;

        // Cálculo de columnas basado en el ancho disponible
        const itemWidth = isSmallDevice ? 150 : 180;
        const columns = Math.max(2, Math.floor(width / itemWidth));

        // Espaciado dinámico
        const horizontalPadding = isLargeScreen ? 10 : (isTablet ? 8 : 5);
        const verticalSpacing = isLargeScreen ? 24 : (isTablet ? 20 : 16);

        return {
            isSmallDevice,
            isLargeScreen,
            isTablet,
            isLandscape,
            columns,
            horizontalPadding,
            verticalSpacing,
            paddingTop: Platform.OS === 'ios' ? insets.top + 10 : 20,
        };
    }, [width, height, insets.top]);

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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            Alert.alert("Búsqueda vacía", "Por favor ingresa un término de búsqueda");
        }
    };

    // Estilos dinámicos para el contenedor principal
    const containerStyle = useMemo(() => ({
        flex: 1,
        paddingHorizontal: layoutConfig.horizontalPadding * (layoutConfig.isLargeScreen ? 8 : 6),
    }), [layoutConfig.horizontalPadding, layoutConfig.isLargeScreen]);

    // Estilos dinámicos para el FlatList de películas
    const moviesListStyle = useMemo(() => ({
        marginTop: 8,
        paddingBottom: 32,
    }), []);

    // Configuración dinámica para el FlatList
    const flatListConfig = useMemo(() => ({
        key: `flatlist-${layoutConfig.columns}`,
        columnWrapperStyle: {
            justifyContent: "space-between" as const,
            marginBottom: layoutConfig.verticalSpacing / 2,
        },
        numColumns: layoutConfig.columns,
    }), [layoutConfig.columns, layoutConfig.verticalSpacing]);

    // Extraer propiedades de diseño para el contexto
    const layoutContextValue = useMemo(() => ({
        isSmallDevice: layoutConfig.isSmallDevice,
        isLargeScreen: layoutConfig.isLargeScreen,
        isTablet: layoutConfig.isTablet,
        isLandscape: layoutConfig.isLandscape,
        columns: layoutConfig.columns,
        horizontalPadding: layoutConfig.horizontalPadding,
        verticalSpacing: layoutConfig.verticalSpacing,
    }), [layoutConfig]);

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <View className="flex-1 bg-primary">
                <Image
                    source={images.bg}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        left: 0,
                        top: 0,
                        zIndex: -1,
                    }}
                    resizeMode="cover"
                />

                <ScrollView
                    className="flex-1"
                    style={containerStyle}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        minHeight: "100%",
                        paddingTop: layoutConfig.paddingTop,
                        paddingBottom: 100,
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
                    <Header />

                    {/* Información de depuración */}
                    {debugInfo && (
                        <Text className="text-white text-xs mb-2 text-center">
                            Status: {debugInfo}
                        </Text>
                    )}

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
                                placeholder="Search for a movie"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onPress={handleSearch}
                            />

                            {trendingMovies && trendingMovies.length > 0 && (
                                <View className="mt-5">
                                    <Text
                                        className={`${layoutConfig.isLargeScreen ? 'text-xl' : layoutConfig.isTablet ? 'text-lg' : 'text-base'} text-white font-bold mb-3`}
                                    >
                                        Trending Movies
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        className="mb-4 mt-3"
                                        contentContainerStyle={{
                                            paddingRight: 20,
                                            gap: layoutConfig.isLargeScreen ? 16 : 12,
                                        }}
                                    >
                                        {trendingMovies.map((item, index) => (
                                            <View key={item.movie_id.toString()}>
                                                <TrendingCard
                                                    movie={item}
                                                    index={index}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {movies && movies.length > 0 && (
                                <>
                                    <Text
                                        className={`${layoutConfig.isLargeScreen ? 'text-xl' : layoutConfig.isTablet ? 'text-lg' : 'text-base'} text-white font-bold mt-5 mb-3`}
                                    >
                                        Latest Movies
                                    </Text>

                                    <FlatList
                                        {...flatListConfig}
                                        data={movies}
                                        renderItem={({ item }: { item: any; index: any }) => (
                                            <MovieCard {...item} />
                                        )}
                                        keyExtractor={(item) => item.id.toString()}
                                        style={moviesListStyle}
                                        scrollEnabled={false}
                                    />
                                </>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </LayoutContext.Provider>
    );
};

export default Index;