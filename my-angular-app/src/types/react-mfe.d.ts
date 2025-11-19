declare module 'hostApp/Card' 
declare module 'hostApp/HelloComponent' 
declare module 'react-dom/client' 
declare module 'hostApp/ReactUtils' {
  export const ReactUtils: {
    React: any;
    createElement: any;
    createRoot: any;
    renderReactComponent: (component: any, props: any, container: HTMLElement) => any;
    unmountReactComponent: (root: any) => void;
  };
  const ReactUtilsModule: any;
  export default ReactUtilsModule;
}