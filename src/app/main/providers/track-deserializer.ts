import { Injectable } from '@angular/core';
import { LinkDeserializer } from './link-deserializer';
import { TrackDto } from './dtos/track-dto';
import { Track } from '../model/track';

@Injectable()
export class TrackDeserializer {
		constructor(private readonly linkDeserializer: LinkDeserializer) {}

		deserialize(trackDto: TrackDto): Track {
			return new Track(
				trackDto.id,
				trackDto.title,
				trackDto.interprets,
				trackDto.genres,
				trackDto.tags,
				trackDto.links.map(linkDto => this.linkDeserializer.deserialize(linkDto)),
				trackDto.rating
			);
		}
}
