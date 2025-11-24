import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Button from './button';
export const HelloComponent = ({ name = "World", text }) => {
  const [count, setCount] = useState(0);
  console.log('React instance:', React);
  console.log('useState:', useState);
  console.log('React version:', React.version);

  return (
    <div >
      <h2>👋 Hello from React Microfrontend!</h2>
      <p>Hello, <strong>{name}</strong>!</p>
      <p>Button clicked: {count} times</p>
      <Button
        onClick={()=>setCount(count+1)}
        text={text || "Click Me"}
      />
    </div>
  );
};

// Export React utilities for Angular integration
export const ReactUtils = {
  React,
  createElement: React.createElement,
  createRoot,
  renderReactComponent: (component, props, container) => {
    const root = createRoot(container);
    root.render(React.createElement(component, props));
    return root;
  },
  unmountReactComponent: (root) => {
    if (root && root.unmount) {
      root.unmount();
    }
  }
};


export default HelloComponent;