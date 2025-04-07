import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React from 'react';
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    const { width } = useWindowDimensions();
    // Calculate dynamic width based on screen size
    const cardWidth = width < 640 ? "w-[30%]" : width < 1024 ? "w-[22%]" : "w-[18%]";
    const imageHeight = width < 640 ? "h-44" : "h-52";

    return (
        <Link href={`/movie/${id}` as any} asChild>
        <TouchableOpacity className={`${cardWidth} mb-4`}>
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                    }}
                    className={`w-full ${imageHeight} rounded-lg`}
                    resizeMode="cover"
                />

                <Text className="text-sm font-bold text-white mt-2"
                      numberOfLines={1}>
                    {title}
                </Text>

                <View className="flex-row items-center justify-start gap-x-1">
                    <Image source={icons.star} className="size-4" />
                    <Text className="text-xs text-white font-bold uppercase">
                        {Math.round(vote_average / 2)}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-light-300 font-medium mt-1">
                        {release_date?.split('-')[0] || 'N/A'}
                    </Text>
                    <Text className="text-xs text-light-300 font-medium uppercase">
                        Movie
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;