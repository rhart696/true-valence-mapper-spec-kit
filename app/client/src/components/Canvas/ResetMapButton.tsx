import styles from './ResetMapButton.module.css';

interface ResetMapButtonProps {
  onReset: () => void;
}

/**
 * Button to reset the canvas map with confirmation dialog.
 * Prevents accidental data loss by requiring explicit confirmation.
 */
export function ResetMapButton({ onReset }: ResetMapButtonProps) {
  const handleClick = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear your map? This cannot be undone.'
    );

    if (confirmed) {
      onReset();
    }
  };

  return (
    <button
      className={styles.resetButton}
      onClick={handleClick}
      type="button"
      title="Clear all nodes and start fresh"
    >
      Reset Map
    </button>
  );
}
