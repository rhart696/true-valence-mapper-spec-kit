import { useState } from 'react';
import type { TrustLevel, TrustScore } from '../../types';
import styles from './TrustScoreEditor.module.css';

interface TrustScoreEditorProps {
  personName: string;
  currentScore?: TrustScore;
  onSave: (score: TrustScore) => void;
  onCancel: () => void;
}

/**
 * Editor for setting trust scores on a relationship.
 *
 * Allows coachee to set:
 * - Outward trust: How much they trust this person
 * - Inward trust: How much they perceive this person trusts them
 * - Uncertainty flag: Whether the relationship has unclear dynamics
 */
export function TrustScoreEditor({
  personName,
  currentScore,
  onSave,
  onCancel,
}: TrustScoreEditorProps) {
  const [outward, setOutward] = useState<TrustLevel>(
    currentScore?.outward ?? 'unscored'
  );
  const [inward, setInward] = useState<TrustLevel>(
    currentScore?.inward ?? 'unscored'
  );
  const [uncertain, setUncertain] = useState(
    currentScore?.uncertain ?? false
  );

  const handleSave = () => {
    onSave({ outward, inward, uncertain });
  };

  const trustLevels: TrustLevel[] = ['high', 'medium', 'low', 'unscored'];

  const getTrustLevelLabel = (level: TrustLevel): string => {
    switch (level) {
      case 'high':
        return 'High Trust';
      case 'medium':
        return 'Medium Trust';
      case 'low':
        return 'Low Trust';
      case 'unscored':
        return 'Not Scored';
    }
  };

  const getTrustLevelColor = (level: TrustLevel): string => {
    switch (level) {
      case 'high':
        return 'var(--trust-high)';
      case 'medium':
        return 'var(--trust-medium)';
      case 'low':
        return 'var(--trust-low)';
      case 'unscored':
        return 'var(--trust-unscored)';
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Trust Score: {personName}</h2>
        <p className={styles.subtitle}>
          Rate your trust in this relationship
        </p>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Your trust in {personName}
            <span className={styles.label}>(Outward)</span>
          </h3>
          <div className={styles.buttonGroup}>
            {trustLevels.map((level) => (
              <button
                key={`outward-${level}`}
                className={`${styles.trustButton} ${
                  outward === level ? styles.active : ''
                }`}
                style={{
                  '--trust-color': getTrustLevelColor(level),
                } as React.CSSProperties}
                onClick={() => setOutward(level)}
              >
                {getTrustLevelLabel(level)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            {personName}'s trust in you
            <span className={styles.label}>(Inward)</span>
          </h3>
          <div className={styles.buttonGroup}>
            {trustLevels.map((level) => (
              <button
                key={`inward-${level}`}
                className={`${styles.trustButton} ${
                  inward === level ? styles.active : ''
                }`}
                style={{
                  '--trust-color': getTrustLevelColor(level),
                } as React.CSSProperties}
                onClick={() => setInward(level)}
              >
                {getTrustLevelLabel(level)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={uncertain}
              onChange={(e) => setUncertain(e.target.checked)}
            />
            <span>This relationship feels uncertain or unclear</span>
          </label>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Trust Score
          </button>
        </div>
      </div>
    </div>
  );
}
