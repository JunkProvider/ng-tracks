import { Link } from './link';

export class YoutubeLink implements Link {
    readonly url: string;
    readonly videoId: string;

    get canBeEmbedded() { return true; }
    get embedUrl() { return 'https://www.youtube.com/embed/' + this.videoId; }

    constructor(url: string, videoId: string) {
      this.url = url;
      this.videoId = videoId;
    }

    equals(other: Link): boolean {
      return other instanceof YoutubeLink && other.url === this.url;
    }
}
