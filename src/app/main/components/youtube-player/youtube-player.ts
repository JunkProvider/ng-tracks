import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { YoutubeVideoData } from './youtube-vido-data';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.html',
  styleUrls: ['./youtube-player.css']
})
export class YoutubePlayer implements OnInit {
  private _videoId: string = null;

  @Output()
  readonly videoLoaded = new EventEmitter<YoutubeVideoData>();

  get videoId() { return this._videoId; }

  @Input()
  set videoId(videoId: string) { this.setVideoId(videoId); }

  ngOnInit() {

  }

  private setVideoId(videoId: string) {
    const prevVideoId = this.videoId;
    if (videoId === prevVideoId) {
      return;
    }
    this._videoId = videoId;
  }
}
