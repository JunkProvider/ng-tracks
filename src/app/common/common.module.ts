import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SquareBox } from './components/square-box/square-box';
import { TextInput } from './components/text-input/text-input';

@NgModule({
	declarations: [
		SquareBox,
		TextInput
	],
	imports: [
		BrowserModule
	],
	exports: [
		SquareBox,
		TextInput
	],
	providers: []
})
export class CommonModule { }
