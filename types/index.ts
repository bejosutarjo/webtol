export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type BodyType = "raw" | "json" | "xml" | "form-data" | "multipart" | "binary" | "text";

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface HeaderEntry {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface CookieEntry {
  id: string;
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
}

export interface ProxyConfig {
  httpProxy: string;
  httpsProxy: string;
  socks5Proxy: string;
  proxyUsername: string;
  proxyPassword: string;
  enabled: boolean;
}

export interface RequestSettings {
  method: HttpMethod;
  timeout: number;
  retry: number;
  maxRedirect: number;
  followRedirect: boolean;
  verifySSL: boolean;
  keepAlive: boolean;
  http2: boolean;
  gzip: boolean;
  brotli: boolean;
  autoCookie: boolean;
  autoSave: boolean;
  autoScroll: boolean;
  prettyPrint: boolean;
  darkMode: boolean;
  language: "id" | "en";
  theme: "dark-blue" | "dark-slate" | "midnight";
  downloadFolder: string;
  bodyType: BodyType;
  requestBody: string;
  proxy: ProxyConfig;
}

export interface ParsedMeta {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
}

export interface ParsedElementSummary {
  tag: string;
  attributes: Record<string, string>;
  text?: string;
}

export interface ExtractedData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  language: string;
  charset: string;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  headings: Record<string, string[]>;
  links: ParsedElementSummary[];
  images: ParsedElementSummary[];
  scripts: ParsedElementSummary[];
  styles: ParsedElementSummary[];
  metas: ParsedMeta[];
  forms: ParsedElementSummary[];
  inputs: ParsedElementSummary[];
  buttons: ParsedElementSummary[];
  tables: ParsedElementSummary[];
  iframes: ParsedElementSummary[];
  videos: ParsedElementSummary[];
  audios: ParsedElementSummary[];
  svgs: ParsedElementSummary[];
  jsonLd: string[];
}

export interface ParserResponseInfo {
  status: number;
  statusText: string;
  ok: boolean;
  responseTimeMs: number;
  contentLength: number;
  server: string;
  contentType: string;
  encoding: string;
  finalUrl: string;
  redirected: boolean;
  redirectChain: string[];
  httpVersion?: string;
}

export interface ParserResult {
  requestUrl: string;
  requestMethod: HttpMethod;
  requestHeaders: Record<string, string>;
  responseInfo: ParserResponseInfo;
  responseHeaders: Record<string, string>;
  cookies: CookieEntry[];
  html: string;
  extracted: ExtractedData;
  timestamp: string;
  error?: string;
}

export interface ParserErrorInfo {
  type: "timeout" | "dns" | "ssl" | "network" | "http" | "unknown";
  message: string;
  code?: string;
  status?: number;
}
