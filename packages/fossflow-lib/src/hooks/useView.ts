import { useCallback, useRef } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useSceneStore } from 'src/stores/sceneStore';
import * as reducers from 'src/stores/reducers';
import { Model } from 'src/types';
import { INITIAL_SCENE_STATE } from 'src/config';

export const useView = () => {
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });

  const sceneActions = useSceneStore((state) => {
    return state.actions;
  });

  // Create stable references to prevent infinite re-renders
  const uiStateActionsRef = useRef(uiStateActions);
  uiStateActionsRef.current = uiStateActions;
  
  const sceneActionsRef = useRef(sceneActions);
  sceneActionsRef.current = sceneActions;

  const changeView = useCallback(
    (viewId: string, model: Model) => {
      const newState = reducers.view({
        action: 'SYNC_SCENE',
        payload: undefined,
        ctx: { viewId, state: { model, scene: INITIAL_SCENE_STATE } }
      });

      sceneActionsRef.current.set(newState.scene);
      uiStateActionsRef.current.setView(viewId);
    },
    [] // Remove dependencies to prevent re-creation
  );

  return {
    changeView
  };
};
