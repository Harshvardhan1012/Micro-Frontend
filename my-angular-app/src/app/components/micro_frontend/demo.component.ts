import { Component } from '@angular/core';
import { ReactMultiWrapperComponent } from './react-multi-wrapper.component';
import { ComponentConfig } from './types';

@Component({
  selector: 'app-demo',
  template: `
    <div class="demo-container">
      <h2>React Micro Frontend Demo</h2>

      <!-- <div class="stats">
        <p>Total Components: {{ componentStats?.total || 0 }}</p>
        <p>Rendered: {{ componentStats?.rendered || 0 }}</p>
        <p>Loading: {{ componentStats?.loading || 0 }}</p>
        <p>Errors: {{ componentStats?.errors || 0 }}</p>
      </div> -->

      <div class="controls">
        <button (click)="addComponents()">Add 10 Card Components</button>
        <button (click)="addSpecificCard('CardWithAction')">Add Action Card</button>
        <button (click)="addSpecificCard('BasicCard')">Add Basic Card</button>
        <button (click)="clearComponents()">Clear All</button>
        <button (click)="refreshStats()">Refresh Stats</button>
      </div>

      <app-react-multi-wrapper
        #multiWrapper
        [components]="demoComponents"
        [scrollConfig]="scrollConfig"
        [enableVirtualScroll]="true"
        [enableBatching]="true"
        [batchSize]="5"
      >
      </app-react-multi-wrapper>
    </div>
  `,
  imports: [ReactMultiWrapperComponent],
})
export class MicroFrontendDemoComponent {
  demoComponents: ComponentConfig[] = [];
  componentStats: any = null;

  scrollConfig = {
    itemHeight: 200,
    containerHeight: 600,
    bufferSize: 5,
  };

  constructor() {
    this.initializeDemoComponents();
  }

  private initializeDemoComponents(): void {
    // Create demo components using different Card variations from hostApp/card
    // const cardVariations = [
    //   {
    //     componentName: 'Card',
    //     props: {
    //       className: 'w-full max-w-md',
    //       children: [
    //         {
    //           type: 'CardHeader',
    //           props: {
    //             children: [
    //               { type: 'CardTitle', props: { children: 'Basic Card' } },
    //               { type: 'CardDescription', props: { children: 'A simple card component' } },
    //             ],
    //           },
    //         },
    //         { type: 'CardContent', props: { children: 'This is the card content area.' } },
    //       ],
    //     },
    //   },
    //   {
    //     componentName: 'Card',
    //     props: {
    //       className: 'w-full max-w-md border-blue-200',
    //       children: [
    //         {
    //           type: 'CardHeader',
    //           props: {
    //             children: [
    //               { type: 'CardTitle', props: { children: 'Card with Action' } },
    //               {
    //                 type: 'CardDescription',
    //                 props: { children: 'Card with header action button' },
    //               },
    //               { type: 'CardAction', props: { children: 'Action' } },
    //             ],
    //           },
    //         },
    //         { type: 'CardContent', props: { children: 'Content with action in header.' } },
    //         { type: 'CardFooter', props: { children: 'Footer content here' } },
    //       ],
    //     },
    //   },
    //   {
    //     componentName: 'Card',
    //     props: {
    //       className: 'w-full max-w-md border-green-200',
    //       children: [
    //         {
    //           type: 'CardHeader',
    //           props: {
    //             children: [
    //               { type: 'CardTitle', props: { children: 'Full Featured Card' } },
    //               {
    //                 type: 'CardDescription',
    //                 props: { children: 'Complete card with all components' },
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           type: 'CardContent',
    //           props: { children: 'Rich content area with multiple sections.' },
    //         },
    //         { type: 'CardFooter', props: { children: 'Actions and links in footer' } },
    //       ],
    //     },
    //   },
    // ];

    // Create multiple instances of each card type
    // for (let i = 0; i < 15; i++) {
    //   const variation = cardVariations[i % cardVariations.length];
      this.demoComponents.push({
        id: `card`,
        componentName: 'hello',
        microfrontendName: 'hostApp',
        props: {
          key: `card-0`,
          name: `Card Component 1 from Microfrontend`,
        },
      });
    // }
  }

  addComponents(): void {
    const currentCount = this.demoComponents.length;

    // Add more card variations
    const newCardTypes = [
     {
        componentName: 'ReactUtils',
        props: {},
     }
    ];

    for (let i = 0; i < 10; i++) {
      const cardConfig = newCardTypes[0];
      this.demoComponents.push({
        id: `dynamic-card-${currentCount + i}`,
        componentName: cardConfig.componentName,
        microfrontendName: 'hostApp',
        props: {
          ...cardConfig.props,
          key: `dynamic-card-${currentCount + i}`,
          children: [
            {
              type: 'CardHeader',
              props: {
                children: [
                  {
                    type: 'CardTitle',
                    props: { children: `Dynamic Card ${currentCount + i + 1}` },
                  },
                  {
                    type: 'CardDescription',
                    props: { children: 'Dynamically added card component' },
                  },
                ],
              },
            },
            {
              type: 'CardContent',
              props: {
                children: `This card was added dynamically at ${new Date().toLocaleTimeString()}`,
              },
            },
          ],
        },
      });
    }

    console.log('Components after addition:', this.demoComponents);
    // Trigger change detection
    this.demoComponents = [...this.demoComponents];
  }

  addSpecificCard(cardType: string): void {
    const currentCount = this.demoComponents.length;

    const cardConfigs: Record<string, any> = {
      CardWithAction: {
        componentName: 'Card',
        props: {
          className: 'w-full max-w-md border-blue-200 shadow-lg',
          children: [
            {
              type: 'CardHeader',
              props: {
                children: [
                  { type: 'CardTitle', props: { children: 'Action Card' } },
                  {
                    type: 'CardDescription',
                    props: { children: 'Card with interactive elements' },
                  },
                  { type: 'CardAction', props: { children: '⚙️' } },
                ],
              },
            },
            {
              type: 'CardContent',
              props: { children: 'This card has action buttons and interactive elements.' },
            },
            { type: 'CardFooter', props: { children: 'Footer with actions' } },
          ],
        },
      },
      BasicCard: {
        componentName: 'Card',
        props: {
          className: 'w-full max-w-md border-gray-200',
          children: [
            {
              type: 'CardHeader',
              props: {
                children: [
                  { type: 'CardTitle', props: { children: 'Simple Card' } },
                  { type: 'CardDescription', props: { children: 'Clean and minimal design' } },
                ],
              },
            },
            { type: 'CardContent', props: { children: 'Basic card content without extras.' } },
          ],
        },
      },
    };

    const config = cardConfigs[cardType];
    if (config) {
      this.demoComponents.push({
        id: `${cardType.toLowerCase()}-${currentCount}`,
        componentName: config.componentName,
        microfrontendName: 'hostApp',
        props: {
          ...config.props,
          key: `${cardType.toLowerCase()}-${currentCount}`,
        },
      });

      this.demoComponents = [...this.demoComponents];
    }
  }

  clearComponents(): void {
    this.demoComponents = [];
  }

  refreshStats(): void {
    // This would be called from the child component
    // In a real implementation, you'd use ViewChild to access the component
  }
}
