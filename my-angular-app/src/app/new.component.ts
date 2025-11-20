import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactHostComponent } from './components/micro_frontend/react-host.component';

@Component({
  selector: 'app-new',
  template: `
    <div class="app-container">
      <!-- Your new app-hello component -->
      sdf

      <react-host
        componentName="HelloComponent"
        microfrontendName="hostApp"
        [props]="{ text: 'Hi', name: 'Harsh User' }"
      >
      </react-host>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactHostComponent],
})
export class NewComponent {
  // No additional properties needed for this simple demo
}
