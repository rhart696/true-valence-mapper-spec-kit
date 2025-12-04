import { Canvas } from '../components/Canvas/Canvas';

/**
 * Standalone test page for Relationship Canvas.
 * Access at: http://localhost:5174/canvas-test
 */
export function CanvasTest() {
  console.log('CanvasTest component rendering');
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas />
    </div>
  );
}
