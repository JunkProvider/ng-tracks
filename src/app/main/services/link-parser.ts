import { Injectable } from '@angular/core';
import { Link } from '../model/link';
import { IndefiniteLink } from '../model/indefinite-link';
import { YoutubeLink } from '../model/youtube-link';

@Injectable()
export class LinkParser {
	parse(urlStr: string): Link {
		const ucUrlStr = urlStr.trim().toUpperCase();
		const url = new URL(urlStr);

		if (ucUrlStr.startsWith('https://www.youtube.com/watch'.toUpperCase())) {
			const videoId = url.searchParams.get('v');
			return new YoutubeLink(urlStr, videoId);
		}

		const ucEmbedUrlStart = 'https://www.youtube.com/embed/'.toUpperCase();
		if (ucUrlStr.startsWith(ucEmbedUrlStart)) {
			const videoId = ucUrlStr.substring(ucEmbedUrlStart.length);
			return new YoutubeLink(urlStr, videoId);
		}

		return new IndefiniteLink(urlStr);
	}
}
