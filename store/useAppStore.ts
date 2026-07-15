"use client";

import { create } from "zustand";
import { v4 as uuid } from "uuid";
import type {
  ConnectionStatus,
  CookieEntry,
  HeaderEntry,
  ParserResult,
  RequestSettings,
} from "@/types";
import { HEADER_FIELD_ORDER } from "@/lib/headerPresets";

export type BottomTab = "home" | "download" | "header" | "settings";
export type ResponseTab = "response" | "preview" | "headers" | "cookies" | "json" | "parser";

interface AppState {
  url: string;
  setUrl: (url: string) => void;

  status: ConnectionStatus;
  setStatus: (s: ConnectionStatus) => void;

  activeBottomTab: BottomTab;
  setActiveBottomTab: (t: BottomTab) => void;

  activeResponseTab: ResponseTab;
  setActiveResponseTab: (t: ResponseTab) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  headers: HeaderEntry[];
  setHeaders: (h: HeaderEntry[]) => void;
  addHeader: () => void;
  updateHeader: (id: string, patch: Partial<HeaderEntry>) => void;
  removeHeader: (id: string) => void;
  applyPreset: (preset: Record<string, string>) => void;

  cookies: CookieEntry[];
  setCookies: (c: CookieEntry[]) => void;
  addCookie: () => void;
  updateCookie: (id: string, patch: Partial<CookieEntry>) => void;
  removeCookie: (id: string) => void;

  settings: RequestSettings;
  updateSettings: (patch: Partial<RequestSettings>) => void;

  result: ParserResult | null;
  setResult: (r: ParserResult | null) => void;

  history: ParserResult[];
  addHistory: (r: ParserResult) => void;

  isLoading: boolean;
  setIsLoading: (b: boolean) => void;

  searchQuery: string;
  setSearchQuery: (s: string) => void;
  searchMode: "text" | "regex" | "tag" | "class" | "id" | "attribute";
  setSearchMode: (
    m: "text" | "regex" | "tag" | "class" | "id" | "attribute"
  ) => void;
}

const defaultHeaders: HeaderEntry[] = HEADER_FIELD_ORDER.slice(0, 4).map((key) => ({
  id: uuid(),
  key,
  value:
    key === "User-Agent"
      ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
      : key === "Accept"
      ? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      : key === "Accept-Language"
      ? "en-US,en;q=0.9"
      : "gzip, deflate, br",
  enabled: true,
}));

const defaultSettings: RequestSettings = {
  method: "GET",
  timeout: 15000,
  retry: 0,
  maxRedirect: 5,
  followRedirect: true,
  verifySSL: true,
  keepAlive: true,
  http2: false,
  gzip: true,
  brotli: true,
  autoCookie: true,
  autoSave: false,
  autoScroll: true,
  prettyPrint: true,
  darkMode: true,
  language: "id",
  theme: "dark-blue",
  downloadFolder: "Downloads/WebParserTool",
  bodyType: "raw",
  requestBody: "",
  proxy: {
    httpProxy: "",
    httpsProxy: "",
    socks5Proxy: "",
    proxyUsername: "",
    proxyPassword: "",
    enabled: false,
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  url: "https://example.com",
  setUrl: (url) => set({ url }),

  status: "idle",
  setStatus: (status) => set({ status }),

  activeBottomTab: "home",
  setActiveBottomTab: (activeBottomTab) => set({ activeBottomTab }),

  activeResponseTab: "response",
  setActiveResponseTab: (activeResponseTab) => set({ activeResponseTab }),

  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  headers: defaultHeaders,
  setHeaders: (headers) => set({ headers }),
  addHeader: () =>
    set((s) => ({
      headers: [...s.headers, { id: uuid(), key: "", value: "", enabled: true }],
    })),
  updateHeader: (id, patch) =>
    set((s) => ({
      headers: s.headers.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    })),
  removeHeader: (id) =>
    set((s) => ({ headers: s.headers.filter((h) => h.id !== id) })),
  applyPreset: (preset) =>
    set(() => ({
      headers: Object.entries(preset).map(([key, value]) => ({
        id: uuid(),
        key,
        value,
        enabled: true,
      })),
    })),

  cookies: [],
  setCookies: (cookies) => set({ cookies }),
  addCookie: () =>
    set((s) => ({
      cookies: [
        ...s.cookies,
        { id: uuid(), name: "", value: "", domain: "", path: "/" },
      ],
    })),
  updateCookie: (id, patch) =>
    set((s) => ({
      cookies: s.cookies.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  removeCookie: (id) =>
    set((s) => ({ cookies: s.cookies.filter((c) => c.id !== id) })),

  settings: defaultSettings,
  updateSettings: (patch) =>
    set((s) => ({ settings: { ...s.settings, ...patch } })),

  result: null,
  setResult: (result) => set({ result }),

  history: [],
  addHistory: (r) => set((s) => ({ history: [r, ...s.history].slice(0, 50) })),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  searchMode: "text",
  setSearchMode: (searchMode) => set({ searchMode }),
}));
