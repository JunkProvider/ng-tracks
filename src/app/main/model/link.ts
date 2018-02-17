export interface Link {
    readonly url: string;
    readonly canBeEmbedded: boolean;
    readonly embedUrl: string;

    equals(other: Link): boolean;
}
