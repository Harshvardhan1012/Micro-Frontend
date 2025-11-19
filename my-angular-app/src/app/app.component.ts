import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppHelloComponent } from './components/micro_frontend/app-hello.component';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Your new app-hello component -->
       sdf
      <app-hello></app-hello>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, AppHelloComponent],
})
export class AppComponent {
  // No additional properties needed for this simple demo
}
