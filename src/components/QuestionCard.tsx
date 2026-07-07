import type { Question } from '../types';
import { parseBlanks } from '../utils/parseBlanks';

type QuestionCardProps = {
  question: Question;
  questionNumber: number;
  visibleBlanks: Set<string>;
  onToggleBlank: (blankKey: string) => void;
};

export function QuestionCard({
  question,
  questionNumber,
  visibleBlanks,
  onToggleBlank,
}: QuestionCardProps) {
  const parts = parseBlanks(question.text);

  return (
    <article className="question-card">
      <div className="question-number">Q{questionNumber}</div>
      <p className="question-text">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return <span key={`${question.id}-text-${index}`}>{part.value}</span>;
          }

          const blankKey = `${question.id}:${part.blankIndex}`;
          const isVisible = visibleBlanks.has(blankKey);

          return (
            <button
              className={`blank ${isVisible ? 'blank-visible' : 'blank-hidden'}`}
              key={blankKey}
              type="button"
              onClick={() => onToggleBlank(blankKey)}
              aria-label={isVisible ? `${part.value}を隠す` : '答えを表示'}
              aria-pressed={isVisible}
            >
              {isVisible ? part.value : '■■■■'}
            </button>
          );
        })}
      </p>
      {question.memo ? <p className="memo">{question.memo}</p> : null}
    </article>
  );
}
