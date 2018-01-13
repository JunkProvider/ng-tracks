import { Directive, ElementRef, EventEmitter, Inject, Input, OnInit } from '@angular/core';

@Directive({
	selector: '[appFocusWhen]'
})
export class FocusDirective implements OnInit {
	@Input() appFocusWhen: EventEmitter<any>;

	constructor(@Inject(ElementRef) private element: ElementRef) {}

	ngOnInit() {
		this.appFocusWhen.subscribe((focus: boolean) => {
			this.element.nativeElement.focus();
		});
	}
}
