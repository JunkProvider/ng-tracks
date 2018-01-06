import { Component, OnInit } from '@angular/core';
import { Track } from './../../model/track';
import { AppModel } from '../../model/app-model';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.html',
  styleUrls: ['./track-list.css']
})
export class TrackList implements OnInit {
  tracks: Track[] = [];
  selectedTrack: Track = null;
  pageSize: number = null;
  pageIndex = 0;
  pageCount = 1;
  loading = false;

  constructor(private readonly model: AppModel) { }

  ngOnInit() {
    this.model.tracksChangedEvent.add(this, this.updateTracks);
    this.updateTracks();

    this.model.selectedTrackChangedEvent.add(this, this.updateSelectedTrack);
    this.updateSelectedTrack();

    this.model.paginationChangedEvent.add(this, this.updatePagination);
    this.updatePagination();

    this.model.loadingChangedEvent.add(this, this.updateLoading);
    this.updateLoading();

    document.addEventListener('mousewheel', (event: any) => this.scroll(event.wheelData));
    document.addEventListener('DOMMouseScroll', (event: any) => this.scroll(event.detail));

    this.model.loadTracks();
  }

  select(track: Track) {
    this.model.selectTrack(track);
  }

  scroll(delta: number) {
    if (delta > 0) {
      this.model.nextPage();
    } else {
      this.model.previousPage();
    }
  }

  reload() {
    this.model.loadTracks();
  }

  private updateTracks() {
    this.tracks = this.model.tracks;
  }

  private updateSelectedTrack() {
    this.selectedTrack = this.model.selectedTrack;
  }

  private updatePagination() {
    this.pageSize = this.model.pageSize;
    this.pageIndex = this.model.pageIndex;
    this.pageCount = this.model.pageCount;
  }

  private updateLoading() {
    this.loading = this.model.loading;
  }
}
