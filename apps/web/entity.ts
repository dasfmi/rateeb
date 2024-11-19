

export type Note = {
    _id?: string;
    title: string;
    type: 'url' | 'email' | 'contact' | 'media+image' | 'media+video' | 'note' | 'location' | 'other';
    tags: string[];

    text?: string;
    description?: string;
    image?: string;
    createdAt?: number;
    // bookmark
    url?: string;
    hostname?: string;
    // contact
    email?: string;
    site?: string;
    github?: string;
    linkedin?: string;
    x?: string; // twitter
    phones?: string[]

    // other flags
    isPinned?: boolean;

    // meta layer
    target?: string;

    // media
    platform?: string;
};

export type Project = {
    _id?: string;
    title: string;
    description?: string;
    // tags: string[];
    notes: string[]
    isDeleted?: boolean;
    createdAt: number;
}