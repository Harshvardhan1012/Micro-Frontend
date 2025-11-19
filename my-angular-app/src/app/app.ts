import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <!-- Angular App Root Template -->
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      /* App Root Styles */
      .app-container {
        width: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
      }

      /* Global styles */
      :host ::ng-deep * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :host ::ng-deep body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class App {
  protected readonly title = signal('my-angular-app');
}
