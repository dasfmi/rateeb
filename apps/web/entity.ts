

export type Note = {
    _id?: string;
    title: string;
    type: 'url' | 'email' | 'person' | 'image' | 'video' | 'note' | 'location' | 'other';
    tags: string[];

    text?: string;
    description?: string;
    image?: string;
    createdAt?: number;
    // bookmark
    url?: string;
    hostname?: string;
    // person
    name?: string;
    email?: string;
    site?: string;
    github?: string;
    linkedin?: string;

    // other flags
    isPinned?: boolean;

    // meta layer
    target?: string;
};
