import type { ViewTransform } from '../../types';
import styles from './ZoomPanControls.module.css';

interface ZoomPanControlsProps {
  viewTransform: ViewTransform;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

/**
 * Controls for zoom and pan operations.
 *
 * Provides buttons for zoom in, zoom out, and reset view.
 * Displays current zoom level.
 */
export function ZoomPanControls({
  viewTransform,
  onZoomIn,
  onZoomOut,
  onResetView,
}: ZoomPanControlsProps) {
  const zoomPercentage = Math.round(viewTransform.zoom * 100);
  const canZoomIn = viewTransform.zoom < 2.0;
  const canZoomOut = viewTransform.zoom > 0.5;

  return (
    <div className={styles.controls}>
      <button
        className={styles.button}
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title="Zoom out (50% minimum)"
      >
        −
      </button>
      <div className={styles.zoomLevel}>{zoomPercentage}%</div>
      <button
        className={styles.button}
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title="Zoom in (200% maximum)"
      >
        +
      </button>
      <button
        className={styles.resetButton}
        onClick={onResetView}
        title="Reset zoom and pan"
      >
        Reset
      </button>
    </div>
  );
}
