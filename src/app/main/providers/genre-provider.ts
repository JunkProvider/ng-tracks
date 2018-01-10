import {CookieService} from 'angular2-cookie/services/cookies.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Genre } from '../model/genre';
import { appConfig } from '../app.config';

@Injectable()
export class GenreProvider {
		private readonly httpClient: HttpClient;
		private readonly cookie: CookieService;

		private allGenres: Genre[] = null;

		constructor(httpClient: HttpClient, cookie: CookieService) {
				this.httpClient = httpClient;
				this.cookie = cookie;
		}

		getAll(): Promise<Genre[]> {
				if (this.allGenres) {
						return Promise.resolve(this.allGenres);
				}
				return this.httpClient.get<any>(appConfig.api + '/genre').pipe(
						map<{ data: Genre[] }, Genre[]>(data => data.data)
				).toPromise().then(genres => { this.allGenres = genres; return genres; });
		}

		clearCache() {
				this.allGenres = null;
		}
}
