import { Component, OnInit } from '@angular/core';
import { Track } from './../../model/track';
import { AppModel } from './../../app-model';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.html',
  styleUrls: ['./track-list.css']
})
export class TrackList implements OnInit {
  tracks: Track[] = [];
  selectedTrack: Track = null;

  constructor(private readonly model: AppModel) { }

  ngOnInit() {
    this.tracks = this.model.tracks;
    this.model.tracksChangedEvent.add(this, () => this.tracks = this.model.tracks);
    this.model.loadTracks();
    
    this.selectedTrack = this.model.selectedTrack;
    this.model.selectedTrackChangedEvent.add(this, () => this.selectedTrack = this.model.selectedTrack);
  }

  select(track: Track) {
    this.model.selectTrack(track);
  }
}
