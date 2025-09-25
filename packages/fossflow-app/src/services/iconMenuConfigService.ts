import iconMenuConfig from '../iconMenuConfig.json';
import type { Icon } from 'fossflow';

// Types based on our JSON schema
export interface IconConfig {
  id: string;
  name: string;
  collection: 'PIXOTOPE' | 'ISOFLOW' | 'AWS';
  existingIconId?: string;
  fallbackIcon?: string;
  description?: string;
  customIcon?: {
    url: string;
    isIsometric?: boolean;
    scale?: number;
    flipX?: boolean;
    flipY?: boolean;
  };
}

export interface CategoryConfig {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isExpanded?: boolean;
  order?: number;
  icons: IconConfig[];
}

export interface IconMenuConfig {
  version: string;
  description?: string;
  categories: CategoryConfig[];
  settings?: {
    defaultExpanded?: string[];
    showEmptyCategories?: boolean;
    enableSearch?: boolean;
    enableFiltering?: boolean;
    maxIconsPerCategory?: number;
    iconSize?: {
      small: number;
      medium: number;
      large: number;
    };
  };
  metadata?: {
    createdAt?: string;
    lastModified?: string;
    author?: string;
    version?: string;
  };
}

export interface ProcessedCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isExpanded: boolean;
  order: number;
  icons: Icon[];
}

class IconMenuConfigService {
  private config: IconMenuConfig;
  private availableIcons: Icon[] = [];

  constructor() {
    this.config = iconMenuConfig as IconMenuConfig;
  }

  /**
   * Set the available icons from the app (ISOFLOW, AWS, PIXOTOPE collections)
   */
  setAvailableIcons(icons: Icon[]): void {
    this.availableIcons = icons;
    console.log('Available icons set:', {
      total: icons.length,
      collections: Array.from(new Set(icons.map(icon => icon.collection))),
      sampleIds: icons.slice(0, 10).map(icon => icon.id)
    });
  }

  /**
   * Get the raw configuration
   */
  getConfig(): IconMenuConfig {
    return this.config;
  }

