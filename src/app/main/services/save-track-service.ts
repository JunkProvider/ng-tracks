import { HttpClient } from '@angular/common/http';
import { Track } from '../model/track';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {InterpretProvider} from '../providers/interpret-provider';
import {TagTypeProvider} from '../providers/tag-type-provider';
import {GenreProvider} from '../providers/genre-provider';

export interface CreateTrackParameters {
    id: number;
    title: string;
    interprets: string[];
    genres: string[];
    tags: { [index: string]: number; };
    links: string[];
    rating: number;
}

@Injectable()
export class SaveTrackService {
    constructor(
      private readonly httpClient: HttpClient,
      private readonly genreProvider: GenreProvider,
      private readonly interpretProvider: InterpretProvider,
      private readonly tagTypeProvider: TagTypeProvider
    ) {}

    saveTrack(parameters: CreateTrackParameters): Promise<Track> {
        return this.httpClient.post('http://localhost:8080/track/save', parameters).pipe(
            map<{ data: Track }, Track>(data => data.data)
        ).toPromise().then(track => {
          this.clearProviderCaches();
          return track;
        });
    }

  private clearProviderCaches() {
    this.genreProvider.clearCache();
    this.interpretProvider.clearCache();
    this.tagTypeProvider.clearCache();
  }
}
