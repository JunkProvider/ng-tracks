import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DeleteTrackService {
    constructor(private readonly httpClient: HttpClient) {}

    deleteTrack(id: number): Promise<void> {
        return this.httpClient.post<void>('http://localhost:8080/track/delete', { id: id }).toPromise();
    }
}