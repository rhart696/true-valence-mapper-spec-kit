import { useRef, useCallback } from 'react';
import type { Position } from '../types';

interface DragState {
  isDragging: boolean;
  startPosition: Position;
  currentPosition: Position;
}

interface UseDragAndDropOptions {
  onDragStart?: (nodeId: string, position: Position) => void;
  onDragMove?: (nodeId: string, position: Position) => void;
  onDragEnd?: (nodeId: string, position: Position) => void;
  disabled?: boolean;
}

/**
 * Custom hook for drag-and-drop functionality using Pointer Events API.
 *
 * Supports unified mouse and touch input with pointer capture for reliable
 * tracking across the entire viewport.
 *
 * @param nodeId - ID of the node being dragged
 * @param options - Drag callbacks and configuration
 * @returns Pointer event handlers to attach to the draggable element
 */
export function useDragAndDrop(
  nodeId: string,
  options: UseDragAndDropOptions = {}
) {
  const { onDragStart, onDragMove, onDragEnd, disabled = false } = options;

  const dragState = useRef<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;

      // Capture pointer for reliable tracking
      e.currentTarget.setPointerCapture(e.pointerId);

      dragState.current = {
        isDragging: true,
        startPosition: { x: e.clientX, y: e.clientY },
        currentPosition: { x: e.clientX, y: e.clientY },
      };

      onDragStart?.(nodeId, { x: e.clientX, y: e.clientY });
    },
    [nodeId, onDragStart, disabled]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!dragState.current.isDragging || disabled) return;

      const newPosition = { x: e.clientX, y: e.clientY };
      dragState.current.currentPosition = newPosition;

      onDragMove?.(nodeId, newPosition);
    },
    [nodeId, onDragMove, disabled]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!dragState.current.isDragging || disabled) return;

      // Release pointer capture
      e.currentTarget.releasePointerCapture(e.pointerId);

      const finalPosition = { x: e.clientX, y: e.clientY };

      onDragEnd?.(nodeId, finalPosition);

      dragState.current.isDragging = false;
    },
    [nodeId, onDragEnd, disabled]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
