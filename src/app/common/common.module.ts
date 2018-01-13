import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SquareBox } from './components/square-box/square-box';
import { TextInput } from './components/text-input/text-input';
import { LoadingMask } from './components/loading-mask/loading-mask';
import { LoadingIndicator } from './components/loading-indicator/loading-indicator';

@NgModule({
	declarations: [
		SquareBox,
		TextInput,
		LoadingMask,
		LoadingIndicator,
	],
	imports: [
		BrowserModule
	],
	exports: [
		SquareBox,
		TextInput,
		LoadingMask,
		LoadingIndicator,
	],
	providers: []
})
export class CommonModule { }
