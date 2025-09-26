import { produce } from 'immer';
import { ModeActions, PlaceIconMode } from 'src/types';
import { generateId, getItemAtTile, findNearestUnoccupiedTile } from 'src/utils';
import { VIEW_ITEM_DEFAULTS } from 'src/config';

export const PlaceIcon: ModeActions = {
  mousemove: () => {},
  mousedown: ({ uiState, scene, isRendererInteraction }) => {
    if (uiState.mode.type !== 'PLACE_ICON' || !isRendererInteraction) return;

    // Type guard to ensure uiState.mode is PlaceIconMode
    const placeIconMode = uiState.mode as PlaceIconMode;
    if (!placeIconMode.id) {
      const itemAtTile = getItemAtTile({
        tile: uiState.mouse.position.tile,
        scene
      });

      uiState.actions.setMode({
        type: 'CURSOR',
        mousedownItem: itemAtTile,
        showCursor: true
      });

      uiState.actions.setItemControls(null);
    }
  },
  mouseup: ({ uiState, scene, model }) => {
    if (uiState.mode.type !== 'PLACE_ICON') return;

    // Type guard to ensure uiState.mode is PlaceIconMode
    const placeIconMode = uiState.mode as PlaceIconMode;
    if (placeIconMode.id !== null) {
      // Find the nearest unoccupied tile to the target position
      const targetTile = findNearestUnoccupiedTile(
        uiState.mouse.position.tile,
        scene
      );

      // Place the icon on the nearest unoccupied tile
      if (targetTile) {
        const modelItemId = generateId();

        // Look up the icon to get its name for a better default
        const iconData = model.icons.find(icon => icon.id === placeIconMode.id);
        const defaultName = iconData?.name || 'Untitled';
        
        // Debug logging to understand the issue
        console.log('🔍 PlaceIcon Debug:', {
          modeId: placeIconMode.id,
          foundIcon: iconData ? { id: iconData.id, name: iconData.name } : null,
          defaultName,
          totalIcons: model.icons.length,
          sampleIcons: model.icons.slice(0, 3).map(icon => ({ id: icon.id, name: icon.name }))
        });

        scene.placeIcon({
          modelItem: {
            id: modelItemId,
            name: defaultName,
            icon: placeIconMode.id
          },
          viewItem: {
            ...VIEW_ITEM_DEFAULTS,
            id: modelItemId,
            tile: targetTile
          }
        });
      }
    }

    uiState.actions.setMode(
      produce(uiState.mode, (draft) => {
        draft.id = null;
      })
    );
  }
};
