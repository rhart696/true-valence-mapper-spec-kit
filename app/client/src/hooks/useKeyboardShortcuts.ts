import { useEffect, useCallback } from 'react';
import type { UseKeyboardShortcutsOptions } from '../types';

/**
 * Check if a text input element currently has focus.
 * When true, keyboard shortcuts should be disabled to allow normal typing.
 */
const isTextInputFocused = (): boolean => {
  const active = document.activeElement;
  if (!active) return false;

  const tagName = active.tagName.toUpperCase();
  if (tagName === 'INPUT' || tagName === 'TEXTAREA') return true;
  if (active.getAttribute('contenteditable') === 'true') return true;

  return false;
};

/**
 * Hook to handle keyboard shortcuts for the canvas.
 *
 * Shortcuts are disabled when:
 * - `enabled` is false
 * - A text input has focus (to allow typing)
 *
 * @see specs/002-keyboard-shortcuts/spec.md
 * @see specs/002-keyboard-shortcuts/research.md
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const {
    enabled,
    onCancel,
    onConfirm,
    onZoom,
    onPan,
    onDelete,
    onCenter,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if shortcuts are disabled globally
      if (!enabled) return;

      // Skip if user is typing in a text input
      if (isTextInputFocused()) return;

      const { key } = event;

      switch (key) {
        // Cancel - Escape key
        case 'Escape':
          if (onCancel) {
            event.preventDefault();
            onCancel();
          }
          break;

        // Confirm - Enter key
        case 'Enter':
          if (onConfirm) {
            event.preventDefault();
            onConfirm();
          }
          break;

        // Zoom in - Plus or Equals key
        case '+':
        case '=':
          if (onZoom) {
            event.preventDefault();
            onZoom(1);
          }
          break;

        // Zoom out - Minus or Underscore key
        case '-':
        case '_':
          if (onZoom) {
            event.preventDefault();
            onZoom(-1);
          }
          break;

        // Pan - Arrow keys
        case 'ArrowUp':
          if (onPan) {
            event.preventDefault();
            onPan('up');
          }
          break;

        case 'ArrowDown':
          if (onPan) {
            event.preventDefault();
            onPan('down');
          }
          break;

        case 'ArrowLeft':
          if (onPan) {
            event.preventDefault();
            onPan('left');
          }
          break;

        case 'ArrowRight':
          if (onPan) {
            event.preventDefault();
            onPan('right');
          }
          break;

        // Delete - Delete or Backspace key
        case 'Delete':
        case 'Backspace':
          if (onDelete) {
            event.preventDefault();
            onDelete();
          }
          break;

        // Center - Space bar
        case ' ':
          if (onCenter) {
            event.preventDefault();
            onCenter();
          }
          break;
      }
    },
    [enabled, onCancel, onConfirm, onZoom, onPan, onDelete, onCenter]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
