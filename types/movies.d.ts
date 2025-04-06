declare global {
    interface Movie {
        id: number;
        title: string;
        poster_path?: string;
        overview?: string;
        release_date?: string;
        vote_average?: number;
        vote_count?: number;
    }

    interface MovieDetails extends Movie {
        runtime?: number;
        genres?: Array<{ id: number; name: string }>;
        budget?: number;
        revenue?: number;
        production_companies?: Array<{ id: number; name: string }>;
    }
}

export {};