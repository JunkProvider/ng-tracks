import { Injectable } from '@angular/core';
import { SuggestionProvider } from './suggestion-provider';
import { Genre } from '../model/genre';
import { GenreProvider } from './genre-provider';

@Injectable()
export class GenreSuggestionProvider extends SuggestionProvider<Genre> {
    constructor(provider: GenreProvider) {
        super(provider, genre => genre.name);
    }
}
