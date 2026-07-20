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
    /** SEO и extended — те же метрики, что в кабинете; в демо лимит по символам и числу запусков */
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

export type ClusterDemoRegion = { id: string; label: string };

export type ClusterDemoLevel = { value: string; label: string };

export type ClusterDemoGroup = {
  name: string;
  phrases: string[];
  size: number;
};

export type ClusterDemoProgress = {
  phrases_total: number;
  phrases_done: number;
  phrases_pending: number;
  waiting_in_queue?: boolean;
};

export type ClusterDemoResultPayload = {
  summary: {
    phrases: number;
    clusters: number;
    singles: number;
  };
  groups: ClusterDemoGroup[];
  singles: string[];
  locked: readonly string[];
};

export type ClusterDemoResponse = {
  demo: true;
  module: "klasterizator-klyuchevykh-slov";
  remaining: number;
  status: "pending" | "complete";
  progress_id?: string;
  limits: {
    max_phrases: number;
    min_phrases: number;
    max_runs_per_day: number;
    top_count: number;
    regions: ClusterDemoRegion[];
    clustering_levels: ClusterDemoLevel[];
  };
  progress?: ClusterDemoProgress;
  result?: ClusterDemoResultPayload;
  upgrade: DemoUpgrade;
};

export type ClusterDemoRunBody = {
  phrases: string;
  region_id: string;
  clustering_level?: string;
};

export type ClusterDemoPollBody = {
  progress_id: string;
};

export type SiteMonitoringDemoResult = {
  broken: boolean;
  status: string;
  status_key: string;
  code: number;
  response_time_ms: number;
  phrase_used: boolean;
};

export type SiteMonitoringDemoResponse = {
  demo: true;
  module: "monitoring-saytov";
  remaining: number;
  limits: {
    max_runs_per_day: number;
  };
  result: SiteMonitoringDemoResult;
  upgrade: DemoUpgrade;
};

export type SiteMonitoringDemoRunBody = {
  url: string;
  phrase?: string;
  waiting_time?: number;
};

export type DomainInformationDemoResult = {
  ok: boolean;
  domain: string;
  broken: boolean;
  status: string;
  status_key: string;
  message?: string;
  dns: string;
  dns_servers: string[];
  registered_at: string | null;
  expires_at: string | null;
  days_until_expiry: number | null;
  registration_summary: string;
};

export type DomainInformationDemoResponse = {
  demo: true;
  module: "otslezhivanie-sroka-registratsii-domenov";
  remaining: number;
  limits: {
    max_runs_per_day: number;
  };
  result: DomainInformationDemoResult;
  upgrade: DemoUpgrade;
};

export type DomainInformationDemoRunBody = {
  domain: string;
};

export type MetaTagsDemoField = {
  tag: string;
  label: string;
  values: string[];
  status: "ok" | "issue" | "missing";
  messages: string[];
};

export type MetaTagsDemoResult = {
  requested_url: string;
  final_url: string;
  redirect: string;
  fields: MetaTagsDemoField[];
  issues_count: number;
  locked: string[];
};

export type MetaTagsDemoResponse = {
  demo: true;
  module: "proverka-meta-tegov-online";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_urls_per_run: number;
  };
  result: MetaTagsDemoResult;
  upgrade: DemoUpgrade;
};

export type MetaTagsDemoRunBody = {
  url: string;
};

export type HttpHeadersDemoHop = {
  index: number;
  status: number;
  status_label: string;
  headers: { name: string; value: string }[];
};

export type HttpHeadersDemoSummary = {
  final_status: number | null;
  security: {
    hsts: boolean;
    csp: boolean;
    x_frame: boolean;
    x_content_type: boolean;
  };
  hints: string[];
};

export type HttpHeadersDemoResult = {
  requested_url: string;
  final_url: string;
  hop_count: number;
  hops: HttpHeadersDemoHop[];
  summary: HttpHeadersDemoSummary;
};

export type HttpHeadersDemoResponse = {
  demo: true;
  module: "http-headers";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_urls_per_run: number;
  };
  result: HttpHeadersDemoResult;
  upgrade: DemoUpgrade;
};

export type HttpHeadersDemoRunBody = {
  url: string;
};

export type IndexCheckEngineResult = {
  indexed: boolean;
  results_count?: number;
  matched_url?: string | null;
  error?: string | null;
};

export type IndexCheckDemoResult = {
  url: string;
  yandex: IndexCheckEngineResult | null;
  google: IndexCheckEngineResult | null;
};

export type IndexCheckDemoResponse = {
  demo: true;
  module: "proverka-indeksacii";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_urls_per_run: number;
    cost_per_engine?: number;
  };
  result: IndexCheckDemoResult;
  upgrade: DemoUpgrade;
};

export type IndexCheckDemoRunBody = {
  url: string;
  yandex?: boolean;
  google?: boolean;
  unify_www?: boolean;
  google_domain?: string;
};

export type SearchSuggestionsDemoRow = {
  seed: string;
  query: string;
  suggest: string;
  engine: string;
  level: number;
  words: number;
  type?: string;
};

export type SearchSuggestionsDemoResult = {
  seed: string;
  engine: string;
  rows: SearchSuggestionsDemoRow[];
  results_count: number;
  total_found: number;
  cost: number;
  truncated: boolean;
};

