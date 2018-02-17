import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.html',
  styleUrls: ['./page.css']
})
export class Page implements OnInit {
  error: string;
  test = '';//'Hello World!';

  ngOnInit() {
    window.onerror = (message: string, filename: string, lineno: number, colno: number, error: Error) => {
      this.error = message;
    };
  }
}
