import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Isoflow, allLocales } from 'fossflow';
import { flattenCollections } from '@isoflow/isopacks/dist/utils';
import isoflowIsopack from '@isoflow/isopacks/dist/isoflow';
import pixotopeIcons from './pixotopeIcons';  // New import for custom Pixotope icons
import { useTranslation } from 'react-i18next';
import { DiagramData, mergeDiagramData, extractSavableData } from './diagramUtils';
import { StorageManager } from './StorageManager';
import { DiagramManager } from './components/DiagramManager';
import { storageManager } from './services/storageService';
import ChangeLanguage from './components/ChangeLanguage';
import { useIconMenuConfig } from './hooks/useIconMenuConfig';
import './App.css';

// Safe manual flattening - bypass the problematic flattenCollections function
const icons = (() => {
  const allIcons = [];
  
  // Add predefined isopacks safely (extract icons from pack objects and set collection names)
  if (isoflowIsopack?.icons && Array.isArray(isoflowIsopack.icons)) {
    const iconsWithCollection = isoflowIsopack.icons.map(icon => ({...icon, collection: 'ISOFLOW'}));
    allIcons.push(...iconsWithCollection);
  }
  
  // Add Pixotope icons (already have collection property)
  if (pixotopeIcons && Array.isArray(pixotopeIcons)) {
    allIcons.push(...pixotopeIcons);
  }
  
  // Validate icons to prevent render issues
  const validIcons = allIcons.filter(icon => 
    icon && 
    typeof icon.id === 'string' && 
    typeof icon.name === 'string' && 
    typeof icon.url === 'string' && 
    typeof icon.collection === 'string'
  );
  
  if (validIcons.length !== allIcons.length) {
    console.warn(`Filtered out ${allIcons.length - validIcons.length} invalid icons`);
  }
  
  return validIcons;
})();

// Default colors for connectors - defined outside component to prevent recreation
const DEFAULT_COLORS = [
  { id: 'blue', value: '#0066cc' },
  { id: 'green', value: '#00aa00' },
  { id: 'red', value: '#cc0000' },
  { id: 'orange', value: '#ff9900' },
  { id: 'purple', value: '#9900cc' },
  { id: 'black', value: '#000000' },
  { id: 'gray', value: '#666666' }
];

interface SavedDiagram {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<SavedDiagram | null>(null);
  const [diagramName, setDiagramName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [fossflowKey, setFossflowKey] = useState(0); // Key to force re-render of FossFLOW
  const [currentModel, setCurrentModel] = useState<DiagramData | null>(null); // Store current model state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const isAutoSavingRef = useRef(false);
  const diagramNameRef = useRef(diagramName);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showDiagramManager, setShowDiagramManager] = useState(false);
  const [serverStorageAvailable, setServerStorageAvailable] = useState(false);
  
  // Update ref when diagramName changes
  useEffect(() => {
    diagramNameRef.current = diagramName;
  }, [diagramName]);
  
  // Initialize with empty diagram data

  // Use the new icon menu configuration system
  const iconMenuConfig = useIconMenuConfig({ availableIcons: icons });

  // Debug log for icon menu configuration
  useEffect(() => {
    if (iconMenuConfig.isInitialized) {
      console.log('Icon Menu Configuration loaded:', {
        categories: iconMenuConfig.categories.length,
        validation: iconMenuConfig.validation,
        settings: iconMenuConfig.settings
      });
      
      // Log validation errors if any
      if (!iconMenuConfig.validation.isValid) {
        console.warn('Icon Menu Configuration validation errors:', iconMenuConfig.validation.errors);
      }
    }
  }, [iconMenuConfig.isInitialized]);
  
  const [diagramData, setDiagramData] = useState<DiagramData>(() => {
    // Initialize with last opened data if available
    const lastOpenedData = localStorage.getItem('fossflow-last-opened-data');
    if (lastOpenedData) {
      try {
        const data = JSON.parse(lastOpenedData);
        const importedIcons = (data.icons || []).filter((icon: any) => icon.collection === 'imported');
        const mergedIcons = [...icons, ...importedIcons];
        return {
          ...data,
          icons: mergedIcons,
          colors: data.colors?.length ? data.colors : DEFAULT_COLORS,
          fitToScreen: data.fitToScreen !== false
        };
      } catch (e) {
        console.error('Failed to load last opened data:', e);
      }
    }
    
    // Default state if no saved data
    return {
      title: 'Untitled Diagram',
      icons: icons,
      colors: DEFAULT_COLORS,
      items: [],
      views: [],
      fitToScreen: true
    };
  });

