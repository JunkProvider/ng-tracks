import { Injectable } from '@angular/core';
import { LinkDto } from './dtos/link-dto';
import { Link } from '../model/link';
import { LinkParser } from '../services/link-parser';

@Injectable()
export class LinkDeserializer {
  constructor(private readonly linkParser: LinkParser) {}

  deserialize(linkDto: LinkDto): Link {
    return this.linkParser.parse(linkDto.url);
  }
}
