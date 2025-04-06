import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
    className?: string;
}

const MovieInfo = ({ label, value, className }: MovieInfoProps) => (
    <View className={`flex-col items-start justify-center mt-5 ${className}`}>
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Contenedor de imagen responsive */}
                <View className="relative">
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        style={{
                            width: screenWidth,
                            height: screenHeight * 0.5,
                            borderBottomLeftRadius: 24,
                            borderBottomRightRadius: 24,
                        }}
                        resizeMode="repeat"
                    />

                    <LinearGradient
                        colors={['transparent', 'rgba(10,10,10,0.7)', '#0A0A0A']}
                        locations={[0.3, 0.6, 0.9]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: screenHeight * 0.2,
                        }}
                    >
                        <TouchableOpacity
                            className="absolute bottom-4 right-4 rounded-full size-14 bg-white/20 flex items-center justify-center"
                            onPress={() => {}}
                        >
                            <Image
                                source={icons.play}
                                className="w-6 h-7 ml-1"
                                resizeMode="contain"
                                tintColor="#fff"
                            />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Contenido principal */}
                <View className="flex-col items-start justify-center mt-6 px-5">
                    <Text className="text-white font-bold text-3xl mb-3">
                        {movie?.title}
                    </Text>

                    <View className="flex-row items-center gap-x-2 mb-4">
                        <Text className="text-light-200 text-base">
                            {movie?.release_date?.split("-")[0]}
                        </Text>
                        <View className="w-1 h-1 bg-light-200 rounded-full" />
                        <Text className="text-light-200 text-base">
                            {movie?.runtime}m
                        </Text>
                    </View>

                    <View className="flex-row items-center bg-dark-100 px-4 py-2 rounded-full gap-x-2 mb-6">
                        <Image source={icons.star} className="size-5" />
                        <Text className="text-white font-bold text-base">
                            {Math.round(movie?.vote_average ?? 0)}/10
                        </Text>
                        <Text className="text-light-200 text-base">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>

                    <MovieInfo
                        label="Overview"
                        value={movie?.overview}
                        className="text-base leading-6"
                    />

                    <MovieInfo
                        className="mt-6"
                        label="Genres"
                        value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
                            />

                            <View className="flex-row justify-between w-full mt-6">
                            <MovieInfo
                            label="Budget"
                            value={`$${(movie?.budget ?? 0).toLocaleString()}`}
                            className="w-[48%]"
                            />
                            <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(movie?.revenue ?? 0).toLocaleString()}`}
                            className="w-[48%]"
                            />
                            </View>

                            <MovieInfo
                            label="Production Companies"
                            value={
                            movie?.production_companies?.map((c) => c.name).join("\n") || "N/A"
                        }
                        className="mt-6"
                    />
                </View>
            </ScrollView>

            {/* Botón de regreso mejorado */}
            <TouchableOpacity
                className="absolute top-12 left-4 bg-dark-100/90 rounded-full p-2 z-50"
                onPress={() => router.back()}
            >
                <Image
                    source={icons.arrow}
                    className="size-6 rotate-180"
                    tintColor="#fff"
                />
            </TouchableOpacity>
        </View>
    );
};
            export default Details;