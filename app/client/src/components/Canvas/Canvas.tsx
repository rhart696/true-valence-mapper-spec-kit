import { useRef, useCallback } from 'react';
import { useCanvasState } from '../../hooks/useCanvasState';
import { Node } from '../Node/Node';
import { NodeEditor } from '../NodeEditor/NodeEditor';
import { ZoomPanControls } from '../ZoomPanControls/ZoomPanControls';
import type { Position } from '../../types';
import styles from './Canvas.module.css';

/**
 * Main canvas component for the relationship mapper.
 *
 * Renders the canvas container with all person nodes.
 * Handles drag-and-drop positioning for nodes.
 * Provides UI for adding new people.
 * Supports inline editing and removal of nodes.
 * Supports zoom (0.5x-2.0x) and pan via mouse wheel, pinch, and two-finger drag.
 */
export function Canvas() {
  const {
    state,
    addNode,
    updateNodePosition,
    updateNodeName,
    removeNode,
    setEditingNodeId,
    updateViewTransform,
  } = useCanvasState();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastTouchDistance = useRef<number | null>(null);

  const handleNodePositionChange = (nodeId: string, position: Position) => {
    updateNodePosition(nodeId, position);
  };

  const handleAddPerson = (name: string) => {
    // Add node with random offset from center (400, 300)
    // Random offset: -100 to +100 pixels in both directions
    const offsetX = Math.random() * 200 - 100;
    const offsetY = Math.random() * 200 - 100;

    addNode(name, {
      x: 400 + offsetX,
      y: 300 + offsetY,
    });
  };

  const handleNodeNameChange = (nodeId: string, name: string) => {
    updateNodeName(nodeId, name);
  };

  const handleNodeRemove = (nodeId: string) => {
    removeNode(nodeId);
  };

  const handleStartEdit = (nodeId: string) => {
    setEditingNodeId(nodeId);
  };

  const handleStopEdit = () => {
    setEditingNodeId(null);
  };

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(2.0, state.viewTransform.zoom + 0.1);
    updateViewTransform({ zoom: newZoom });
  }, [state.viewTransform.zoom, updateViewTransform]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(0.5, state.viewTransform.zoom - 0.1);
    updateViewTransform({ zoom: newZoom });
  }, [state.viewTransform.zoom, updateViewTransform]);

  const handleResetView = useCallback(() => {
    updateViewTransform({ zoom: 1.0, panX: 0, panY: 0 });
  }, [updateViewTransform]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.max(0.5, Math.min(2.0, state.viewTransform.zoom + delta));
      updateViewTransform({ zoom: newZoom });
    },
    [state.viewTransform.zoom, updateViewTransform]
  );

  // Touch events for pinch-to-zoom and two-finger pan
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistance.current = distance;
      isPanningRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        // Pinch-to-zoom
        const zoomDelta = (distance - lastTouchDistance.current) * 0.01;
        const newZoom = Math.max(
          0.5,
          Math.min(2.0, state.viewTransform.zoom + zoomDelta)
        );

        // Two-finger pan (use center point movement)
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        updateViewTransform({ zoom: newZoom });
        lastTouchDistance.current = distance;
      }
    },
    [state.viewTransform.zoom, updateViewTransform]
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchDistance.current = null;
    isPanningRef.current = false;
  }, []);

  return (
    <div className={styles.canvasContainer}>
      {/* Node editor and zoom controls at top */}
      <div className={styles.topControls}>
        <NodeEditor onAddPerson={handleAddPerson} />
        <ZoomPanControls
          viewTransform={state.viewTransform}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />
      </div>

      {/* Canvas with nodes */}
      <div
        ref={canvasRef}
        className={styles.canvas}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.canvasTransform}
          style={{
            transform: `scale(${state.viewTransform.zoom}) translate(${state.viewTransform.panX}px, ${state.viewTransform.panY}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Render all nodes */}
          {state.nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              isEditing={state.editingNodeId === node.id}
              onPositionChange={handleNodePositionChange}
              onNameChange={handleNodeNameChange}
              onRemove={handleNodeRemove}
              onStartEdit={handleStartEdit}
              onStopEdit={handleStopEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