  // Prepare initial data with configured icons (avoiding infinite loops)
  const [preparedInitialData, setPreparedInitialData] = useState(diagramData);
  const [forceRenderKey, setForceRenderKey] = useState(0);
  
  // Update prepared data when configuration is ready
  useEffect(() => {
    if (iconMenuConfig.isInitialized) {
      console.log('🔧 Starting icon configuration process...');
      
      const configuredIcons = iconMenuConfig.iconsWithConfiguredCollections;
      const importedIcons = (diagramData.icons || []).filter(icon => icon.collection === 'imported');
      const allConfiguredIcons = [...configuredIcons, ...importedIcons];
      
      console.log('📊 Icon Menu Configuration Debug:', {
        configured: configuredIcons.length,
        imported: importedIcons.length,
        total: allConfiguredIcons.length,
        categories: Array.from(new Set(allConfiguredIcons.map(icon => icon.collection))),
        firstFewConfigured: configuredIcons.slice(0, 3).map(icon => ({id: icon.id, name: icon.name, collection: icon.collection})),
        validationErrors: iconMenuConfig.validation.errors,
        allCategories: Array.from(new Set(allConfiguredIcons.map(icon => icon.collection))).sort()
      });
      
      // Also log the original icons for comparison
      console.log('🔍 Original icons vs Configured:', {
        original: {
          total: icons.length,
          categories: Array.from(new Set(icons.map(icon => icon.collection))),
          sampleIds: icons.slice(0, 5).map(icon => icon.id)
        },
        configured: {
          total: configuredIcons.length,
          categories: Array.from(new Set(configuredIcons.map(icon => icon.collection))),
          sampleIds: configuredIcons.slice(0, 5).map(icon => icon.id)
        }
      });
      
      const newData = {
        ...diagramData,
        icons: allConfiguredIcons,
        colors: diagramData.colors || DEFAULT_COLORS
      };
      
      setPreparedInitialData(newData);
      setForceRenderKey(prev => prev + 1); // Force Isoflow to re-render
      
      console.log('🚀 Forcing Isoflow re-render with configured data');
    }
  }, [iconMenuConfig.isInitialized]); // Only depend on isInitialized

  // Check for server storage availability
  useEffect(() => {
    storageManager.initialize().then(() => {
      setServerStorageAvailable(storageManager.isServerStorage());
    }).catch(console.error);
  }, []);

  // Load diagrams from localStorage on component mount
  useEffect(() => {
    const savedDiagrams = localStorage.getItem('fossflow-diagrams');
    if (savedDiagrams) {
      setDiagrams(JSON.parse(savedDiagrams));
    }
    
    // Load last opened diagram metadata (data is already loaded in state initialization)
    const lastOpenedId = localStorage.getItem('fossflow-last-opened');
    
    if (lastOpenedId && savedDiagrams) {
      try {
        const allDiagrams = JSON.parse(savedDiagrams);
        const lastDiagram = allDiagrams.find((d: SavedDiagram) => d.id === lastOpenedId);
        if (lastDiagram) {
          setCurrentDiagram(lastDiagram);
          setDiagramName(lastDiagram.name);
          // Also set currentModel to match diagramData
          setCurrentModel(diagramData);
        }
      } catch (e) {
        console.error('Failed to restore last diagram metadata:', e);
      }
    }
  }, [diagramData]);

    // Save diagrams to localStorage whenever they change
  useEffect(() => {
    try {
      // Store diagrams without the full icon data
      const diagramsToStore = diagrams.map(d => ({
        ...d,
        data: {
          ...d.data,
          icons: [] // Don't store icons with each diagram
        }
      }));
      localStorage.setItem('fossflow-diagrams', JSON.stringify(diagramsToStore));
    } catch (e) {
      console.error('Failed to save diagrams:', e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please export important diagrams and clear some space.');
      }
    }
  }, [diagrams]);

