import { Interpret } from './interpret';
import { Genre } from './genre';
import { Link } from './link';
import { Tag } from './tag';

export class Track {
	constructor(
		readonly id: number,
		readonly title: string,
		readonly interprets: Interpret[],
		readonly genres: Genre[],
		readonly tags: Tag[],
		readonly links: Link[],
		readonly rating: number
	) {}

	hasEmbedLink() {
		return this.findFirstEmbedLink() != null;
	}

	getFirstEmbedLink() {
		const embedLink = this.findFirstEmbedLink();
		if (!embedLink) {
			throw new Error('Can not get first embed link. Track has no embed links.');
		}
		return embedLink;
	}

	private findFirstEmbedLink() {
		return this.links.find(link => link.canBeEmbedded);
	}
}

export const EMPTY_TRACK = new Track(null, '', [], [], [], [], null);
