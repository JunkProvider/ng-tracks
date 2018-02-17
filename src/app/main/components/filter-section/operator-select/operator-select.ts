import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-operator-select',
  templateUrl: './operator-select.html',
  styleUrls: ['./operator-select.css']
})
export class OperatorSelect implements OnInit {
  @Output() valueChanged = new EventEmitter<string>();
  @Input() options: { value: string, text: string }[] = [];
  @Input() value: string = null;

  ngOnInit() {

  }

  onSelectChanged(value: string) {
    this.valueChanged.next(value);
  }
}
