import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { useLayout } from '@/types/layoutContext';

interface MovieCardProps {
    id: string;
    title: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
}

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: MovieCardProps) => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const layout = useLayout();

    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const formattedDate = release_date
        ? new Date(release_date).getFullYear()
        : '';

    const handlePress = () => {
        router.push(`/movie/${id}`);
    };

    // Calculate card width based on layout context
    const cardWidth = () => {
        const spacing = layout.horizontalPadding * 2;
        const availableWidth = (width - (spacing * (layout.columns + 1))) / layout.columns;
        return availableWidth;
    };

    // Calculate image height based on aspect ratio
    const imageHeight = () => {
        return cardWidth() * 1.5; // 3:4 aspect ratio
    };

    // Dynamic font sizes
    const titleFontSize = layout.isSmallDevice ? 12 : layout.isTablet ? 14 : 16;
    const metaFontSize = layout.isSmallDevice ? 10 : layout.isTablet ? 11 : 12;

    return (
        <Link href={`/movie/${id}` as any} asChild>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={{
                    width: cardWidth(),
                    height: layout.isSmallDevice ? 220 : 260,
                }}
            >
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                    }}
                    style={{
                        width: '100%',
                        height: imageHeight(),
                        borderRadius: 8
                    }}
                    resizeMode="repeat"
                />

                <Text
                    style={{
                        fontSize: titleFontSize,
                        fontWeight: 'bold',
                        color: 'white',
                        marginTop: 8
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <Image
                        source={icons.star}
                        style={{ width: 16, height: 16 }}
                    />
                    <Text style={{
                        fontSize: metaFontSize,
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                    }}>
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 4
                }}>
                    <Text style={{
                        fontSize: metaFontSize,
                        color: '#d1d5db', // light-300 equivalent
                        fontWeight: '500'
                    }}>
                        {release_date?.split('-')[0] || 'N/A'}
                    </Text>
                    <Text style={{
                        fontSize: metaFontSize,
                        color: '#d1d5db', // light-300 equivalent
                        fontWeight: '500',
                        textTransform: 'uppercase'
                    }}>
                        Movie
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;