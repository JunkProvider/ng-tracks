import { TagTypeProvider } from "../providers/tag-type-provider";
import { Injectable } from "@angular/core";
import { SuggestionProvider } from "./suggestion-provider";
import { TagType } from "../model/tag-type";

@Injectable()
export class TagTypeSuggestionProvider extends SuggestionProvider<TagType> {
    constructor(provider: TagTypeProvider) {
        super(provider, tagType => tagType.name);
    }
}
