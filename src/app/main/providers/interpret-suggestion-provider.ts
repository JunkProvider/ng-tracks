import { Injectable } from '@angular/core';
import { SuggestionProvider } from './suggestion-provider';
import { Interpret } from '../model/interpret';
import { InterpretProvider } from './interpret-provider';

@Injectable()
export class InterpretSuggestionProvider extends SuggestionProvider<Interpret> {
    constructor(provider: InterpretProvider) {
        super(provider, interpret => interpret.name);
    }
}
