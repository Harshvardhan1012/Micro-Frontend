declare module "reactHello/HelloComponent" {
  const HelloComponent: any
  export default HelloComponent
}

declare module "reactHello/ReactUtils" {
  export const ReactUtils: {
    React: any
    createElement: any
    createRoot: any
    renderReactComponent: (
      component: any,
      props: any,
      container: HTMLElement
    ) => any
    unmountReactComponent: (root: any) => void
  }
  const ReactUtilsModule: any
  export default ReactUtilsModule
}
