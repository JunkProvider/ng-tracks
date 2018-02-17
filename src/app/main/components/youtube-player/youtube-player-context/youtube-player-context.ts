import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as youtubeIFrameLoader from 'youtube-iframe';
import { YoutubeVideoData } from '../youtube-vido-data';

@Component({
  selector: 'app-youtube-player-context',
  templateUrl: './youtube-player-context.html',
  styleUrls: ['./youtube-player-context.css']
})
export class YoutubePlayerContext implements OnInit {
  private static nextIFrameNumber = 0;

  @Output()
  readonly videoLoaded = new EventEmitter<YoutubeVideoData>();

  iFrameNumber: number;

  private player: any = null;
  private playerReady = false;
  private _videoId: string = null;

  get videoId() { return this._videoId; }

  @Input()
  set videoId(videoId: string) { this.setVideoId(videoId); }

  constructor() {
    this.iFrameNumber = YoutubePlayerContext.nextIFrameNumber++;
  }

  ngOnInit() {

  }

  private setVideoId(videoId: string) {
    const prevVideoId = this.videoId;
    if (videoId === prevVideoId) {
      return;
    }
    this._videoId = videoId;
    this.createPlayer();
  }

  private createPlayer() {
    this.destroyPlayer();

    this.playerReady = false;

    if (this.player === null) {
      youtubeIFrameLoader.load(youtube => {
        this.player = new youtube.Player('youtube-player-iframe-' + this.iFrameNumber, {
          height: '100%',
          width: '100%',
          videoId: this.videoId,
          events: {
            onReady: () => this.onPlayerReady()
          }
        });
      });
    } else {
      this.player.loadVideoById(this.videoId);
      this.onPlayerReady();
    }
  }

  private destroyPlayer() {
    if (!this.player) {
      return;
    }
  }

  private onPlayerReady() {
    this.videoLoaded.next(this.player.getVideoData());
    this.playerReady = true;
  }
}
