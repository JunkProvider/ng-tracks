import { Track, EMPTY_TRACK } from './track';
import { TrackProvider } from '../providers/track-provider';
import { Injectable } from '@angular/core';
import { createNewFilter, Filter, FilterData } from './filter';
import {Event, Timeout} from '@junkprovider/common';
import {GenreProvider} from '../providers/genre-provider';
import {InterpretProvider} from '../providers/interpret-provider';
import {TagTypeProvider} from '../providers/tag-type-provider';
import { CookieService } from 'angular2-cookie/core';
import { filterDefinitions } from './filter-definitions';

@Injectable()
export class AppModel {
    readonly tracksChangedEvent = new Event<void>();
    readonly selectedTrackChangedEvent = new Event<void>();
    readonly filtersChangedEvent = new Event<void>();
    readonly selectedFilterChangedEvent = new Event<void>();

    private loadTracksDelay = new Timeout(2000);
    private _tracks: Track[] = [];
    private _selectedTrack: Track = EMPTY_TRACK;
    private _filters: Filter[] = [];
    private _selectedFilter: Filter = null;

    get tracks() { return this._tracks.slice(); }
    get selectedTrack() { return this._selectedTrack; }
    get filters() { return this._filters.slice(); }
    get selectedFilter() { return this._selectedFilter; }

    constructor(
      private readonly cookies: CookieService,
      private readonly trackProvider: TrackProvider
    ) {
      this.loadTracksDelay.expiredEvent.add(this, this.loadTracks);
      this.loadFilters();
    }

    loadTracksAfterDelay() {
        this.loadTracksDelay.start();
    }

    loadTracks(): Promise<void> {
        this.loadTracksDelay.stop();
        const prevSelectedTrackId = this.selectedTrack ? this.selectedTrack.id : null;
        let selectedTrackChanged = false;
        return this.trackProvider.getBy(this.filters.map(filter => filter.getData())).then(tracks => {
            let selectedTrack = tracks.find(track => track.id === prevSelectedTrackId);
            if (!selectedTrack) {
                selectedTrack = EMPTY_TRACK;
                selectedTrackChanged = true;
            }
            this._tracks = tracks;
            this._selectedTrack = selectedTrack;
            this.tracksChangedEvent.trigger(this, null);
            if (selectedTrackChanged) {
                this.selectedTrackChangedEvent.trigger(this, null);
            }
        });
    }

    selectTrack(track: Track) {
        this._selectedTrack = track;
        this.selectedTrackChangedEvent.trigger(this, null);
    }

    createAndAddNewFilter() {
        const filter = createNewFilter();
        filter.changedEvent.add(this, this.onFilterChanged);
        this._filters.push(filter);
        this._selectedFilter = filter;
        this.filtersChangedEvent.trigger(this, null);
        this.selectedFilterChangedEvent.trigger(this, null);
        this.loadTracksAfterDelay();
        this.saveFilters();
    }

    removeFilter(filter: Filter) {
        const index = this._filters.indexOf(filter);
        if (index === -1) {
            return;
        }
        filter.changedEvent.remove(this, this.onFilterChanged);
        this._filters.splice(index, 1);
        this.filtersChangedEvent.trigger(this, null);
        if (this._selectedFilter === filter) {
            this._selectedFilter = null;
            this.selectedFilterChangedEvent.trigger(this, null);
        }
        this.loadTracksAfterDelay();
        this.saveFilters();
    }

    selectFilter(filter: Filter) {
        this._selectedFilter = filter;
        this.selectedFilterChangedEvent.trigger(this, null);
    }

    private onFilterChanged() {
        this.loadTracksAfterDelay();
        this.saveFilters();
    }

    private loadFilters() {
      const filterCookie = <any>this.cookies.getObject('filters');
      if (!filterCookie) {
        return;
      }
      const filterData = <FilterData<string>[]>filterCookie.data;
      this._filters = filterData.map(filterDatum => Filter.fromData(filterDefinitions, filterDatum));
      this.filtersChangedEvent.trigger(this, null);
    }

    private saveFilters() {
      const filterData = this.filters.map(filter => filter.getData());
      const filterCookie = { data: filterData };
      this.cookies.putObject('filters', filterCookie);
    }
}
