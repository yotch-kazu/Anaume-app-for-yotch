export type Question = {
  id: string;
  text: string;
  memo?: string;
};

export type StudyParagraph = {
  id: string;
  text: string;
  memo?: string;
};

export type StudySection = {
  id: string;
  heading?: string;
  paragraphs: StudyParagraph[];
};

export type ProblemSet = {
  title: string;
  description: string;
  questions?: Question[];
  sections?: StudySection[];
};

export type ProblemSetItem = {
  type: 'set';
  title: string;
  path: string;
  description?: string;
};

export type ProblemFolder = {
  type: 'folder';
  title: string;
  children: ProblemNavItem[];
};

export type ProblemNavItem = ProblemSetItem | ProblemFolder;

export type ProblemLibrary = {
  title: string;
  defaultSet: string;
  items: ProblemNavItem[];
};

export type TextPart = {
  type: 'text';
  value: string;
};

export type BlankPart = {
  type: 'blank';
  value: string;
  blankIndex: number;
};

export type ParsedPart = TextPart | BlankPart;
