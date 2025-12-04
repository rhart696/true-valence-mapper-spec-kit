import { useRef, useCallback, useState } from 'react';
import type { PersonNode, Position } from '../../types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './Node.module.css';

interface NodeProps {
  node: PersonNode;
  isEditing?: boolean;
  onPositionChange?: (nodeId: string, position: Position) => void;
  onNameChange?: (nodeId: string, name: string) => void;
  onRemove?: (nodeId: string) => void;
  onStartEdit?: (nodeId: string) => void;
  onStopEdit?: () => void;
}

/**
 * Individual person node component.
 *
 * Uses CSS transform for positioning (GPU-accelerated).
 * Supports drag-and-drop via pointer events.
 * Supports inline editing via double-click.
 * Self node is not draggable or deletable.
 */
export function Node({
  node,
  isEditing = false,
  onPositionChange,
  onNameChange,
  onRemove,
  onStartEdit,
  onStopEdit,
}: NodeProps) {
  const { id, name, position, isSelf } = node;
  const dragStartPos = useRef<Position>(position);
  const [editValue, setEditValue] = useState(name);

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
    [id, position, onPositionChange]
  );

  const dragHandlers = useDragAndDrop(id, {
    onDragStart: handleDragStart,
    onDragMove: handleDragMove,
    disabled: isSelf || isEditing, // Disable drag when editing
  });

  const handleDoubleClick = useCallback(() => {
    if (!isSelf && onStartEdit) {
      onStartEdit(id);
      setEditValue(name);
    }
  }, [id, name, isSelf, onStartEdit]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const trimmedValue = editValue.trim();
        if (trimmedValue && onNameChange) {
          onNameChange(id, trimmedValue);
        }
        onStopEdit?.();
      } else if (e.key === 'Escape') {
        setEditValue(name);
        onStopEdit?.();
      }
    },
    [id, editValue, name, onNameChange, onStopEdit]
  );

  const handleEditBlur = useCallback(() => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && onNameChange) {
      onNameChange(id, trimmedValue);
    } else {
      setEditValue(name);
    }
    onStopEdit?.();
  }, [id, editValue, name, onNameChange, onStopEdit]);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isSelf && onRemove) {
        onRemove(id);
      }
    },
    [id, isSelf, onRemove]
  );

  return (
    <div
      className={`${styles.node} ${isSelf ? styles.selfNode : ''} ${
        isEditing ? styles.editing : ''
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      data-node-id={id}
      onDoubleClick={handleDoubleClick}
      {...(!isSelf && !isEditing ? dragHandlers : {})}
    >
      <div className={styles.nodeCircle}>
        {!isSelf && !isEditing && (
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            title="Remove person"
          >
            ×
          </button>
        )}
      </div>
      {isEditing ? (
        <input
          type="text"
          className={styles.nodeInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleEditBlur}
          maxLength={50}
          autoFocus
        />
      ) : (
        <div className={styles.nodeLabel}>{name}</div>
      )}
    </div>
  );
}
