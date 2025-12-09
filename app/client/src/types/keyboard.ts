/**
 * Keyboard shortcut type definitions for the canvas.
 *
 * @see specs/002-keyboard-shortcuts/data-model.md
 */

/**
 * All possible keyboard shortcut actions.
 */
export type KeyboardShortcutAction =
  | 'cancel'    // Escape - close edit mode/modal
  | 'confirm'   // Enter - save and close
  | 'zoomIn'    // + or = key
  | 'zoomOut'   // - key
  | 'panUp'     // ArrowUp
  | 'panDown'   // ArrowDown
  | 'panLeft'   // ArrowLeft
  | 'panRight'  // ArrowRight
  | 'delete'    // Delete or Backspace
  | 'center';   // Space bar

/**
 * Pan direction for arrow key navigation.
 */
export type PanDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Configuration options for the useKeyboardShortcuts hook.
 */
export interface UseKeyboardShortcutsOptions {
  /** Global enable/disable for all shortcuts */
  enabled: boolean;
  /** Escape key handler - cancel edit mode or close modal */
  onCancel?: () => void;
  /** Enter key handler - confirm/save changes */
  onConfirm?: () => void;
  /** Zoom handler - receives +1 for zoom in, -1 for zoom out */
  onZoom?: (delta: number) => void;
  /** Pan handler - receives direction for arrow key navigation */
  onPan?: (direction: PanDirection) => void;
  /** Delete handler - delete selected node */
  onDelete?: () => void;
  /** Center handler - center view on self node */
  onCenter?: () => void;
}
