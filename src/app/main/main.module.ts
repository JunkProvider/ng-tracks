import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '../common/common.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { TrackProvider } from './providers/track-provider';
import { SaveTrackService } from './services/save-track-service';
import { DeleteTrackService } from './services/delete-track-service';
import { TrackList } from './components/track-list/track-list';
import { TrackDetails } from './components/track-details/track-details';
import { AppModel } from './model/app-model';
import { NavigationBar } from './components/navigation-bar/navigation-bar';
import { FilterSection } from './components/filter-section/filter-section';
import { OperatorSelect } from './components/filter-section/operator-select/operator-select';
import { TagTypeProvider } from './providers/tag-type-provider';
import { TagTypeSuggestionProvider } from './providers/tag-type-suggestion-provider';
import { InterpretProvider } from './providers/interpret-provider';
import { GenreProvider } from './providers/genre-provider';
import { InterpretSuggestionProvider } from './providers/interpret-suggestion-provider';
import { GenreSuggestionProvider } from './providers/genre-suggestion-provider';
import { TrackDeserializer } from './providers/track-deserializer';
import { LinkDeserializer } from './providers/link-deserializer';
import { LinkParser } from './services/link-parser';
import { RateTrackService } from './services/rate-track-service';
import { YoutubePlayer } from './components/youtube-player/youtube-player';
import { YoutubePlayerContext } from './components/youtube-player/youtube-player-context/youtube-player-context';
import { Page } from './page';
import { CommonModule as NgCommonModule } from '@angular/common';
import { YoutubeVideoTitleInterpreter } from './services/youtube-video-title-interpreter';
import { LoadingIndicator } from '../common/components/loading-indicator/loading-indicator';
import { FocusDirective } from './directives/focus-directive';

@NgModule({
  declarations: [
    Page,
    NavigationBar,
    FilterSection,
    OperatorSelect,
    TrackList,
    TrackDetails,
    YoutubePlayer,
    YoutubePlayerContext,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    NgCommonModule,
    CommonModule
  ],
  exports: [
    Page
  ],
  providers: [
    CookieService,
    AppModel,
    LinkParser,
    LinkDeserializer,
    TrackDeserializer,
    TrackProvider,
    InterpretProvider,
    GenreProvider,
    TagTypeProvider,
    SaveTrackService,
    RateTrackService,
    DeleteTrackService,
    InterpretSuggestionProvider,
    GenreSuggestionProvider,
    TagTypeSuggestionProvider,
    YoutubeVideoTitleInterpreter,
  ]
})
export class MainModule { }
