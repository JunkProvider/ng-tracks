import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { FilterData } from '../model/filter';
import { TrackDeserializer } from './track-deserializer';
import { Track } from '../model/track';
import { TrackDto } from './dtos/track-dto';

 @Injectable()
export class TrackProvider {
    constructor(private readonly httpClient: HttpClient, private readonly trackDeserializer: TrackDeserializer) {}

    getBy(filters: FilterData<any>[]): Promise<Track[]> {
        const params = new HttpParams().set('filters', JSON.stringify(filters));
        return this.httpClient.get<any>('http://localhost:8080/track', { params: params }).pipe(
            map<{ data: TrackDto[] }, Track[]>(data => data.data.map(trackDto => this.trackDeserializer.deserialize(trackDto)))
        ).toPromise();
    }
}
