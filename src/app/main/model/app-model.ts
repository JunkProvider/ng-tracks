import { Track, EMPTY_TRACK } from './track';
import { TrackProvider } from '../providers/track-provider';
import { Injectable } from '@angular/core';
import { createNewFilter, Filter, FilterData } from './filter';
import { Event, Timeout } from '@junkprovider/common';
import { CookieService } from 'angular2-cookie/core';
import { filterDefinitions } from './filter-definitions';
import { PagedQueryResult } from '../providers/paged-query-result';

@Injectable()
export class AppModel {
	readonly tracksChangedEvent = new Event<void>();
	readonly selectedTrackChangedEvent = new Event<void>();
	readonly filtersChangedEvent = new Event<void>();
	readonly selectedFilterChangedEvent = new Event<void>();
	readonly searchTextChangedEvent = new Event<void>();
	readonly paginationChangedEvent = new Event<void>();
	readonly loadingChangedEvent = new Event<void>();

	private loadTracksDelay = new Timeout(2000);
	private _tracks: Track[] = [];
	private _selectedTrack = EMPTY_TRACK;
	private _filters: Filter[] = [];
	private _selectedFilter: Filter = null;
	private _searchText = '';
	private _pageSize = 10;
	private _pageIndex = 0;
	private _totalCount = 0;
	private _loading = 0;
	private _invalid = false;

	get tracks() {
		return this._tracks.slice();
	}

	get selectedTrack() {
		return this._selectedTrack;
	}

	get filters() {
		return this._filters.slice();
	}

	get selectedFilter() {
		return this._selectedFilter;
	}

	get searchText() {
		return this._searchText;
	}

	get pageSize() {
		return this._pageSize;
	}

	get pageIndex() {
		return this._pageIndex;
	}

	get pageCount() {
		return Math.max(1, Math.ceil(this._totalCount / this._pageSize));
	}

	get totalCount() {
		return this._totalCount;
	}

	get loading() {
		return this._loading > 0;
	}

	get invalid() {
		return this._invalid;
	}

	constructor(private readonly cookies: CookieService, private readonly trackProvider: TrackProvider) {
		this.loadTracksDelay.expiredEvent.add(this, this.loadTracks);
		this.loadFilters();
	}

	loadTracksAfterDelay() {
		this.loadTracksDelay.start();
	}

	loadTracks(): Promise<void> {
		this.loadTracksDelay.stop();

		const filters = this.filters.map(filter => filter.getData());
		const promise = this.trackProvider.getBy(filters, this.searchText, this.pageIndex * this.pageSize, this.pageSize).then(result => {
			this.onTracksLoaded(result);
			return null;
		});

		const loadingChanged = !this.loading;
		this._loading++;
		if (loadingChanged) {
			this.loadingChangedEvent.trigger(this, null);
		}

		return promise;
	}

	private onTracksLoaded(result: PagedQueryResult<Track>) {
		this._tracks = result.items;
		this._totalCount = result.totalCount;
		this._pageIndex = Math.min(this.pageIndex, this.pageCount - 1);

		this.tracksChangedEvent.trigger(this, null);
		this.paginationChangedEvent.trigger(this, null);

		this._loading--;
		if (!this.loading) {
			this.loadingChangedEvent.trigger(this, null);
		}
	}

	selectTrack(track: Track) {
		this._selectedTrack = track;
		this.selectedTrackChangedEvent.trigger(this, null);
	}

	createAndAddNewFilter() {
		const filter = createNewFilter();
		this.addFilter(filter);
	}

	private addFilter(filter: Filter) {
		filter.changedEvent.add(this, this.onFiltersChanged);
		this._filters.push(filter);
		this._selectedFilter = filter;
		this.filtersChangedEvent.trigger(this, null);
		this.selectedFilterChangedEvent.trigger(this, null);
		this.onFiltersChanged();
	}

	removeFilter(filter: Filter) {
		const index = this._filters.indexOf(filter);
		if (index === -1) {
			return;
		}
		filter.changedEvent.remove(this, this.onFiltersChanged);
		this._filters.splice(index, 1);
		this.filtersChangedEvent.trigger(this, null);
		if (this._selectedFilter === filter) {
			this._selectedFilter = null;
			this.selectedFilterChangedEvent.trigger(this, null);
		}
		this.onFiltersChanged();
	}

	selectFilter(filter: Filter) {
		this._selectedFilter = filter;
		this.selectedFilterChangedEvent.trigger(this, null);
	}

	setSearchTest(text: string) {
		this._searchText = text;
		this.loadTracks();
		this.searchTextChangedEvent.trigger(this, null);
	}

	setPageSize(pageSize: number) {
		if (pageSize === this._pageSize) {
			return;
		}
		this._pageSize = pageSize;
		this.loadTracks();
	}

	nextPage() {
		if (this.pageIndex === this.pageCount - 1) {
			return;
		}
		this._pageIndex++;
		this.loadTracks();
		this.paginationChangedEvent.trigger(this, null);
	}

	previousPage() {
		if (this.pageIndex === 0) {
			return;
		}
		this._pageIndex--;
		this.loadTracks();
		this.paginationChangedEvent.trigger(this, null);
	}

	private onFiltersChanged() {
		this.saveFilters();
		// this._pageIndex = 0;
		this.paginationChangedEvent.trigger(this, null);
	}

	private loadFilters() {
		const filterCookie = <any>this.cookies.getObject('filters');
		if (!filterCookie) {
			return;
		}
		const filterData = <FilterData<string>[]>filterCookie.data;
		filterData
			.map(filterDatum => Filter.fromData(filterDefinitions, filterDatum))
			.forEach(filter => this.addFilter(filter));
	}

	private saveFilters() {
		const filterData = this.filters.map(filter => filter.getData());
		const filterCookie = { data: filterData };
		this.cookies.putObject('filters', filterCookie);
	}
}