  const saveDiagram = () => {
    if (!diagramName.trim()) {
      alert('Please enter a diagram name');
      return;
    }

    // Check if a diagram with this name already exists (excluding current)
    const existingDiagram = diagrams.find(d => 
      d.name === diagramName.trim() && d.id !== currentDiagram?.id
    );
    
    if (existingDiagram) {
      const confirmOverwrite = window.confirm(
        `A diagram named "${diagramName}" already exists in this session. This will overwrite it. Are you sure you want to continue?`
      );
      if (!confirmOverwrite) {
        return;
      }
    }

    // Construct save data - include only imported icons
    const importedIcons = (currentModel?.icons || diagramData.icons || [])
      .filter(icon => icon.collection === 'imported');
    
    const savedData = {
      title: diagramName,
      icons: importedIcons, // Save only imported icons with diagram
      colors: currentModel?.colors || diagramData.colors || [],
      items: currentModel?.items || diagramData.items || [],
      views: currentModel?.views || diagramData.views || [],
      fitToScreen: true
    };
    

    const newDiagram: SavedDiagram = {
      id: currentDiagram?.id || Date.now().toString(),
      name: diagramName,
      data: savedData,
      createdAt: currentDiagram?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentDiagram) {
      // Update existing diagram
      setDiagrams(diagrams.map(d => d.id === currentDiagram.id ? newDiagram : d));
    } else if (existingDiagram) {
      // Replace existing diagram with same name
      setDiagrams(diagrams.map(d => d.id === existingDiagram.id ? { ...newDiagram, id: existingDiagram.id, createdAt: existingDiagram.createdAt } : d));
      newDiagram.id = existingDiagram.id;
      newDiagram.createdAt = existingDiagram.createdAt;
    } else {
      // Add new diagram
      setDiagrams([...diagrams, newDiagram]);
    }

    setCurrentDiagram(newDiagram);
    setShowSaveDialog(false);
    setHasUnsavedChanges(false);
    setLastAutoSave(new Date());
    
    // Save as last opened
    try {
      localStorage.setItem('fossflow-last-opened', newDiagram.id);
      localStorage.setItem('fossflow-last-opened-data', JSON.stringify(newDiagram.data));
    } catch (e) {
      console.error('Failed to save diagram:', e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('Storage full! Opening Storage Manager...');
        setShowStorageManager(true);
      }
    }
  };

