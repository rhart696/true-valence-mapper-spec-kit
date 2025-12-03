import { useCanvasState } from '../../hooks/useCanvasState';
import { Node } from '../Node/Node';
import { NodeEditor } from '../NodeEditor/NodeEditor';
import type { Position } from '../../types';
import styles from './Canvas.module.css';

/**
 * Main canvas component for the relationship mapper.
 *
 * Renders the canvas container with all person nodes.
 * Handles drag-and-drop positioning for nodes.
 * Provides UI for adding new people.
 */
export function Canvas() {
  const { state, addNode, updateNodePosition } = useCanvasState();

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

  return (
    <div className={styles.canvasContainer}>
      {/* Node editor at top */}
      <div className={styles.editorContainer}>
        <NodeEditor onAddPerson={handleAddPerson} />
      </div>

      {/* Canvas with nodes */}
      <div className={styles.canvas}>
        {/* Render all nodes */}
        {state.nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onPositionChange={handleNodePositionChange}
          />
        ))}
      </div>
    </div>
  );
}
