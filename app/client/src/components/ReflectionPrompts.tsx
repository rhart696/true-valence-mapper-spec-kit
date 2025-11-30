import { Lightbulb } from 'lucide-react';
import { type ValenceScores } from './ValenceControl';

interface ReflectionPromptsProps {
    scores?: ValenceScores;
    category?: string;
}

export function ReflectionPrompts({ scores, category }: ReflectionPromptsProps) {
    const getPrompts = () => {
        const prompts = [];

        // General prompt if nothing specific
        if (!scores) {
            return [
                `Who are the key people influencing your success right now? (${category || 'General'})`,
                "Are there any 'invisible' relationships you haven't mapped yet?"
            ];
        }

        // ProActive specific logic
        if (scores.trust < 0) {
            prompts.push("Trust is low. What is one small commitment you can make and keep to rebuild trust?");
        }
        if (scores.alignment < 0) {
            prompts.push("Goal alignment is misaligned. Have you explicitly discussed your shared objectives recently?");
        }
        if (scores.communication > 3) {
            prompts.push("Communication is strong. How can you leverage this to improve other dimensions?");
        }

        if (prompts.length === 0) {
            prompts.push("This relationship seems balanced. What would take it from 'good' to 'great'?");
        }

        return prompts;
    };

    const prompts = getPrompts();

    return (
        <div className="reflection-prompts" style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem',
            border: '1px solid #bae6fd'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0369a1' }}>
                <Lightbulb size={18} />
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>ProActive Reflection</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#0c4a6e' }}>
                {prompts.map((prompt, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{prompt}</li>
                ))}
            </ul>
        </div>
    );
}
