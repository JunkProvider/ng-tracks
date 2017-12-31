import {CookieService} from 'angular2-cookie/services/cookies.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Track } from './../model/track';
import { FilterData } from '../model/filter';
import { TagType } from '../model/tag-type';

 @Injectable()
export class TagTypeProvider {
    private readonly httpClient: HttpClient;
    private readonly cookie: CookieService;

    private allTagTypes: TagType[] = null;

    constructor(httpClient: HttpClient, cookie: CookieService) {
        this.httpClient = httpClient;
        this.cookie = cookie;
    }

    getAll(): Promise<TagType[]> {
        if (this.allTagTypes) {
            return Promise.resolve(this.allTagTypes);
        }
        return this.httpClient.get<any>('http://localhost:8080/tag-type').pipe(
            map<{ data: TagType[] }, TagType[]>(data => data.data)
        ).toPromise().then(tagTypes => { this.allTagTypes = tagTypes; return tagTypes; });
    }

    clearCache() {
        this.allTagTypes = null;
    }
}
