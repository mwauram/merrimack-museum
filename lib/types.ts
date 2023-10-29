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
