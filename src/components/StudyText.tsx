import type { StudySection } from '../types';
import { parseBlanks } from '../utils/parseBlanks';

type StudyTextProps = {
  sections: StudySection[];
  visibleBlanks: Set<string>;
  onToggleBlank: (blankKey: string) => void;
};

export function StudyText({ sections, visibleBlanks, onToggleBlank }: StudyTextProps) {
  return (
    <article className="study-text" aria-label="穴埋め本文">
      {sections.map((section) => (
        <section className="study-section" key={section.id}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph) => {
            const parts = parseBlanks(paragraph.text);

            return (
              <div className="study-paragraph-block" key={paragraph.id}>
                <p className="study-paragraph">
                  {parts.map((part, index) => {
                    if (part.type === 'text') {
                      return <span key={`${paragraph.id}-text-${index}`}>{part.value}</span>;
                    }

                    const blankKey = `${paragraph.id}:${part.blankIndex}`;
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
                {paragraph.memo ? <p className="memo">{paragraph.memo}</p> : null}
              </div>
            );
          })}
        </section>
      ))}
    </article>
  );
}
