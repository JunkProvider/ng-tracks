import { Component } from '@angular/core';
import { test } from '@junkprovider/assertion';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor() {
    test();
  }
}
