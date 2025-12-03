/**
 * Represents a 2D coordinate position on the canvas.
 *
 * Positions are in canvas coordinate space (not screen pixels).
 * Canvas coordinates are independent of zoom/pan transformations.
 */
export interface Position {
  /**
   * Horizontal position in canvas units.
   */
  x: number;

  /**
   * Vertical position in canvas units.
   */
  y: number;
}
