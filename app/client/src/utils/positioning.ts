import type { Position, ViewTransform } from '../types';

/**
 * Convert screen coordinates to canvas coordinates.
 *
 * Takes into account the canvas offset and current view transformation.
 * Used during drag operations to calculate node positions.
 *
 * @param screenX - X coordinate in screen pixels
 * @param screenY - Y coordinate in screen pixels
 * @param viewTransform - Current zoom and pan state
 * @param canvasOffset - Canvas element's position relative to viewport
 * @returns Position in canvas coordinate space
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  viewTransform: ViewTransform,
  canvasOffset: { left: number; top: number }
): Position {
  // Convert screen coordinates to canvas-relative coordinates
  const relativeX = screenX - canvasOffset.left;
  const relativeY = screenY - canvasOffset.top;

  // Apply inverse zoom and pan transformations
  return {
    x: (relativeX - viewTransform.panX) / viewTransform.zoom,
    y: (relativeY - viewTransform.panY) / viewTransform.zoom,
  };
}

/**
 * Convert canvas coordinates to screen coordinates.
 *
 * Applies the current view transformation to get screen position.
 * Used for rendering and hit testing.
 *
 * @param canvasX - X coordinate in canvas space
 * @param canvasY - Y coordinate in canvas space
 * @param viewTransform - Current zoom and pan state
 * @param canvasOffset - Canvas element's position relative to viewport
 * @returns Position in screen coordinate space
 */
export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  viewTransform: ViewTransform,
  canvasOffset: { left: number; top: number }
): Position {
  // Apply zoom and pan transformations
  const transformedX = canvasX * viewTransform.zoom + viewTransform.panX;
  const transformedY = canvasY * viewTransform.zoom + viewTransform.panY;

  // Convert to screen coordinates
  return {
    x: transformedX + canvasOffset.left,
    y: transformedY + canvasOffset.top,
  };
}