export type SearchSuggestionsDemoResponse = {
  demo: true;
  module: "sbor-poiskovykh-podskazok";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_seeds_per_run: number;
    max_rows: number;
    depth: number;
  };
  result: SearchSuggestionsDemoResult;
  upgrade: DemoUpgrade;
};

export type SearchSuggestionsDemoRunBody = {
  seed: string;
  engine?: "yandex" | "google";
};

export type DomainRecordsDemoIp = {
  ip: string | null;
  neighbors: string[];
  neighbors_count: number;
  neighbors_truncated: boolean;
};

export type DomainRecordsDemoResult = {
  domain: string;
  punycode?: string | null;
  summary: {
    registered?: boolean;
    status_key?: string | null;
    expires_at?: string | null;
    days_until_expiry?: number | null;
    ns?: string[];
    a_count?: number;
    mx_count?: number;
  };
  whois: {
    status_key?: string | null;
    registered_at?: string | null;
    expires_at?: string | null;
    days_until_expiry?: number | null;
    dns_servers?: string[];
    broken?: boolean;
  };
  dns_counts: Record<string, number>;
  ips: DomainRecordsDemoIp[];
};

export type DomainRecordsDemoResponse = {
  demo: true;
  module: "zapisi-domena";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_domains_per_run: number;
  };
  result: DomainRecordsDemoResult;
  upgrade: DemoUpgrade;
};

export type DomainRecordsDemoRunBody = {
  domain: string;
};

export type SiteTypesDemoMixItem = {
  type: string;
  share: number;
  count: number;
};

export type SiteTypesDemoRow = {
  position: number;
  domain: string;
  url: string;
  type: string;
  in_catalog: boolean;
};

export type SiteTypesDemoHost = {
  host: string;
  count: number;
  type: string;
};

export type SiteTypesDemoCategory = {
  label: string;
  short: string;
  color: string;
};

export type SiteTypesDemoResult = {
  phrase: string;
  engine: string;
  depth: number;
  verdict: { code: string; label: string; hint: string };
  total_positions: number;
  mix: SiteTypesDemoMixItem[];
  rows: SiteTypesDemoRow[];
  rows_shown: number;
  rows_total: number;
  truncated: boolean;
  frequent_hosts: SiteTypesDemoHost[];
  categories: Record<string, SiteTypesDemoCategory>;
  error: boolean;
};

export type SiteTypesDemoResponse = {
  demo: true;
  module: "tipy-saitov-v-vydache";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_phrases_per_run: number;
    depth: number;
    max_rows: number;
  };
  result: SiteTypesDemoResult;
  upgrade: DemoUpgrade;
};

export type SiteTypesDemoRunBody = {
  phrase: string;
  engine?: "yandex" | "google";
};

export type PhraseCommerceDemoMetric = {
  code: string;
  label: string;
  pct?: number;
  overlap_pct?: number;
  shared?: number;
  incomplete?: boolean;
  local?: number;
  commercial?: number;
  total?: number;
};

export type PhraseCommerceDemoResult = {
  phrase: string;
  engine: string;
  depth: number;
  region_name: string;
  region_contrast_name: string;
  geo: PhraseCommerceDemoMetric;
  localization: PhraseCommerceDemoMetric;
  commerce: PhraseCommerceDemoMetric;
  positions: number;
  error: boolean;
};

export type PhraseCommerceDemoResponse = {
  demo: true;
  module: "geo-lokalizaciya-kommerciya";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_phrases_per_run: number;
    depth: number;
  };
  result: PhraseCommerceDemoResult;
  upgrade: DemoUpgrade;
};

export type PhraseCommerceDemoRunBody = {
  phrase: string;
  engine?: "yandex" | "google";
};

export type BacklinkDemoCheck = {
  key: string;
  label: string;
  status: "ok" | "issue";
};

export type BacklinkDemoResult = {
  donor_url: string;
  target_link: string;
  anchor: string;
  check_nofollow: boolean;
  check_noindex: boolean;
  ok: boolean;
  checks: BacklinkDemoCheck[];
  issues_count: number;
  summary: string;
};

export type BacklinkDemoResponse = {
  demo: true;
  module: "otslezhivanie-ssylok";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_links_per_run: number;
  };
  result: BacklinkDemoResult;
  upgrade: DemoUpgrade;
};

export type BacklinkDemoRunBody = {
  donor: string;
  link: string;
  anchor: string;
  check_nofollow?: boolean;
  check_noindex?: boolean;
};

export type EseninTextCheckDetail = {
  block: string;
  label?: string;
  sum: number;
};

export type EseninTextCheckParam = {
  name: string;
  value?: string | number | null;
  score?: number;
};

export type EseninTextCheckDemoResult = {
  risk: number;
  level?: string;
  details?: EseninTextCheckDetail[];
  params?: EseninTextCheckParam[];
  highlighted_html?: string;
  highlights?: Record<string, string>;
  stats?: {
    chars?: number;
    chars_no_spaces?: number;
    words?: number;
  };
};

export type EseninTextCheckDemoResponse = {
  demo: true;
  module: "proverka-teksta-esenin";
  remaining: number;
  limits: {
    max_runs_per_day: number;
    max_chars: number;
    min_chars?: number;
    full_max_chars?: number;
    cost_per_check?: number;
  };
  result: EseninTextCheckDemoResult;
  upgrade: DemoUpgrade;
};

export type EseninTextCheckDemoRunBody = {
  source?: "text" | "url";
  text?: string;
  url?: string;
  tbclass?: string;
  mode?: string;
};