  /**
   * Process the configuration and return categories with actual icon data
   */
  getProcessedCategories(): ProcessedCategory[] {
    return this.config.categories
      .map(category => this.processCategory(category))
      .filter(category => {
        // Filter out empty categories if showEmptyCategories is false
        const showEmpty = this.config.settings?.showEmptyCategories ?? false;
        return showEmpty || category.icons.length > 0;
      })
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Get icons with modified collection names to match our categories
   * This allows the existing categoriseIcons function to work with our configuration
   */
  getIconsWithConfiguredCollections(): Icon[] {
    console.log('🔄 Processing configured collections...');
    const configuredIcons: Icon[] = [];
    let totalProcessed = 0;
    let totalResolved = 0;
    
    for (const category of this.config.categories) {
      const processedCategory = this.processCategory(category);
      console.log(`📁 Category "${category.name}": ${category.icons.length} configured, ${processedCategory.icons.length} resolved`);
      
      totalProcessed += category.icons.length;
      totalResolved += processedCategory.icons.length;
      
      // Modify each icon's collection to match the category name
      for (const icon of processedCategory.icons) {
        const configuredIcon = {
          ...icon,
          collection: category.name // Use category name as collection
        };
        configuredIcons.push(configuredIcon);
        
        // Log first icon of first category for debugging
        if (category === this.config.categories[0] && processedCategory.icons.indexOf(icon) === 0) {
          console.log('🔍 Sample configured icon:', {
            original: { id: icon.id, collection: icon.collection },
            configured: { id: configuredIcon.id, collection: configuredIcon.collection }
          });
        }
      }
    }
    
    console.log(`✅ Icon processing complete: ${totalProcessed} configured, ${totalResolved} resolved, ${configuredIcons.length} final icons`);
    return configuredIcons;
  }

  /**
   * Process a single category and resolve its icons
   */
  private processCategory(categoryConfig: CategoryConfig): ProcessedCategory {
    const processedIcons = categoryConfig.icons
      .map(iconConfig => this.resolveIcon(iconConfig))
      .filter((icon): icon is Icon => icon !== null);

    // Apply maxIconsPerCategory limit if set
    const maxIcons = this.config.settings?.maxIconsPerCategory;
    const limitedIcons = maxIcons ? processedIcons.slice(0, maxIcons) : processedIcons;

    return {
      id: categoryConfig.id,
      name: categoryConfig.name,
      description: categoryConfig.description,
      color: categoryConfig.color,
      isExpanded: this.shouldCategoryBeExpanded(categoryConfig),
      order: categoryConfig.order ?? 999,
      icons: limitedIcons
    };
  }

  /**
   * Resolve an icon configuration to an actual Icon object
   */
  private resolveIcon(iconConfig: IconConfig): Icon | null {
    // First try to find the existing icon
    if (iconConfig.existingIconId) {
      const existingIcon = this.findIconById(iconConfig.existingIconId);
      if (existingIcon) {
        return {
          ...existingIcon,
          // Use the configured ID and name, not the existing icon's
          id: iconConfig.id,
          name: iconConfig.name,
        };
      } else {
        console.warn(`Existing icon not found: ${iconConfig.existingIconId} for ${iconConfig.name}`);
      }
    }

    // Try fallback icon
    if (iconConfig.fallbackIcon) {
      const fallbackIcon = this.findIconById(iconConfig.fallbackIcon);
      if (fallbackIcon) {
        console.log(`Using fallback icon ${iconConfig.fallbackIcon} for ${iconConfig.name}`);
        return {
          ...fallbackIcon,
          // Use the configured ID and name, not the fallback icon's
          id: iconConfig.id,
          name: iconConfig.name,
        };
      } else {
        console.warn(`Fallback icon not found: ${iconConfig.fallbackIcon} for ${iconConfig.name}`);
      }
    }

    // Try custom icon
    if (iconConfig.customIcon) {
      return {
        id: iconConfig.id,
        name: iconConfig.name,
        url: iconConfig.customIcon.url,
        collection: iconConfig.collection,
        isIsometric: iconConfig.customIcon.isIsometric,
        scale: iconConfig.customIcon.scale,
        flipX: iconConfig.customIcon.flipX,
        flipY: iconConfig.customIcon.flipY,
      };
    }

    // If no icon could be resolved, log a warning and return null
    console.warn(`Could not resolve icon: ${iconConfig.id} (existingIconId: ${iconConfig.existingIconId}, fallbackIcon: ${iconConfig.fallbackIcon})`);
    console.log('Available icon IDs:', this.availableIcons.slice(0, 10).map(icon => icon.id));
    return null;
  }

  /**
   * Find an icon by ID in the available icons
   */
  private findIconById(iconId: string): Icon | undefined {
    return this.availableIcons.find(icon => icon.id === iconId);
  }

  /**
   * Determine if a category should be expanded by default
   */
  private shouldCategoryBeExpanded(categoryConfig: CategoryConfig): boolean {
    // Check if explicitly set in category config
    if (categoryConfig.isExpanded !== undefined) {
      return categoryConfig.isExpanded;
    }

    // Check if in default expanded list
    const defaultExpanded = this.config.settings?.defaultExpanded ?? [];
    return defaultExpanded.includes(categoryConfig.id);
  }

  /**
   * Get categories formatted for the existing IconCollectionState system
   */
  getIconCollectionStates(): Array<{ id: string; isExpanded: boolean }> {
    return this.getProcessedCategories().map(category => ({
      id: category.id,
      isExpanded: category.isExpanded
    }));
  }

  /**
   * Search icons across all categories
   */
  searchIcons(query: string): Icon[] {
    if (!this.config.settings?.enableSearch) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const allIcons = this.getProcessedCategories().flatMap(category => category.icons);
    
    return allIcons.filter(icon => 
      icon.name.toLowerCase().includes(lowerQuery) ||
      icon.id.toLowerCase().includes(lowerQuery) ||
      (icon.collection && icon.collection.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get all icons from a specific category
   */
  getIconsByCategory(categoryId: string): Icon[] {
    const category = this.getProcessedCategories().find(cat => cat.id === categoryId);
    return category?.icons ?? [];
  }

  /**
   * Get configuration settings
   */
  getSettings() {
    return this.config.settings ?? {};
  }

  /**
   * Validate that all configured icons can be resolved
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const category of this.config.categories) {
      for (const iconConfig of category.icons) {
        const resolvedIcon = this.resolveIcon(iconConfig);
        if (!resolvedIcon) {
          errors.push(`Cannot resolve icon "${iconConfig.id}" in category "${category.name}"`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export a singleton instance
export const iconMenuConfigService = new IconMenuConfigService();
export default iconMenuConfigService;
