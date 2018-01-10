import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface SuggestionProvider {
	provide(value: string): Promise<string[]>;
}

interface Word {
	index: number;
	text: string;
}

@Component({
	selector: 'app-text-input',
	templateUrl: './text-input.html',
	styleUrls: ['./text-input.css']
})
export class TextInput implements OnInit {
	@Output() input = new EventEmitter<string>();

	@Input() value: string = null;
	@Input() disabled = false;
	@Input() readonly = false;
	@Input() placeholder = '';
	@Input() suggestionProvider: SuggestionProvider = { provide: () => Promise.resolve([]) };

	suggestionsDisplayed = false;
	suggestions: string[] = [];
	selectedSuggestionIndex = -1;

	constructor() { }

	ngOnInit() {

	}

	onInput(value: string) {
		this.value = value;
		const lastWord = this.findLastWord(value);
		if (lastWord) {
			this.updateSuggestions(lastWord).then(() => this.showSuggestions());
		} else {
			this.hideSuggestions();
		}
		this.input.next(value);
	}

	onBlur() {
		this.suggestions = [];
		this.hideSuggestions();
	}

	onKeyDown(event: KeyboardEvent) {
		if (event.keyCode === 32 && event.ctrlKey) {
			this.updateSuggestions(this.findLastWord(this.value)).then(() => this.showSuggestions());
		}
		if (!this.suggestionsDisplayed) {
			return;
		}
		if (event.keyCode === 40) {
			this.selectNextSuggestion();
		}
		if (event.keyCode === 38) {
			this.selectPreviousSuggestion();
		}
		if (event.keyCode === 13) {
			/*if (event.ctrlKey) {
				this.applySelectedSuggestion();
			} else {
				this.hideSuggestions();
			}*/
			this.applySelectedSuggestion();
		}
		if (event.keyCode === 27) {
			this.hideSuggestions();
		}
	}

	onSuggestionClick(index: number) {
		this.selectedSuggestionIndex = index;
		this.applySelectedSuggestion();
	}

	selectPreviousSuggestion() {
		this.selectedSuggestionIndex = this.selectedSuggestionIndex === 0 ? this.suggestions.length - 1 : this.selectedSuggestionIndex - 1;
	}

	selectNextSuggestion() {
		this.selectedSuggestionIndex = this.selectedSuggestionIndex === this.suggestions.length - 1 ? 0 : this.selectedSuggestionIndex + 1;
	}

	applySelectedSuggestion() {
		const suggestion = this.suggestions[this.selectedSuggestionIndex];
		if (!suggestion) {
			return;
		}
		const lastWord = this.findLastWord(this.value);
		if (lastWord) {
			this.value = this.value.substring(0, lastWord.index) + suggestion;
		} else {
			this.value += suggestion;
		}
		this.hideSuggestions();
		this.input.next(this.value);
	}

	private updateSuggestions(lastWord: Word) {
		return this.suggestionProvider.provide(lastWord ? lastWord.text : '').then(suggestions => {
			this.suggestions = suggestions;
			if (this.selectedSuggestionIndex >= this.suggestions.length) {
				this.selectedSuggestionIndex = 0;
			}
		});
	}

	private findLastWord(value: string): Word {
		if (value.trim().length === 0 || value.endsWith(' ')) {
			return null;
		}
		let wordStart = value.lastIndexOf(' ');
		if (wordStart === -1) {
			wordStart = 0;
		} else {
			wordStart++;
		}
		return { index: wordStart, text: value.substring(wordStart, value.length) };
	}

	private showSuggestions() {
		if (this.suggestionsDisplayed) {
			return;
		}
		this.selectedSuggestionIndex = 0;
		this.suggestionsDisplayed = true;
	}

	private hideSuggestions() {
		if (!this.suggestionsDisplayed) {
			return;
		}
		this.selectedSuggestionIndex = -1;
		this.suggestionsDisplayed = false;
	}
}
