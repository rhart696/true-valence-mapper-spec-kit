import { useRef, useCallback, useState } from 'react';
import { useCanvasState } from '../../hooks/useCanvasState';
import { Node } from '../Node/Node';
import { NodeEditor } from '../NodeEditor/NodeEditor';
import { ZoomPanControls } from '../ZoomPanControls/ZoomPanControls';
import { TrustScoreEditor } from '../TrustScoreEditor/TrustScoreEditor';
import type { Position, TrustScore } from '../../types';
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
    updateTrustScore,
  } = useCanvasState();

  const canvasRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastTouchDistance = useRef<number | null>(null);

  // Track which node is having its trust score edited
  const [scoringNodeId, setScoringNodeId] = useState<string | null>(null);

  const handleNodePositionChange = (nodeId: string, position: Position) => {
    updateNodePosition(nodeId, position);
  };

  const handleAddPerson = (name: string) => {
    // Calculate radial position around center (400, 300)
    // Non-self nodes are arranged in a circle around the center
    const nonSelfNodes = state.nodes.filter(n => !n.isSelf);
    const nodeIndex = nonSelfNodes.length;

    // Distribute nodes evenly in a circle
    // Radius: 150px from center
    const radius = 150;
    const angleStep = (2 * Math.PI) / Math.max(1, nonSelfNodes.length + 1);
    const angle = nodeIndex * angleStep;

    const x = 400 + radius * Math.cos(angle);
    const y = 300 + radius * Math.sin(angle);

    addNode(name, { x, y });

    // Reposition existing nodes to maintain even spacing
    nonSelfNodes.forEach((node, index) => {
      const newAngle = index * angleStep;
      const newX = 400 + radius * Math.cos(newAngle);
      const newY = 300 + radius * Math.sin(newAngle);
      updateNodePosition(node.id, { x: newX, y: newY });
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

  // Trust scoring handlers
  const handleStartScoring = (nodeId: string) => {
    setScoringNodeId(nodeId);
  };

  const handleSaveTrustScore = (trustScore: TrustScore) => {
    if (scoringNodeId) {
      updateTrustScore(scoringNodeId, trustScore);
      setScoringNodeId(null);
    }
  };

  const handleCancelTrustScore = () => {
    setScoringNodeId(null);
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
              onStartScoring={handleStartScoring}
            />
          ))}
        </div>
      </div>

      {/* Trust score editor modal */}
      {scoringNodeId && (
        <TrustScoreEditor
          personName={
            state.nodes.find((n) => n.id === scoringNodeId)?.name ?? 'Unknown'
          }
          currentScore={
            state.nodes.find((n) => n.id === scoringNodeId)?.trustScore
          }
          onSave={handleSaveTrustScore}
          onCancel={handleCancelTrustScore}
        />
      )}
    </div>
  );
}
