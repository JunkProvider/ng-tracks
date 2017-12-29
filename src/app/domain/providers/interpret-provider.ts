import {CookieService} from 'angular2-cookie/services/cookies.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import { Track } from './../model/track';
import { FilterData } from '../model/filter';
import { Interpret } from '../model/interpret';

 @Injectable()
export class InterpretProvider {
    private readonly httpClient: HttpClient;
    private readonly cookie: CookieService;

    private allInterprets: Interpret[] = null;

    constructor(httpClient: HttpClient, cookie: CookieService) {
        this.httpClient = httpClient;
        this.cookie = cookie;
    }

    getAll(): Promise<Interpret[]> {
        if (this.allInterprets) {
            return Promise.resolve(this.allInterprets);
        }
        return this.httpClient.get<any>('http://localhost:8080/interpret').pipe(
            map<{ data: Interpret[] }, Interpret[]>(data => data.data)
        ).toPromise().then(interprets => { this.allInterprets = interprets; return interprets; });
    }

    clearCache() {
        this.allInterprets = null;
    }
}
