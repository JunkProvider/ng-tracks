import { Interpret } from '../../model/interpret';
import { Genre } from '../../model/genre';
import { Tag } from '../../model/tag';
import { LinkDto } from './link-dto';

export interface TrackDto {
		readonly id: number;
		readonly title: string;
		readonly interprets: Interpret[];
		readonly genres: Genre[];
		readonly tags: Tag[];
		readonly links: LinkDto[];
		readonly rating: number;
}
