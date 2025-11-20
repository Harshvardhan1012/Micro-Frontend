// import { ComponentConfig, VirtualScrollConfig } from './types';

// export class VirtualScrollManager {
//   private scrollContainer!: HTMLElement;
//   private config: VirtualScrollConfig;
//   private items: ComponentConfig[];
//   private onVisibleItemsChange: (
//     items: ComponentConfig[],
//     startIndex: number,
//     endIndex: number
//   ) => void;

//   constructor(
//     config: VirtualScrollConfig,
//     items: ComponentConfig[],
//     onVisibleItemsChange: (items: ComponentConfig[], startIndex: number, endIndex: number) => void
//   ) {
//     this.config = config;
//     this.items = items;
//     this.onVisibleItemsChange = onVisibleItemsChange;
//   }

//   initialize(scrollContainer: HTMLElement): void {
//     this.scrollContainer = scrollContainer;
//     this.setupScrollListener();
//     this.updateVisibleItems();
//   }

//   private setupScrollListener(): void {
//     if (!this.scrollContainer) return;

//     let ticking = false;

//     const onScroll = () => {
//       if (!ticking) {
//         requestAnimationFrame(() => {
//           this.updateVisibleItems();
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     this.scrollContainer.addEventListener('scroll', onScroll, { passive: true });
//   }

//   private updateVisibleItems(): void {
//     if (!this.scrollContainer) return;

//     const scrollTop = this.scrollContainer.scrollTop;
//     const containerHeight = this.config.containerHeight;
//     const itemHeight = this.config.itemHeight;
//     const bufferSize = this.config.bufferSize;

//     // Calculate visible range
//     const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
//     const visibleCount = Math.ceil(containerHeight / itemHeight) + bufferSize * 2;
//     const endIndex = Math.min(this.items.length - 1, startIndex + visibleCount);

//     // Get visible items
//     const visibleItems = this.items.slice(startIndex, endIndex + 1);

//     // Notify about visible items change
//     this.onVisibleItemsChange(visibleItems, startIndex, endIndex);
//   }

//   updateItems(newItems: ComponentConfig[]): void {
//     this.items = newItems;
//     this.updateVisibleItems();
//   }

//   scrollToIndex(index: number): void {
//     if (!this.scrollContainer) return;

//     const targetScrollTop = index * this.config.itemHeight;
//     this.scrollContainer.scrollTop = targetScrollTop;
//   }

//   getScrollInfo(): { scrollTop: number; scrollHeight: number; clientHeight: number } {
//     if (!this.scrollContainer) {
//       return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };
//     }

//     return {
//       scrollTop: this.scrollContainer.scrollTop,
//       scrollHeight: this.scrollContainer.scrollHeight,
//       clientHeight: this.scrollContainer.clientHeight,
//     };
//   }

//   destroy(): void {
//     // Cleanup will be handled by Angular component lifecycle
//   }
// }
