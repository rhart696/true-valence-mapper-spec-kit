import type { PersonNode } from './node';

/**
 * View transformation state for zoom and pan.
 *
 * Applied to the canvas container to transform the view without
 * modifying the underlying node positions.
 */
export interface ViewTransform {
  /**
   * Zoom level multiplier.
   * Range: 0.5 (50%) to 2.0 (200%).
   * Default: 1.0 (100%).
   */
  zoom: number;

  /**
   * Horizontal pan offset in pixels.
   */
  panX: number;

  /**
   * Vertical pan offset in pixels.
   */
  panY: number;
}

/**
 * Complete state for the relationship canvas.
 *
 * Manages all nodes and view transformation state.
 */
export interface CanvasState {
  /**
   * All person nodes on the canvas.
   * Includes the self node (isSelf = true) and network nodes.
   */
  nodes: PersonNode[];

  /**
   * Current view transformation (zoom and pan).
   */
  viewTransform: ViewTransform;

  /**
   * ID of the node currently being edited, or null if none.
   * Used to track inline editing state.
   */
  editingNodeId: string | null;

  /**
   * ID of the node currently selected, or null if none.
   * Used for keyboard operations (delete, etc).
   */
  selectedNodeId: string | null;
}
