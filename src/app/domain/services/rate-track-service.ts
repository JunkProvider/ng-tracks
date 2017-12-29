import { HttpClient } from '@angular/common/http';
import { Track } from '../model/track';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class RateTrackService {
    constructor(private readonly httpClient: HttpClient) {}

    rateTrack(id: number, rating: number): Promise<Track> {
        return this.httpClient.post('http://localhost:8080/track/rate', { id: id, rating: rating }).pipe(
            map<{ data: Track }, Track>(data => data.data)
        ).toPromise();
    }
}
