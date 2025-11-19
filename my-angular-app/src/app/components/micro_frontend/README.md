<!-- # React Micro Frontend Components

This folder contains a complete system for rendering hundreds of React micro frontend components efficiently in Angular.

## Files Overview

### Core Types (`types.ts`)
- `ComponentConfig`: Configuration for each React component
- `MicrofrontendConfig`: Configuration for micro frontend remotes
- `VirtualScrollConfig`: Configuration for virtual scrolling

### Component Registry (`component-registry.ts`)
- Manages loading and caching of React components
- Handles component preloading
- Prevents duplicate loading with promise caching

### Batch Renderer (`batch-renderer.ts`)
- Renders components in batches to prevent UI blocking
- Supports priority-based rendering
- Uses `requestIdleCallback` for optimal performance

### Virtual Scroll Manager (`virtual-scroll-manager.ts`)
- Manages virtual scrolling for large lists
- Only renders visible components
- Handles smooth scrolling and buffering

### Main Component (`react-multi-wrapper.component.ts`)
- Primary Angular component for rendering React components
- Integrates all utilities for optimal performance
- Supports both virtual and standard scrolling modes

### Demo Component (`demo.component.ts`)
- Example usage of the micro frontend system
- Shows how to configure and use the components

## Usage Example

```typescript
import { ComponentConfig } from './micro_frontend/types';
import { ReactMultiWrapperComponent } from './micro_frontend/react-multi-wrapper.component';

@Component({
  template: `
    <app-react-multi-wrapper 
      [components]="myComponents"
      [scrollConfig]="scrollConfig"
      [enableVirtualScroll]="true"
      [enableBatching]="true"
      [batchSize]="10">
    </app-react-multi-wrapper>
  `,
  imports: [ReactMultiWrapperComponent]
})
export class MyComponent {
  myComponents: ComponentConfig[] = [
    {
      id: 'comp-1',
      componentName: 'HelloComponent',
      microfrontendName: 'reactHello',
      props: { name: 'User 1' }
    },
    // ... hundreds more
  ];

  scrollConfig = {
    itemHeight: 200,
    containerHeight: 600,
    bufferSize: 5
  };
}
```

## Features

✅ **Virtual Scrolling**: Only renders visible components  
✅ **Batch Rendering**: Prevents UI blocking with large lists  
✅ **Component Caching**: Avoids duplicate component loads  
✅ **Error Handling**: Graceful handling of failed component loads  
✅ **Performance Monitoring**: Built-in statistics and monitoring  
✅ **Flexible Configuration**: Customizable for different use cases  

## Performance Optimizations

1. **Lazy Loading**: Components loaded only when needed
2. **Virtual Scrolling**: Renders only visible items
3. **Batch Processing**: Renders in small chunks
4. **Component Caching**: Reuses loaded components
5. **Memory Management**: Proper cleanup on destroy

## Configuration Options

### Virtual Scroll Config
- `itemHeight`: Height of each component item
- `containerHeight`: Height of the scroll container
- `bufferSize`: Number of extra items to render outside viewport

### Performance Settings
- `enableVirtualScroll`: Enable/disable virtual scrolling
- `enableBatching`: Enable/disable batch rendering
- `batchSize`: Number of components to render per batch

## Best Practices

1. **Use Virtual Scrolling**: For lists with >50 components
2. **Batch Rendering**: Always enable for >20 components
3. **Component Caching**: Let the registry handle caching automatically
4. **Error Boundaries**: Implement proper error handling
5. **Memory Cleanup**: Components auto-cleanup on destroy

## Integration with Module Federation

Make sure your webpack configuration includes the micro frontend remotes:

```javascript
new ModuleFederationPlugin({
  name: 'angularHost',
  remotes: {
    reactHello: 'reactHello@http://localhost:3001/remoteEntry.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
``` -->