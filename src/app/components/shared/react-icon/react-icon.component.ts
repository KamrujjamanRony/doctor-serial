import { Component, Input, OnInit, ElementRef } from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IconType } from 'react-icons';

@Component({
  selector: 'app-react-icon',
  standalone: true,
  imports: [],
  template: `<span></span>`
})
export class ReactIconComponent implements OnInit {
  @Input()
  icon!: IconType;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const container = this.elementRef.nativeElement.querySelector('span');
    const ReactElement = React.createElement(this.icon);
    ReactDOM.render(ReactElement, container);
  }
}

