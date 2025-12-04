/**
 * Trust level for a relationship.
 * Based on MAP specification FR 3.2.
 */
export type TrustLevel = 'high' | 'medium' | 'low' | 'unscored';

/**
 * Trust score for a relationship edge.
 * Includes bidirectional trust and uncertainty/confidence.
 */
export interface TrustScore {
  /**
   * User's trust in this person ("Outward Trust").
   * How much the coachee trusts this individual.
   */
  outward: TrustLevel;

  /**
   * This person's perceived trust in the user ("Inward Trust").
   * The coachee's perception of how much this person trusts them.
   */
  inward: TrustLevel;

  /**
   * Uncertainty or lack of clarity about the relationship.
   * If true, indicates ambiguity or conditional trust.
   */
  uncertain: boolean;
}

/**
 * Represents a person node in the relationship canvas.
 *
 * A node is either the user themselves (isSelf = true) or a person
 * in their network (isSelf = false). Each node has a unique ID,
 * a name (max 50 characters), a position on the canvas, and optional
 * trust scoring data.
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

  /**
   * Trust scoring data for this relationship.
   * Undefined for the self node or if not yet scored.
   */
  trustScore?: TrustScore;
}
