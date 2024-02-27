import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
  <div class="flex flex-col justify-center items-center py-8">
    <h1 class="lg:text-5xl text-2xl font-bold uppercase text-secondary">
      {{ title }}
    </h1>
    <div class="flex justify-center items-center gap-3 text-gray-500 lg:text-3xl text-2xl my-2">
      <div class="lg:w-60 w-32 border border-gray-400"></div>
      <mat-icon class="text-primary">add_to_queue</mat-icon>
      <div class="lg:w-60 w-32 border border-gray-400"></div>
    </div>
  </div>
`,
  styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
  @Input() title!: string;

}
