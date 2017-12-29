import { Link } from './link';

export class IndefiniteLink implements Link {
    readonly url: string;

    get canBeEmbedded() { return false; }
    get embedUrl(): string { throw new Error('Can not embed indefinite link.'); }

    constructor(url: string) {
      this.url = url;
    }

    equals(other: Link): boolean {
      return other instanceof IndefiniteLink && other.url === this.url;
    }
}
