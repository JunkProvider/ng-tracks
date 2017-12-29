import { Component, OnInit } from '@angular/core';
import { EMPTY_TRACK } from '../../model/track';
import { AppModel } from '../../app-model';
import { SaveTrackService } from '../../services/save-track-service';
import { DeleteTrackService } from '../../services/delete-track-service';
import { TagTypeSuggestionProvider } from '../../providers/tag-type-suggestion-provider';
import { InterpretSuggestionProvider } from '../../providers/interpret-suggestion-provider';
import { GenreSuggestionProvider } from '../../providers/genre-suggestion-provider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LinkParser } from '../../services/link-parser';
import { RateTrackService } from '../../services/rate-track-service';
import { Link } from '../../model/link';

export interface TagState {
  name: string;
  value: string;
}

export interface TrackState {
  id: number;
  title: string;
  interpret: string;
  genre: string;
  tags: TagState[];
  links: string[];
  joinedLinks: string;
  rating: number;
}

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.html',
  styleUrls: ['./track-details.css']
})
export class TrackDetails implements OnInit {
  ratingOptions = [
    { description: 'Not my Taste.' },
    { description: 'It\'s ok, like listening to it.' },
    { description: 'Pretty good Music.' },
    { description: 'Blin this is good.' },
    { description: 'Awesome. One of my Favourites!' }
  ];
  unchangedTrack: TrackState = null;
  track: TrackState = null;
  embedUrl: SafeResourceUrl = null;
  editing: boolean = false;
  changed: boolean = false;
  valid: boolean = true;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly linkParser: LinkParser,
    private readonly saveTrackService: SaveTrackService,
    private readonly rateTrackService: RateTrackService,
    private readonly deleteTrackService: DeleteTrackService,
    private readonly interpretSuggestionProvider: InterpretSuggestionProvider,
    private readonly genreSuggestionProvider: GenreSuggestionProvider,
    private readonly tagTypeSuggetionProvider: TagTypeSuggestionProvider,
    private readonly model: AppModel
  ) { }

  ngOnInit() {
    this.model.selectedTrackChangedEvent.add(this, this.update);
    this.update();
  }

  onTitleChanged(title: string) {
    this.track.title = title;
    this.onChangedByUser();
  }

  onInterpretChanged(interpretText: string) {
    this.track.interpret = interpretText;
    this.onChangedByUser();
  }

  onGenreChanged(genreText: string) {
    this.track.genre = genreText;
    this.onChangedByUser();
  }

  onTagNameChanged(index: number, name: string) {
    this.track.tags[index].name = name;
    this.updateTags(index);
  }

  onTagValueChanged(index: number, value: string) {
    this.track.tags[index].value = value;
    this.updateTags();
  }

  updateTags(focused = -1) {
    const tags = this.track.tags;
    for (let i = 0; i < tags.length;) {
      const tag = tags[i];
      const tagFocused = i === focused;
      const tagEmpty = tag.name.length === 0 && tag.value.length === 0;
      if (!tagFocused && tagEmpty) {
        tags.splice(i, 1);
        if (focused > i) {
          focused--;
        }
      } else {
        i++;
      }
    }
    const focusedTag = tags[focused];
    const lastFocusedAndEmpty = focusedTag && (focusedTag.name.length === 0 && focusedTag.value.length === 0) && focused === tags.length - 1;
    if (!lastFocusedAndEmpty && this.editing) {
      tags.push({ name: '', value: '' });
    }
    this.onChangedByUser();
  }

  validateTagValue(index: number) {
    const tag = this.track.tags[index];
    let value = parseInt(tag.value.trim());
    if (value == null || isNaN(value) || !isFinite(value) || value < 1) {
      tag.value = '';
    }
    this.onChangedByUser();
  }

  onLinksChanged(linksText: string) {
    this.track.joinedLinks = linksText.trim();
    this.track.links = this.splitLinks(linksText);
    this.updateEmbedLink();
    this.onChangedByUser();
  }

  onChangedByUser() {
    this.changed = true;/*
      this.track.title.trim() != this.unchangedTrack.title.trim()
      || this.track.interpret.trim() != this.unchangedTrack.interpret.trim()
      || this.track.genre.trim() != this.unchangedTrack.genre.trim()
      || this.track.joinedLinks.trim() != this.unchangedTrack.joinedLinks.trim();*/
    this.valid = this.track.title.trim().length > 0;
  }

  new() {
    this.model.selectTrack(EMPTY_TRACK);
  }

  edit() {
    this.editing = true;
    this.updateTags();
  }

  save() {
    const tags: { [index: string]: number; } = {};
    for (const tagState of this.track.tags) {
      const name = tagState.name.trim();
      if (name.length === 0) {
        continue;
      }
      const value = parseInt(tagState.value);
      if (value == null || isNaN(value) || !isFinite(value) || value < 1) {
        continue;
      }
      tags[name] = value;
    }

    this.saveTrackService.saveTrack({
      id: this.track.id,
      title: this.track.title,
      interprets: this.track.interpret.split(',').map(interpret => interpret.trim()).filter(interpret => interpret && interpret.length > 0),
      genres: this.track.genre.split(',').map(genre => genre.trim()).filter(genre => genre && genre.length > 0),
      tags: tags,
      links: this.track.links,
      rating: this.track.rating
    }).then((savedTrack) => this.model.loadTracks().then(() => this.model.selectTrack(savedTrack)));

    this.editing = false;

    this.updateTags();
  }

  discard() {
    this.editing = false;
    this.update();
  }

  delete() {
    this.deleteTrackService.deleteTrack(this.track.id).then(() => this.model.loadTracks());
  }

  rate(rating: number) {
    this.track.rating = rating;
    if (this.track.id) {
      this.rateTrackService.rateTrack(this.track.id, rating).then(() => this.model.loadTracks());
    }
  }

  private update() {
    const track = this.model.selectedTrack;

    this.track = {
      id: track.id,
      title: track.title,
      interpret: track.interprets.map(interpret => interpret.name).join(', '),
      genre: track.genres.map(genre => genre.name).join(', '),
      tags: track.tags.map(tag => ({ name: tag.type.name, value: tag.value.toFixed(0) })),
      links: track.links.map(link => link.url),
      joinedLinks: this.joinLinks(track.links.map(link => link.url)),
      rating: track.rating
    };
    this.track.tags.push({ name: '', value: '' });

    this.unchangedTrack = Object.assign({}, this.track);
    this.changed = false;
    this.editing = !this.track.id;

    this.updateEmbedLink();
    this.updateTags();
  }

  private updateEmbedLink() {
    const embedLink = this.track.links
      .map(urlStr => this.linkParser.parse(urlStr))
      .find(link => link.canBeEmbedded);

    console.log(embedLink, this.embedUrl);

    if (!embedLink) {
      this.embedUrl = null;
      return;
    }

    if (this.embedUrl && embedLink.url === this.embedUrl.toString()) {
      return;
    }

    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedLink.embedUrl);
  }

  private splitLinks(text: string) {
    return text.split(/[\n\t ]/g).map(link => link.trim()).filter(link => link && link.length > 0);
  }

  private joinLinks(links: string[]) {
    return links.join('\n');
  }
}
