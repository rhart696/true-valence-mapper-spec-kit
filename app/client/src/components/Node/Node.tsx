import { useRef, useCallback } from 'react';
import type { PersonNode, Position } from '../../types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './Node.module.css';

interface NodeProps {
  node: PersonNode;
  onPositionChange?: (nodeId: string, position: Position) => void;
}

/**
 * Individual person node component.
 *
 * Uses CSS transform for positioning (GPU-accelerated).
 * Supports drag-and-drop via pointer events.
 * Self node is not draggable.
 */
export function Node({ node, onPositionChange }: NodeProps) {
  const { id, name, position, isSelf } = node;
  const dragStartPos = useRef<Position>(position);

  const handleDragStart = useCallback(
    (nodeId: string, screenPos: Position) => {
      // Store initial position for offset calculations
      dragStartPos.current = position;
    },
    [position]
  );

  const handleDragMove = useCallback(
    (nodeId: string, screenPos: Position) => {
      if (!onPositionChange) return;

      // Calculate delta from drag start
      const deltaX = screenPos.x - dragStartPos.current.x;
      const deltaY = screenPos.y - dragStartPos.current.y;

      // Update node position with delta
      onPositionChange(nodeId, {
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      // Update drag start position for next move
      dragStartPos.current = screenPos;
    },
    [nodeId, position, onPositionChange]
  );

  const dragHandlers = useDragAndDrop(id, {
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    disabled: isSelf, // Self node is not draggable
  });

  return (
    <div
      className={`${styles.node} ${isSelf ? styles.selfNode : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      data-node-id={id}
      {...(!isSelf ? dragHandlers : {})}
    >
      <div className={styles.nodeCircle}></div>
      <div className={styles.nodeLabel}>{name}</div>
    </div>
  );
}
