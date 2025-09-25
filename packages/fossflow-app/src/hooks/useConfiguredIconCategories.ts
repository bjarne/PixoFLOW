import { useMemo } from 'react';
import { useIconMenuConfig } from './useIconMenuConfig';
import type { Icon } from 'fossflow';

interface ConfiguredIconCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isExpanded: boolean;
  icons: Icon[];
}

interface UseConfiguredIconCategoriesProps {
  availableIcons: Icon[];
}

/**
 * Hook that provides icon categories using the JSON configuration system
 * This replaces the default categorization based on icon.collection
 */
export const useConfiguredIconCategories = ({ availableIcons }: UseConfiguredIconCategoriesProps) => {
  const iconMenuConfig = useIconMenuConfig({ availableIcons });

  // Convert our processed categories to the format expected by the UI
  const configuredCategories = useMemo<ConfiguredIconCategory[]>(() => {
    if (!iconMenuConfig.isInitialized) {
      return [];
    }

    return iconMenuConfig.categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      isExpanded: category.isExpanded,
      icons: category.icons
    }));
  }, [iconMenuConfig.categories, iconMenuConfig.isInitialized]);

  // Create icon collection states compatible with the existing system
  const iconCollectionStates = useMemo(() => {
    return configuredCategories.map(category => ({
      id: category.id,
      isExpanded: category.isExpanded
    }));
  }, [configuredCategories]);

  // Get all icons flattened (for backward compatibility)
  const allIcons = useMemo(() => {
    return configuredCategories.flatMap(category => category.icons);
  }, [configuredCategories]);

  // Search function
  const searchIcons = (query: string): Icon[] => {
    return iconMenuConfig.searchIcons(query);
  };

  // Get icons by category
  const getIconsByCategory = (categoryId: string): Icon[] => {
    return iconMenuConfig.getIconsByCategory(categoryId);
  };

  return {
    categories: configuredCategories,
    iconCollectionStates,
    allIcons,
    searchIcons,
    getIconsByCategory,
    settings: iconMenuConfig.settings,
    validation: iconMenuConfig.validation,
    isInitialized: iconMenuConfig.isInitialized
  };
};
