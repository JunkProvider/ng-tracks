import { Component, OnInit } from '@angular/core';
import { Track } from './../../model/track';
import { AppModel } from '../../model/app-model';
import { del } from 'selenium-webdriver/http';

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


  constructor(private readonly model: AppModel) { }

  ngOnInit() {
    this.tracks = this.model.tracks;
    this.model.tracksChangedEvent.add(this, () => this.tracks = this.model.tracks);
    this.model.loadTracks();

    this.selectedTrack = this.model.selectedTrack;
    this.model.selectedTrackChangedEvent.add(this, () => this.selectedTrack = this.model.selectedTrack);

    this.pageSize = this.model.pageSize;
    this.pageIndex = this.model.pageIndex;

    document.addEventListener('mousewheel', (event: any) => this.scroll(event.wheelData));
    document.addEventListener('DOMMouseScroll', (event: any) => this.scroll(event.detail));
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
}
