import { Component, OnInit } from '@angular/core';
import { AppModel } from '../../model/app-model';
import { Filter } from '../../model/filter';
import { filterDefinitions, filterDefinitionsAsArray } from '../../model/filter-definitions';
import {GenreSuggestionProvider} from '../../providers/genre-suggestion-provider';
import {TagTypeSuggestionProvider} from '../../providers/tag-type-suggestion-provider';
import { InterpretSuggestionProvider } from '../../providers/interpret-suggestion-provider';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.html',
  styleUrls: ['./filter-section.css']
})
export class FilterSection implements OnInit {
  filterDefinitions = filterDefinitions;
  filterDefinitionsAsArray = filterDefinitionsAsArray;

  filters: Filter[] = [];
  selectedFilter: Filter = null;

  constructor(
    readonly interpretSuggestionProvider: InterpretSuggestionProvider,
    readonly genreSuggestionProvider: GenreSuggestionProvider,
    readonly tagTypeSuggetionProvider: TagTypeSuggestionProvider,
    private readonly model: AppModel
  ) { }

  ngOnInit() {
    this.model.filtersChangedEvent.add(this, this.update);
    this.model.selectedFilterChangedEvent.add(this, this.update);
    this.update();
  }

  onTypeChanged(type: string) {
    this.selectedFilter.type = type;
  }

  onOperatorChanged(operator: string) {
    this.selectedFilter.operator = operator;
  }

  onValueChanged(value: any) {
    this.selectedFilter.value = value;
  }

  select(filter: Filter) {
    this.model.selectFilter(filter);
  }

  add() {
    this.model.createAndAddNewFilter();
  }

  remove(filter: Filter) {
    this.model.removeFilter(filter);
  }

  apply() {
    this.model.loadTracks();
  }

  private update() {
    this.filters = this.model.filters;
    this.selectedFilter = this.model.selectedFilter;
  }
}
