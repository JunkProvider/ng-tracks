import {CookieService} from 'angular2-cookie/services/cookies.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { TagType } from '../model/tag-type';
import { appConfig } from '../app.config';

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
        return this.httpClient.get<any>(appConfig.api + '/tag-type').pipe(
            map<{ data: TagType[] }, TagType[]>(data => data.data)
        ).toPromise().then(tagTypes => { this.allTagTypes = tagTypes; return tagTypes; });
    }

    clearCache() {
        this.allTagTypes = null;
    }
}
