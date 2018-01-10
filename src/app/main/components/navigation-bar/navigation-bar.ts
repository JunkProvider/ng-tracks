import { Component, OnInit } from '@angular/core';
import { AppModel } from '../../model/app-model';

@Component({
	selector: 'app-navigation-bar',
	templateUrl: './navigation-bar.html',
	styleUrls: ['./navigation-bar.css']
})
export class NavigationBar implements OnInit {

	constructor(private readonly model: AppModel) { }

	ngOnInit() {

	}
}
