import { useRef, useCallback, useState } from 'react';
import { useCanvasState } from '../../hooks/useCanvasState';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { Node } from '../Node/Node';
import { NodeEditor } from '../NodeEditor/NodeEditor';
import { ZoomPanControls } from '../ZoomPanControls/ZoomPanControls';
import { TrustScoreEditor } from '../TrustScoreEditor/TrustScoreEditor';
import { TrustArrows } from '../TrustArrows/TrustArrows';
import { ResetMapButton } from './ResetMapButton';
import type { Position, TrustScore, PanDirection } from '../../types';
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
    setSelectedNodeId,
    updateViewTransform,
    updateTrustScore,
    resetCanvas,
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
    // Get canvas dimensions for dynamic centering
    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Non-self nodes are arranged in a circle around the center
    const nonSelfNodes = state.nodes.filter(n => !n.isSelf);
    const nodeIndex = nonSelfNodes.length;

    // Distribute nodes evenly in a circle
    // Adaptive radius: grows with node count to prevent overlap
    // Base: 150px, grows by 20px per node after 8 nodes
    const totalNodes = nonSelfNodes.length + 1; // Include the new node
    const radius = totalNodes <= 8 ? 150 : 150 + (totalNodes - 8) * 20;

    const angleStep = (2 * Math.PI) / Math.max(1, totalNodes);
    const angle = nodeIndex * angleStep;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    addNode(name, { x, y });

    // Reposition existing nodes to maintain even spacing
    nonSelfNodes.forEach((node, index) => {
      const newAngle = index * angleStep;
      const newX = centerX + radius * Math.cos(newAngle);
      const newY = centerY + radius * Math.sin(newAngle);
      updateNodePosition(node.id, { x: newX, y: newY });
    });

    // Auto-zoom to fit all nodes when radius exceeds viewport
    // Account for node size (120px wide, 90px tall)
    const nodeMargin = 120; // Max node width + some padding
    const requiredWidth = (radius * 2) + nodeMargin;
    const requiredHeight = (radius * 2) + nodeMargin;

    // Calculate zoom needed to fit (use smaller dimension as constraint)
    const zoomX = canvasWidth / requiredWidth;
    const zoomY = canvasHeight / requiredHeight;
    const requiredZoom = Math.min(1.0, zoomX, zoomY);

    // Only zoom out if needed (don't zoom in)
    // Only auto-zoom when adding nodes, don't interfere with manual zoom
    if (requiredZoom < 1.0 && requiredZoom < state.viewTransform.zoom) {
      updateViewTransform({ zoom: requiredZoom });
    }
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

        // Two-finger pan could use center point movement
        // For now, only zoom is implemented

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

  // Keyboard shortcut handlers
  const handleKeyboardCancel = useCallback(() => {
    if (state.editingNodeId) {
      setEditingNodeId(null);
      return;
    }
    if (scoringNodeId) {
      setScoringNodeId(null);
      return;
    }
    if (state.selectedNodeId) {
      setSelectedNodeId(null);
    }
  }, [state.editingNodeId, state.selectedNodeId, scoringNodeId, setEditingNodeId, setSelectedNodeId]);

  const handleKeyboardConfirm = useCallback(() => {
    // Confirm is handled by Node component's onStopEdit for inline editing
  }, []);

  const handleKeyboardZoom = useCallback((delta: number) => {
    const zoomIncrement = 0.1;
    const newZoom = state.viewTransform.zoom + (delta * zoomIncrement);
    const clampedZoom = Math.max(0.25, Math.min(2.0, newZoom));
    updateViewTransform({ zoom: clampedZoom });
  }, [state.viewTransform.zoom, updateViewTransform]);

  const handleKeyboardPan = useCallback((direction: PanDirection) => {
    const panIncrement = 50;
    let newPanX = state.viewTransform.panX;
    let newPanY = state.viewTransform.panY;

    switch (direction) {
      case 'up':
        newPanY += panIncrement;
        break;
      case 'down':
        newPanY -= panIncrement;
        break;
      case 'left':
        newPanX += panIncrement;
        break;
      case 'right':
        newPanX -= panIncrement;
        break;
    }

    updateViewTransform({ panX: newPanX, panY: newPanY });
  }, [state.viewTransform.panX, state.viewTransform.panY, updateViewTransform]);

  const handleKeyboardDelete = useCallback(() => {
    if (!state.selectedNodeId) return;

    const selectedNode = state.nodes.find(n => n.id === state.selectedNodeId);
    if (!selectedNode || selectedNode.isSelf) return;

    removeNode(state.selectedNodeId);
  }, [state.selectedNodeId, state.nodes, removeNode]);

  const handleKeyboardCenter = useCallback(() => {
    const selfNode = state.nodes.find(n => n.isSelf);
    if (!selfNode) return;

    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const panX = centerX - selfNode.position.x;
    const panY = centerY - selfNode.position.y;

    updateViewTransform({ panX, panY });
  }, [state.nodes, updateViewTransform]);

  // Click on empty canvas to clear selection
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains(styles.canvasTransform)) {
      setSelectedNodeId(null);
      canvasRef.current?.focus();
    }
  }, [setSelectedNodeId]);

  // Node selection handler
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, [setSelectedNodeId]);

  // Determine if keyboard shortcuts should be enabled
  const keyboardEnabled = !state.editingNodeId && !scoringNodeId;

  // Initialize keyboard shortcuts hook
  useKeyboardShortcuts({
    enabled: keyboardEnabled,
    onCancel: handleKeyboardCancel,
    onConfirm: handleKeyboardConfirm,
    onZoom: handleKeyboardZoom,
    onPan: handleKeyboardPan,
    onDelete: handleKeyboardDelete,
    onCenter: handleKeyboardCenter,
  });

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
        <ResetMapButton onReset={resetCanvas} />
      </div>

      {/* Canvas with nodes */}
      <div
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={0}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Trust arrows layer (not transformed) */}
        <TrustArrows nodes={state.nodes} viewTransform={state.viewTransform} />

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
              isSelected={state.selectedNodeId === node.id}
              onPositionChange={handleNodePositionChange}
              onNameChange={handleNodeNameChange}
              onRemove={handleNodeRemove}
              onStartEdit={handleStartEdit}
              onStopEdit={handleStopEdit}
              onStartScoring={handleStartScoring}
              onSelect={handleNodeSelect}
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
