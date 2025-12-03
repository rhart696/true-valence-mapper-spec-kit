import { useState, useCallback } from 'react';
import type { CanvasState, PersonNode, Position } from '../types';

/**
 * Custom hook for managing canvas state.
 *
 * Provides state and CRUD operations for the relationship canvas:
 * - Initial state with self node at center
 * - Add, update, remove person nodes
 * - Update view transformation (zoom/pan)
 * - Track editing state for inline editing
 */
export function useCanvasState() {
  const [state, setState] = useState<CanvasState>({
    nodes: [
      {
        id: crypto.randomUUID(),
        name: 'You',
        position: { x: 400, y: 300 },
        isSelf: true,
      },
    ],
    viewTransform: {
      zoom: 1.0,
      panX: 0,
      panY: 0,
    },
    editingNodeId: null,
  });

  /**
   * Add a new person node to the canvas.
   * Name is trimmed and limited to 50 characters.
   */
  const addNode = useCallback((name: string, position: Position) => {
    const sanitizedName = name.trim().slice(0, 50);

    if (!sanitizedName) {
      return; // Don't add empty nodes
    }

    const newNode: PersonNode = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      position,
      isSelf: false,
    };

    setState((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
  }, []);

  /**
   * Update an existing node's position.
   */
  const updateNodePosition = useCallback((nodeId: string, position: Position) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    }));
  }, []);

  /**
   * Update an existing node's name.
   * Name is trimmed and limited to 50 characters.
   */
  const updateNodeName = useCallback((nodeId: string, name: string) => {
    const sanitizedName = name.trim().slice(0, 50);

    if (!sanitizedName) {
      return; // Don't allow empty names
    }

    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, name: sanitizedName } : node
      ),
    }));
  }, []);

  /**
   * Remove a node from the canvas.
   * Cannot remove the self node.
   */
  const removeNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId || node.isSelf),
      editingNodeId: prev.editingNodeId === nodeId ? null : prev.editingNodeId,
    }));
  }, []);

  /**
   * Update the view transformation (zoom and pan).
   * Zoom is clamped to 0.5-2.0 range.
   */
  const updateViewTransform = useCallback((
    updates: Partial<{ zoom: number; panX: number; panY: number }>
  ) => {
    setState((prev) => ({
      ...prev,
      viewTransform: {
        ...prev.viewTransform,
        ...updates,
        // Clamp zoom to valid range
        zoom: updates.zoom !== undefined
          ? Math.max(0.5, Math.min(2.0, updates.zoom))
          : prev.viewTransform.zoom,
      },
    }));
  }, []);

  /**
   * Set the ID of the node being edited (or null to clear).
   */
  const setEditingNodeId = useCallback((nodeId: string | null) => {
    setState((prev) => ({
      ...prev,
      editingNodeId: nodeId,
    }));
  }, []);

  return {
    state,
    addNode,
    updateNodePosition,
    updateNodeName,
    removeNode,
    updateViewTransform,
    setEditingNodeId,
  };
}
