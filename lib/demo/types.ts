/** Контракт ответа demo API (marketing и lk) */
export type DemoUpgrade = {
  register_url: string;
  login_url: string;
};

export type TextLengthSummary = {
  chars_with_spaces: number;
  chars_no_spaces: number;
  words: number;
  lines: number;
  spaces: number;
};

export type TextLengthSeoPreview = {
  title_chars: number | null;
  description_chars: number | null;
  h1_chars: number | null;
  title_ok: boolean | null;
  description_ok: boolean | null;
};

export type TextLengthExtendedPreview = {
  sentences: number;
  paragraphs: number;
  reading_time_min: number;
};

export type TextLengthDemoResult = {
  demo: true;
  module: "podschet-dliny-teksta";
  remaining: number;
  limits: {
    max_chars: number;
    max_runs_per_day: number;
    full_max_chars: number;
  };
  result: {
    summary: TextLengthSummary;
    /** В демо всегда null — значения только в кабинете */
    seo: TextLengthSeoPreview | null;
    extended: TextLengthExtendedPreview | null;
    locked: readonly string[];
  };
  upgrade: DemoUpgrade;
};

export type TextLengthDemoRunBody = {
  text: string;
  title?: string;
  description?: string;
  h1?: string;
};

export type DemoErrorBody = {
  error: string;
  message?: string;
  remaining?: number;
};

export type TextAnalyzerGeneral = {
  textLength: number;
  countSpaces: number;
  lengthWithOutSpaces: number;
  countWords: number;
};

export type TextAnalyzerTopWord = {
  text: string;
  density: number | string;
  total: number | string;
  inText: number | string;
  inLink: number | string;
};

export type TextAnalyzerZipfPoint = {
  x: number;
  y: number;
  label: string;
};

export type TextAnalyzerZipfRow = {
  rank: number;
  word: string;
  actual: number;
  ideal: number;
  delta: number;
};

export type TextAnalyzerPhraseRow = {
  phrase: string;
  count: number;
  density: number | string;
};

export type TextAnalyzerCloudWord = {
  text: string;
  weight: number;
};

export type TextAnalyzerDemoPreviewBlock<T> = {
  rows: T[];
  total: number;
  shown: number;
};

export type TextAnalyzerCompareWord = {
  text: string;
  main_total: number;
  main_density: number | string;
  competitor_total: number;
  competitor_density: number | string;
  delta_total: number;
};

export type TextAnalyzerDemoComparison = {
  competitor_url: string;
  competitor_host: string;
  general_competitor: TextAnalyzerGeneral;
  words: TextAnalyzerDemoPreviewBlock<TextAnalyzerCompareWord>;
};

export type TextAnalyzerDemoResult = {
  demo: true;
  module: "analiz-teksta";
  remaining: number;
  limits: {
    max_chars: number;
    min_chars: number;
    max_runs_per_day: number;
    full_max_chars: number;
    words_rows: number;
    zipf_rows: number;
    zipf_chart_points: number;
    phrases_rows: number;
    cloud_text_words: number;
    compare_words_rows: number;
  };
  result: {
    general: TextAnalyzerGeneral;
    words: TextAnalyzerDemoPreviewBlock<TextAnalyzerTopWord>;
    zipf: TextAnalyzerDemoPreviewBlock<TextAnalyzerZipfRow> & {
      graph: TextAnalyzerZipfPoint[];
    };
    phrases: TextAnalyzerDemoPreviewBlock<TextAnalyzerPhraseRow>;
    cloud: {
      text: TextAnalyzerCloudWord[];
      text_total: number;
      text_shown: number;
    };
    comparison: TextAnalyzerDemoComparison | null;
    locked: readonly string[];
  };
  upgrade: DemoUpgrade;
};

export type TextAnalyzerDemoRunBody = {
  mode?: "text" | "url";
  text?: string;
  url?: string;
  exclude_stop_words?: boolean;
  no_index?: boolean;
  hidden_text?: boolean;
  compare_competitor?: boolean;
  competitor_url?: string;
};
