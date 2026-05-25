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

export type CompetitorDemoRegion = {
  id: string;
  label: string;
  tab_label?: string;
};

export type CompetitorDemoSerpRow = {
  position?: number;
  serp_position: number;
  url: string;
  host: string;
  path: string;
  excluded?: boolean;
};

export type CompetitorDemoSerp = {
  rows: CompetitorDemoSerpRow[];
  excluded_rows?: CompetitorDemoSerpRow[];
  total: number;
  shown: number;
  excluded_count?: number;
  excludes_aggregators?: boolean;
  excluded_domains_sample?: string[];
  excluded_domains_total?: number;
};

export type CompetitorDemoTopDepth = {
  value: number;
  label: string;
  demo: boolean;
};

export type CompetitorDemoGeo = {
  overlap_pct: number | null;
  status: string;
  status_label: string;
  region_a: CompetitorDemoRegion;
  region_b: CompetitorDemoRegion;
  shared_count: number;
  shared_urls: string[];
  count_a: number;
  count_b: number;
  overlap_pct_a: number | null;
  overlap_pct_b: number | null;
  excludes_aggregators?: boolean;
  excluded_domains_sample?: string[];
  excluded_domains_total?: number;
};

export type CompetitorAnalysisDemoResult = {
  demo: true;
  module: "analiz-konkurentov";
  remaining: number;
  limits: {
    max_phrase_length: number;
    max_runs_per_day: number;
    top_count: number;
    serp_rows: number;
    top_depths: CompetitorDemoTopDepth[];
    search_engines: string[];
    yandex_regions: CompetitorDemoRegion[];
    google_regions: CompetitorDemoRegion[];
    /** @deprecated use yandex_regions / google_regions */
    regions?: CompetitorDemoRegion[];
  };
  result: {
    phrase: string;
    engine: string;
    engine_label: string;
    region: CompetitorDemoRegion;
    compare_region: CompetitorDemoRegion | null;
    top_count: number;
    serp: CompetitorDemoSerp;
    geo: CompetitorDemoGeo | null;
    locked: readonly string[];
  };
  upgrade: DemoUpgrade;
};

export type CompetitorAnalysisDemoRunBody = {
  phrase: string;
  region_id: string;
  compare_region_id?: string;
  search_engine?: "yandex" | "google";
};

export type DedupDemoOptionsInput = {
  removeExtraSpace?: boolean;
  trim?: boolean;
  replaceTabWithSpace?: boolean;
  removeEmptyRows?: boolean;
  lowerCase?: boolean;
  removeDuplicates?: boolean;
  replaceUmlaut?: boolean;
};

export type DedupDemoMetrics = {
  before: number;
  after: number;
  dupRemoved: number;
  emptyRemoved: number;
};

export type DedupDemoResult = {
  demo: true;
  module: "udalenie-dublikatov";
  remaining: number;
  limits: {
    max_chars: number;
    max_lines: number;
    max_runs_per_day: number;
  };
  result: {
    text: string;
    metrics: DedupDemoMetrics;
    locked: readonly string[];
  };
  upgrade: DemoUpgrade;
};

export type DedupDemoRunBody = {
  text: string;
  options?: DedupDemoOptionsInput;
};
