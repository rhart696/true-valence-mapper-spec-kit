import { useRef, useCallback, useState } from 'react';
import type { PersonNode, Position } from '../../types';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import styles from './Node.module.css';

interface NodeProps {
  node: PersonNode;
  isEditing?: boolean;
  isSelected?: boolean;
  onPositionChange?: (nodeId: string, position: Position) => void;
  onNameChange?: (nodeId: string, name: string) => void;
  onRemove?: (nodeId: string) => void;
  onStartEdit?: (nodeId: string) => void;
  onStopEdit?: () => void;
  onStartScoring?: (nodeId: string) => void;
  onSelect?: (nodeId: string) => void;
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
  isSelected = false,
  onPositionChange,
  onNameChange,
  onRemove,
  onStartEdit,
  onStopEdit,
  onStartScoring,
  onSelect,
}: NodeProps) {
  const { id, name, position, isSelf } = node;
  const dragStartPos = useRef<Position>(position);
  const [editValue, setEditValue] = useState(name);

  const handleDragStart = useCallback(
    (_nodeId: string, screenPos: Position) => {
      // Store initial screen position for delta calculations
      dragStartPos.current = screenPos;
    },
    []
  );

  const handleDragMove = useCallback(
    (nodeId: string, screenPos: Position) => {
      if (!onPositionChange) return;

      // Calculate delta from drag start (screen coordinates)
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't open edit mode if clicking on a button
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    // Select the node for keyboard operations
    onSelect?.(id);
    // Single click enables edit mode (rename) for non-self nodes
    if (!isSelf && onStartEdit) {
      onStartEdit(id);
      setEditValue(name);
    }
  }, [id, name, isSelf, onStartEdit, onSelect]);

  const handleDoubleClick = useCallback(() => {
    // Double click opens trust scoring
    if (!isSelf && !isEditing && onStartScoring) {
      onStartScoring(id);
    }
  }, [id, isSelf, isEditing, onStartScoring]);

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

  const { trustScore } = node;

  return (
    <div
      className={`${styles.node} ${isSelf ? styles.selfNode : ''} ${
        isEditing ? styles.editing : ''
      } ${isSelected ? styles.selected : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      data-node-id={id}
      data-trust-level={trustScore?.outward ?? 'unscored'}
      data-uncertain={trustScore?.uncertain ? 'true' : 'false'}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...(!isSelf && !isEditing ? dragHandlers : {})}
    >
      <div className={styles.nodeCircle}>
        {!isSelf && !isEditing && (
          <>
            <button
              className={styles.trustButton}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStartScoring?.(id);
              }}
              title="Set trust score"
            >
              ♥
            </button>
            <button
              className={styles.removeButton}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={handleRemove}
              title="Remove person"
            >
              ×
            </button>
          </>
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
