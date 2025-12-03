/**
 * Represents a person node in the relationship canvas.
 *
 * A node is either the user themselves (isSelf = true) or a person
 * in their network (isSelf = false). Each node has a unique ID,
 * a name (max 50 characters), and a position on the canvas.
 */
export interface PersonNode {
  /**
   * Unique identifier for the node.
   * Generated using crypto.randomUUID().
   */
  id: string;

  /**
   * Display name for the person.
   * Maximum 50 characters, automatically trimmed and sliced.
   */
  name: string;

  /**
   * Position of the node on the canvas in canvas coordinates.
   * Not affected by zoom/pan transformations.
   */
  position: { x: number; y: number };

  /**
   * Whether this node represents the user themselves.
   * Only one node per canvas should have isSelf = true.
   */
  isSelf: boolean;
}
