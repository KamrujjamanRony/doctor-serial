import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cover',
  standalone: true,
  imports: [],
  templateUrl: './cover.component.html'
})
export class CoverComponent {
  @Input() title: any = '';
  @Input() sub1: any = '';
  @Input() sub2: any = '';

}
