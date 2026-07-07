import type { ProblemSet, StudyParagraph, StudySection } from '../types';

// 古いquestions形式も、本文表示用のsections形式にそろえる。
export function normalizeSections(problemSet: ProblemSet): StudySection[] {
  if (problemSet.sections?.length) {
    return problemSet.sections;
  }

  const paragraphs: StudyParagraph[] =
    problemSet.questions?.map((question) => ({
      id: question.id,
      text: question.text,
      memo: question.memo,
    })) ?? [];

  return [
    {
      id: 'main',
      paragraphs,
    },
  ];
}

// 現在の教材に含まれるすべての穴埋めキーを作る。
export function collectBlankKeys(sections: StudySection[]) {
  return sections.flatMap((section) =>
    section.paragraphs.flatMap((paragraph) => {
      const matches = [...paragraph.text.matchAll(/\{\{([\s\S]*?)\}\}/g)];
      return matches.map((_, index) => `${paragraph.id}:${index}`);
    }),
  );
}

// 静的ホスティングでも安全に読めるように、パスを1階層ずつエンコードする。
export function buildProblemUrl(setPath: string) {
  const safePath = setPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  return `${import.meta.env.BASE_URL}problems/${safePath}.json`;
}
