import { ComponentConfig } from './types';

export class BatchRenderer {
  private static readonly DEFAULT_BATCH_SIZE = 10;
  private static readonly DEFAULT_DELAY = 16; // ~60fps

  static async batchRenderComponents(
    configs: ComponentConfig[],
    renderFunction: (config: ComponentConfig) => Promise<void>,
    batchSize: number = this.DEFAULT_BATCH_SIZE,
    delay: number = this.DEFAULT_DELAY
  ): Promise<void> {
    for (let i = 0; i < configs.length; i += batchSize) {
      const batch = configs.slice(i, i + batchSize);
      await new Promise<void>((resolve) => {
        requestIdleCallback(
          async () => {
            try {
              await this.renderComponentBatch(batch, renderFunction);
            } catch (error) {
              console.error('Batch rendering error:', error);
            } finally {
              resolve();
            }
          },
          { timeout: 100 }
        );
      });

      // Small delay between batches to prevent blocking
      if (i + batchSize < configs.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  private static async renderComponentBatch(
    batch: ComponentConfig[],
    renderFunction: (config: ComponentConfig) => Promise<void>
  ): Promise<void> {
    const renderPromises = batch.map((config) =>
      renderFunction(config).catch((error) => {
        console.error(`Failed to render component ${config.id}:`, error);
        return null;
      })
    );

    await Promise.all(renderPromises);
  }

  static async renderWithPriority(
    configs: ComponentConfig[],
    renderFunction: (config: ComponentConfig) => Promise<void>,
    priorities: Map<string, number> = new Map()
  ): Promise<void> {
    // Sort by priority (higher number = higher priority)
    const sortedConfigs = [...configs].sort((a, b) => {
      const priorityA = priorities.get(a.id) || 0;
      const priorityB = priorities.get(b.id) || 0;
      return priorityB - priorityA;
    });

    await this.batchRenderComponents(sortedConfigs, renderFunction);
  }
}
