import { useState } from 'react';
import styles from './NodeEditor.module.css';

interface NodeEditorProps {
  onAddPerson: (name: string) => void;
}

/**
 * Form component for adding new people to the canvas.
 *
 * Provides a text input and submit button.
 * Validates name (non-empty, max 50 chars).
 * XSS protection via automatic sanitization in useCanvasState.
 */
export function NodeEditor({ onAddPerson }: NodeEditorProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      return; // Don't add empty names
    }

    onAddPerson(trimmedName);
    setName(''); // Clear input after adding
  };

  return (
    <form className={styles.editorForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.nameInput}
        placeholder="Enter person's name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={50}
        autoFocus
      />
      <button type="submit" className={styles.addButton}>
        Add Person
      </button>
    </form>
  );
}
