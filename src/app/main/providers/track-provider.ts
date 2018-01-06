import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { FilterData } from '../model/filter';
import { TrackDeserializer } from './track-deserializer';
import { Track } from '../model/track';
import { TrackDto } from './dtos/track-dto';
import { appConfig } from '../app.config';
import { PagedQueryResult } from './paged-query-result';

 @Injectable()
export class TrackProvider {
    constructor(private readonly httpClient: HttpClient, private readonly trackDeserializer: TrackDeserializer) {}

    getBy(filters: FilterData<any>[], offset: number, limit: number): Promise<PagedQueryResult<Track>> {
        const params = new HttpParams()
          .set('filters', JSON.stringify(filters))
          .set('offset', JSON.stringify(offset))
          .set('limit', JSON.stringify(limit));
        return this.httpClient.get<any>(appConfig.api + '/track', { params: params }).pipe(
            map<{ data: PagedQueryResult<TrackDto> }, PagedQueryResult<Track>>(data => this.deserializePagedResult(data.data))
        ).toPromise();
    }

    private deserializePagedResult(result: PagedQueryResult<TrackDto>): PagedQueryResult<Track> {
      return {
        items: result.items.map(trackDto => this.trackDeserializer.deserialize(trackDto)),
        totalCount: result.totalCount
      };
    }
}
