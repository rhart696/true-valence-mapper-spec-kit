import { useState, useCallback, useEffect, useRef } from 'react';
import type { CanvasState, PersonNode, Position, TrustScore } from '../types';
import { loadState, saveState, clearState, createDefaultState } from '../services/storage';

/** Debounce delay for saving state (milliseconds) */
const DEBOUNCE_MS = 500;

/**
 * Custom hook for managing canvas state with localStorage persistence.
 *
 * Provides state and CRUD operations for the relationship canvas:
 * - Initial state loaded from localStorage (or defaults for new users)
 * - Automatic saving to localStorage on state changes (debounced)
 * - Add, update, remove person nodes
 * - Update view transformation (zoom/pan)
 * - Track editing state for inline editing
 * - Reset canvas to default state
 */
export function useCanvasState() {
  // Load initial state from localStorage
  const [state, setState] = useState<CanvasState>(() => {
    const persisted = loadState();
    return {
      nodes: persisted.nodes,
      viewTransform: persisted.viewTransform,
      editingNodeId: null,
      selectedNodeId: null,
    };
  });

  // Track if this is the initial mount (skip saving on first render)
  const isInitialMount = useRef(true);

  // Debounced save effect - only saves nodes and viewTransform
  useEffect(() => {
    // Skip saving on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveState(state.nodes, state.viewTransform);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [state.nodes, state.viewTransform]);

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
   * Clears editingNodeId and selectedNodeId if they reference the removed node.
   */
  const removeNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId || node.isSelf),
      editingNodeId: prev.editingNodeId === nodeId ? null : prev.editingNodeId,
      selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
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

  /**
   * Set the ID of the selected node for keyboard operations (or null to clear).
   * Selection is separate from editing - used by Delete key handler.
   */
  const setSelectedNodeId = useCallback((nodeId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
    }));
  }, []);

  /**
   * Update trust score for a node.
   * Cannot set trust score on self node.
   */
  const updateTrustScore = useCallback((nodeId: string, trustScore: TrustScore) => {
    setState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId && !node.isSelf
          ? { ...node, trustScore }
          : node
      ),
    }));
  }, []);

  /**
   * Reset canvas to default state (only "You" node).
   * Clears localStorage and resets to fresh state.
   */
  const resetCanvas = useCallback(() => {
    clearState();
    const defaultState = createDefaultState();
    setState({
      nodes: defaultState.nodes,
      viewTransform: defaultState.viewTransform,
      editingNodeId: null,
      selectedNodeId: null,
    });
  }, []);

  return {
    state,
    addNode,
    updateNodePosition,
    updateNodeName,
    removeNode,
    updateViewTransform,
    setEditingNodeId,
    setSelectedNodeId,
    updateTrustScore,
    resetCanvas,
  };
}
