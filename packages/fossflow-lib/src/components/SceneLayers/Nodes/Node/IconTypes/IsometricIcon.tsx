import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { useResizeObserver } from 'src/hooks/useResizeObserver';

interface Props {
  url: string;
  scale?: number;
  flipX?: boolean;
  flipY?: boolean;
  onImageLoaded?: () => void;
}

export const IsometricIcon = ({ url, scale = 1, flipX = false, flipY = false, onImageLoaded }: Props) => {
  const ref = useRef();
  const { size, observe, disconnect } = useResizeObserver();

  useEffect(() => {
    if (!ref.current) return;

    observe(ref.current);

    return disconnect;
  }, [observe, disconnect]);

  const flipTransform = `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`;

  return (
    <Box
      ref={ref}
      component="img"
      onLoad={onImageLoaded}
      src={url}
      sx={{
        position: 'absolute',
        width: PROJECTED_TILE_SIZE.width * 0.8 * scale,
        top: -size.height,
        left: -size.width / 2,
        transform: flipTransform,
        pointerEvents: 'none'
      }}
    />
  );
};
