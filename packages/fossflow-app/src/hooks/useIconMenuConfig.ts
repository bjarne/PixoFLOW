import { useMemo, useEffect, useState } from 'react';
import type { Icon } from 'fossflow';
import { iconMenuConfigService, ProcessedCategory } from '../services/iconMenuConfigService';

interface UseIconMenuConfigProps {
  availableIcons: Icon[];
}

export const useIconMenuConfig = ({ availableIcons }: UseIconMenuConfigProps) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the service with available icons
  useEffect(() => {
    iconMenuConfigService.setAvailableIcons(availableIcons);
    setIsInitialized(true);
  }, [availableIcons]);

  // Get processed categories
  const categories = useMemo<ProcessedCategory[]>(() => {
    if (!isInitialized) return [];
    return iconMenuConfigService.getProcessedCategories();
  }, [isInitialized]);

  // Get icon collection states for compatibility with existing system
  const iconCollectionStates = useMemo(() => {
    if (!isInitialized) return [];
    return iconMenuConfigService.getIconCollectionStates();
  }, [isInitialized]);

  // Search function
  const searchIcons = useMemo(() => {
    return (query: string): Icon[] => {
      if (!isInitialized) return [];
      return iconMenuConfigService.searchIcons(query);
    };
  }, [isInitialized]);

  // Get icons by category
  const getIconsByCategory = useMemo(() => {
    return (categoryId: string): Icon[] => {
      if (!isInitialized) return [];
      return iconMenuConfigService.getIconsByCategory(categoryId);
    };
  }, [isInitialized]);

  // Configuration settings
  const settings = useMemo(() => {
    return iconMenuConfigService.getSettings();
  }, []);

  // Validation
  const validation = useMemo(() => {
    if (!isInitialized) return { isValid: true, errors: [] };
    return iconMenuConfigService.validateConfiguration();
  }, [isInitialized]);

  // Get icons with configured collections - use a ref to prevent infinite loops
  const iconsWithConfiguredCollections = useMemo(() => {
    if (!isInitialized) return [];
    return iconMenuConfigService.getIconsWithConfiguredCollections();
  }, [isInitialized]);

  return {
    categories,
    iconCollectionStates,
    iconsWithConfiguredCollections,
    searchIcons,
    getIconsByCategory,
    settings,
    validation,
    isInitialized
  };
};