  const loadDiagram = (diagram: SavedDiagram) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Continue loading?')) {
      return;
    }
    
    // Merge imported icons with default icon set
    const importedIcons = (diagram.data.icons || []).filter((icon: any) => icon.collection === 'imported');
    const mergedIcons = [...icons, ...importedIcons];
    const dataWithIcons = {
      ...diagram.data,
      icons: mergedIcons
    };
    
    setCurrentDiagram(diagram);
    setDiagramName(diagram.name);
    setDiagramData(dataWithIcons);
    setCurrentModel(dataWithIcons);
    setFossflowKey(prev => prev + 1); // Force re-render of FossFLOW
    setShowLoadDialog(false);
    setHasUnsavedChanges(false);
    
    // Save as last opened (without icons)
    try {
      localStorage.setItem('fossflow-last-opened', diagram.id);
      localStorage.setItem('fossflow-last-opened-data', JSON.stringify(diagram.data));
    } catch (e) {
      console.error('Failed to save last opened:', e);
    }
  };

  const deleteDiagram = (id: string) => {
    if (window.confirm('Are you sure you want to delete this diagram?')) {
      setDiagrams(diagrams.filter(d => d.id !== id));
      if (currentDiagram?.id === id) {
        setCurrentDiagram(null);
        setDiagramName('');
      }
    }
  };

  const newDiagram = () => {
    const message = hasUnsavedChanges 
      ? 'You have unsaved changes. Export your diagram first to save it. Continue?'
      : 'Create a new diagram?';
      
    if (window.confirm(message)) {
      const emptyDiagram: DiagramData = {
        title: 'Untitled Diagram',
        icons: icons, // Always include full icon set
        colors: DEFAULT_COLORS,
        items: [],
        views: [],
        fitToScreen: true
      };
      setCurrentDiagram(null);
      setDiagramName('');
      setDiagramData(emptyDiagram);
      setCurrentModel(emptyDiagram); // Reset current model too
      setFossflowKey(prev => prev + 1); // Force re-render of FossFLOW
      setHasUnsavedChanges(false);
      
      // Clear last opened
      localStorage.removeItem('fossflow-last-opened');
      localStorage.removeItem('fossflow-last-opened-data');
    }
  };

  const handleModelUpdated = useCallback((model: any) => {
    // Store the current model state whenever it updates
    // The model from Isoflow contains the COMPLETE state including all icons
    
    // Simply store the complete model as-is since it has everything
    const updatedModel = {
      title: model.title || diagramNameRef.current || 'Untitled',
      icons: model.icons || [], // This already includes ALL icons (default + imported)
      colors: model.colors || DEFAULT_COLORS,
      items: model.items || [],
      views: model.views || [],
      fitToScreen: true
    };
    
    setCurrentModel(updatedModel);
    setDiagramData(updatedModel);
    setHasUnsavedChanges(true);
  }, []); // Empty dependencies - stable callback

  const exportDiagram = () => {
    // Use the most recent model data - prefer currentModel as it gets updated by handleModelUpdated
    const modelToExport = currentModel || diagramData;
    
    // Get ALL icons from the current model (which includes both default and imported)
    const allModelIcons = modelToExport.icons || [];
    
    // For safety, also check diagramData for any imported icons not in currentModel
    const diagramImportedIcons = (diagramData.icons || []).filter(icon => icon.collection === 'imported');
    
    // Create a map to deduplicate icons by ID, preferring the ones from currentModel
    const iconMap = new Map();
    
    // First add all icons from the model (includes defaults + imported)
    allModelIcons.forEach(icon => {
      iconMap.set(icon.id, icon);
    });
    
    // Then add any imported icons from diagramData that might be missing
    diagramImportedIcons.forEach(icon => {
      if (!iconMap.has(icon.id)) {
        iconMap.set(icon.id, icon);
      }
    });
    
    // Get all unique icons
    const allIcons = Array.from(iconMap.values());
    
    const exportData = {
      title: diagramName || modelToExport.title || 'Exported Diagram',
      icons: allIcons, // Include ALL icons (default + imported) for portability
      colors: modelToExport.colors || [],
      items: modelToExport.items || [],
      views: modelToExport.views || [],
      fitToScreen: true
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName || 'diagram'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    setHasUnsavedChanges(false); // Mark as saved after export
  };


  const handleDiagramManagerLoad = (id: string, data: any) => {
    // Load diagram from server storage
    // Server storage contains ALL icons (including imported), so use them directly
    const loadedIcons = data.icons || [];
    
    // Check if we have all default icons in the loaded data
    const hasAllDefaults = icons.every(defaultIcon => 
      loadedIcons.some((loadedIcon: any) => loadedIcon.id === defaultIcon.id)
    );
    
    // If the saved data has all icons, use it as-is
    // Otherwise, merge imported icons with defaults (for backward compatibility)
    let finalIcons;
    if (hasAllDefaults) {
      // Server saved all icons, use them directly
      finalIcons = loadedIcons;
    } else {
      // Old format or session storage - merge imported with defaults
      const importedIcons = loadedIcons.filter((icon: any) => icon.collection === 'imported');
      finalIcons = [...icons, ...importedIcons];
    }
    
    const mergedData: DiagramData = {
      ...data,
      title: data.title || data.name || 'Loaded Diagram',
      icons: finalIcons,
      colors: data.colors?.length ? data.colors : DEFAULT_COLORS,
      fitToScreen: data.fitToScreen !== false
    };
    
    setDiagramData(mergedData);
    setDiagramName(data.name || 'Loaded Diagram');
    setCurrentModel(mergedData);
    setCurrentDiagram({
      id,
      name: data.name || 'Loaded Diagram',
      data: mergedData,
      createdAt: data.created || new Date().toISOString(),
      updatedAt: data.lastModified || new Date().toISOString()
    });
    setFossflowKey(prev => prev + 1); // Force re-render
    setHasUnsavedChanges(false);
  };

  // i18n
  const [canI18n, setCanI18n] = useState(false);
  const { t, i18n } = useTranslation('app');
  useEffect(() => {
    // http://localhost:3000/?canI18n=1
    const params = new URLSearchParams(window.location.search);
    // show demo
    setCanI18n(params.get('canI18n') === '1');
  }, [window.location.search]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!currentModel || !hasUnsavedChanges || !currentDiagram || isAutoSavingRef.current) return;
    
    const autoSaveTimer = setTimeout(() => {
      isAutoSavingRef.current = true;
      // Include imported icons in auto-save
      const importedIcons = (currentModel?.icons || diagramData.icons || [])
        .filter(icon => icon.collection === 'imported');
      
      const savedData = {
        title: diagramName || currentDiagram.name,
        icons: importedIcons, // Save imported icons in auto-save
        colors: currentModel.colors || [],
        items: currentModel.items || [],
        views: currentModel.views || [],
        fitToScreen: true
      };
      
      const updatedDiagram: SavedDiagram = {
        ...currentDiagram,
        data: savedData,
        updatedAt: new Date().toISOString()
      };
      
      setDiagrams(prevDiagrams => 
        prevDiagrams.map(d => d.id === currentDiagram.id ? updatedDiagram : d)
      );
      
      // Update last opened data
      try {
        localStorage.setItem('fossflow-last-opened-data', JSON.stringify(savedData));
        setLastAutoSave(new Date());
        setHasUnsavedChanges(false);
        isAutoSavingRef.current = false;
      } catch (e) {
        console.error('Auto-save failed:', e);
        isAutoSavingRef.current = false;
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          alert('Storage full! Please use Storage Manager to free up space.');
          setShowStorageManager(true);
        }
      }
    }, 5000); // Auto-save after 5 seconds of changes
    
    return () => clearTimeout(autoSaveTimer);
  }, [currentModel, hasUnsavedChanges, currentDiagram, diagramName]);
  
  // Warn before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="App">
      <div className="toolbar">
        {canI18n && <ChangeLanguage />}
        <button onClick={newDiagram}>{t('nav.newDiagram')}</button>
        {serverStorageAvailable && (
          <button 
            onClick={() => setShowDiagramManager(true)}
            style={{ backgroundColor: '#2196F3', color: 'white' }}
          >
            🌐 {t('nav.serverStorage')}
          </button>
        )}
        <button onClick={() => setShowSaveDialog(true)}>{t('nav.saveSessionOnly')}</button>
        <button onClick={() => setShowLoadDialog(true)}>{t('nav.loadSessionOnly')}</button>
        <button 
          onClick={() => setShowExportDialog(true)}
          style={{ backgroundColor: '#007bff' }}
        >
          💾 {t('nav.exportFile')}
        </button>
        <button 
          onClick={() => {
            if (currentDiagram && hasUnsavedChanges) {
              saveDiagram();
            }
          }}
          disabled={!currentDiagram || !hasUnsavedChanges}
          style={{ 
            backgroundColor: currentDiagram && hasUnsavedChanges ? '#ffc107' : '#6c757d',
            opacity: currentDiagram && hasUnsavedChanges ? 1 : 0.5,
            cursor: currentDiagram && hasUnsavedChanges ? 'pointer' : 'not-allowed'
          }}
          title="Save to current session only"
        >
          {t('nav.quickSaveSession')}
        </button>
        <span className="current-diagram">
          {currentDiagram ? `Current: ${currentDiagram.name}` : diagramName || 'Untitled Diagram'}
          {hasUnsavedChanges && <span style={{ color: '#ff9800', marginLeft: '10px' }}>• Modified</span>}
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
            (Session storage only - export to save permanently)
          </span>
        </span>
      </div>

      <div className="fossflow-container">
        {/* Show loading state until configuration is ready */}
        {!iconMenuConfig.isInitialized ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px', 
            fontSize: '18px',
            color: '#666'
          }}>
            🔧 Loading icon configuration...
          </div>
        ) : (
          <Isoflow 
            key={`${fossflowKey}-${forceRenderKey}`}
            initialData={preparedInitialData}
            onModelUpdated={handleModelUpdated}
            editorMode="EDITABLE"
            locale={allLocales[i18n.language as keyof typeof allLocales]}
          />
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Save Diagram (Current Session Only)</h2>
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Important:</strong> This save is temporary and will be lost when you close the browser.
              <br />
              Use <strong>Export File</strong> to permanently save your work.
            </div>
            <input
              type="text"
              placeholder="Enter diagram name"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveDiagram()}
              autoFocus
            />
            <div className="dialog-buttons">
              <button onClick={saveDiagram}>Save</button>
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Load Diagram (Current Session Only)</h2>
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Note:</strong> These saves are temporary. Export your diagrams to keep them permanently.
            </div>
            <div className="diagram-list">
              {diagrams.length === 0 ? (
                <p>No saved diagrams found in this session</p>
              ) : (
                diagrams.map(diagram => (
                  <div key={diagram.id} className="diagram-item">
                    <div>
                      <strong>{diagram.name}</strong>
                      <br />
                      <small>Updated: {new Date(diagram.updatedAt).toLocaleString()}</small>
                    </div>
                    <div className="diagram-actions">
                      <button onClick={() => loadDiagram(diagram)}>Load</button>
                      <button onClick={() => deleteDiagram(diagram.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowLoadDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}


      {/* Export Dialog */}
      {showExportDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Export Diagram</h2>
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>✅ Recommended:</strong> This is the best way to save your work permanently.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>
                Exported JSON files can be imported later or shared with others.
              </p>
            </div>
            <div className="dialog-buttons">
              <button onClick={exportDiagram}>Download JSON</button>
              <button onClick={() => setShowExportDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Manager */}
      {showStorageManager && (
        <StorageManager onClose={() => setShowStorageManager(false)} />
      )}

      {/* Diagram Manager */}
      {showDiagramManager && (
        <DiagramManager
          onLoadDiagram={handleDiagramManagerLoad}
          currentDiagramId={currentDiagram?.id}
          currentDiagramData={currentModel || diagramData}
          onClose={() => setShowDiagramManager(false)}
        />
      )}

      {/* PixoFlow version indicator */}
      <div className="pixoflow-indicator">
        PixoFlow
      </div>
    </div>
  );
}

export default App;
