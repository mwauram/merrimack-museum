import { createContext, useContext } from "react";

export interface LinkProps {
    link: string;
    label: string;
    auth: string | null;
    links?: { link: string, label: string, auth: string | null }[] | null;
}


export interface Artwork {
    artwork_id: string;
    title: string;
    creation_date: string;
    description: string;
    artist: string;
    category: string | null;
    location: string | null;
    donor: string | null;
};

export interface DjangoImage {
    image_id: string;
    artwork: string
    cover: string,
    description: string | null,
}

interface ArtworkContextType {
    artwork: Artwork[];
    map: Map<string, DjangoImage[]>
    addArtwork: (newArtwork: Artwork) => void;
    setMap: (map: Map<string, DjangoImage[]>) => void;
}

export const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const useArtwork = () => {
    const context = useContext(ArtworkContext);
    if (!context) {
        throw new Error('useArtwork must be used within an ArtworkProvider');
    }
    return context;
};
