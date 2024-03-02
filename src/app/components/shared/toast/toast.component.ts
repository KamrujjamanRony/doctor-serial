import { Component, Input } from '@angular/core';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [],
  template: `
  <div class="toast">
  {{ message }}
  </div>
  `,
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() message: string = '';
}
