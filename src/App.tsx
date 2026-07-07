import { useEffect, useMemo, useState } from 'react';
import { ControlButtons } from './components/ControlButtons';
import { ProblemSidebar } from './components/ProblemSidebar';
import { StudyText } from './components/StudyText';
import type { ProblemLibrary, ProblemSet, StudySection } from './types';
import { buildProblemUrl, collectBlankKeys, normalizeSections } from './utils/problemSet';
import './styles.css';

function getSetNameFromUrl(defaultSet: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get('set')?.trim() || defaultSet;
}

async function loadLibrary(): Promise<ProblemLibrary> {
  const response = await fetch(`${import.meta.env.BASE_URL}problems/index.json`);

  if (!response.ok) {
    throw new Error('問題フォルダーの一覧を読み込めませんでした。');
  }

  const data = (await response.json()) as ProblemLibrary;

  if (!data.defaultSet || !Array.isArray(data.items)) {
    throw new Error('問題フォルダー一覧のJSON形式が正しくありません。');
  }

  return data;
}

// 選択された教材JSONをpublic/problems配下から読み込む。
async function loadProblemSet(setPath: string): Promise<ProblemSet> {
  const response = await fetch(buildProblemUrl(setPath));

  if (!response.ok) {
    throw new Error(`問題セット「${setPath}」を読み込めませんでした。`);
  }

  const data = (await response.json()) as ProblemSet;

  if (!data.title || (!Array.isArray(data.sections) && !Array.isArray(data.questions))) {
    throw new Error('問題セットJSONの形式が正しくありません。');
  }

  return data;
}

function replaceSetParam(setPath: string) {
  const safeSetPath = setPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  window.history.replaceState(null, '', `${window.location.pathname}?set=${safeSetPath}${window.location.hash}`);
}

export default function App() {
  const [library, setLibrary] = useState<ProblemLibrary | null>(null);
  const [problemSet, setProblemSet] = useState<ProblemSet | null>(null);
  const [sections, setSections] = useState<StudySection[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [visibleBlanks, setVisibleBlanks] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const blankCount = useMemo(() => collectBlankKeys(sections).length, [sections]);

  useEffect(() => {
    loadLibrary()
      .then((loadedLibrary) => {
        const initialSet = getSetNameFromUrl(loadedLibrary.defaultSet);
        setLibrary(loadedLibrary);
        setSelectedSet(initialSet);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : '問題フォルダーの読み込みに失敗しました。';
        setErrorMessage(message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedSet) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setVisibleBlanks(new Set());

    loadProblemSet(selectedSet)
      .then((loadedProblemSet) => {
        setProblemSet(loadedProblemSet);
        setSections(normalizeSections(loadedProblemSet));
        document.title = `${loadedProblemSet.title} | 穴埋め暗記`;
        replaceSetParam(selectedSet);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : '問題データの読み込みに失敗しました。';
        setProblemSet(null);
        setSections([]);
        setErrorMessage(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedSet]);

  function toggleBlank(blankKey: string) {
    setVisibleBlanks((current) => {
      const next = new Set(current);
      if (next.has(blankKey)) {
        next.delete(blankKey);
      } else {
        next.add(blankKey);
      }
      return next;
    });
  }

  function showAll() {
    setVisibleBlanks(new Set(collectBlankKeys(sections)));
  }

  function hideAll() {
    setVisibleBlanks(new Set());
  }

  function shuffleSections() {
    setSections((current) =>
      current.map((section) => {
        const paragraphs = [...section.paragraphs];
        for (let index = paragraphs.length - 1; index > 0; index -= 1) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [paragraphs[index], paragraphs[randomIndex]] = [paragraphs[randomIndex], paragraphs[index]];
        }

        return {
          ...section,
          paragraphs,
        };
      }),
    );
  }

  function selectSet(setPath: string) {
    setSelectedSet(setPath);
    setIsSidebarOpen(false);
  }

  return (
    <div className={`app-frame ${isSidebarOpen ? 'app-frame-sidebar-open' : ''}`}>
      {library ? (
        <ProblemSidebar
          activeSet={selectedSet ?? ''}
          isOpen={isSidebarOpen}
          items={library.items}
          onClose={() => setIsSidebarOpen(false)}
          onSelectSet={selectSet}
        />
      ) : null}

      <main className="app-shell">
        <div className="top-bar">
          <button
            className="sidebar-toggle"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="サイドバーを表示"
            aria-expanded={isSidebarOpen}
            tabIndex={isSidebarOpen ? -1 : 0}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
          <span>{blankCount} 個の穴埋め</span>
        </div>

        {isLoading ? <p className="status-message">問題を読み込んでいます...</p> : null}

        {!isLoading && errorMessage ? (
          <section className="error-box" role="alert">
            <h1>読み込みエラー</h1>
            <p>{errorMessage}</p>
            <p>URLのset指定、またはpublic/problems内のJSONファイル名を確認してください。</p>
          </section>
        ) : null}

        {!isLoading && problemSet ? (
          <>
            <header className="app-header">
              <p className="set-label">問題セット: {selectedSet}</p>
              <h1>{problemSet.title}</h1>
              <p>{problemSet.description}</p>
            </header>

            <ControlButtons onShowAll={showAll} onHideAll={hideAll} onShuffle={shuffleSections} />

            <StudyText sections={sections} visibleBlanks={visibleBlanks} onToggleBlank={toggleBlank} />
          </>
        ) : null}
      </main>
    </div>
  );
}
