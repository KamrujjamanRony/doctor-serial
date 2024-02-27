import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactIconComponent } from "../shared/react-icon/react-icon.component";

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    imports: [RouterLink, ReactIconComponent]
})
export class CategoryComponent {
  @Input() category: any;

  constructor() { }

}
