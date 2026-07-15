"use client";

import { useMemo } from "react";
import { FileCode, Eye, ListTree, Cookie, Braces, ScanSearch } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { ExtractedDataPanel } from "@/components/parser/ExtractedDataPanel";

export function ResponsePanel() {
  const { result, activeResponseTab, setActiveResponseTab } = useAppStore();

  const tabs = [
    { value: "response", label: "Response", icon: <FileCode className="h-3.5 w-3.5" /> },
    { value: "preview", label: "Preview", icon: <Eye className="h-3.5 w-3.5" /> },
    {
      value: "headers",
      label: "Headers",
      icon: <ListTree className="h-3.5 w-3.5" />,
      badge: result ? (
        <Badge variant="neutral" className="ml-1 px-1 py-0">
          {Object.keys(result.responseHeaders).length}
        </Badge>
      ) : undefined,
    },
    {
      value: "cookies",
      label: "Cookies",
      icon: <Cookie className="h-3.5 w-3.5" />,
      badge: result && result.cookies.length > 0 ? (
        <Badge variant="neutral" className="ml-1 px-1 py-0">
          {result.cookies.length}
        </Badge>
      ) : undefined,
    },
    { value: "json", label: "JSON", icon: <Braces className="h-3.5 w-3.5" /> },
    { value: "parser", label: "HTML Parser", icon: <ScanSearch className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 p-2">
        <Tabs
          items={tabs}
          value={activeResponseTab}
          onChange={(v) => setActiveResponseTab(v as any)}
        />
      </div>
      <div className="scroll-thin flex-1 overflow-auto px-3 pb-3">
        {activeResponseTab === "response" && <ResponseRaw />}
        {activeResponseTab === "preview" && <ResponsePreview />}
        {activeResponseTab === "headers" && <ResponseHeaders />}
        {activeResponseTab === "cookies" && <ResponseCookies />}
        {activeResponseTab === "json" && <ResponseJson />}
        {activeResponseTab === "parser" && <ExtractedDataPanel />}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-base-500/30 text-xs text-slate-500">
      {label}
    </div>
  );
}

function ResponseRaw() {
  const { result } = useAppStore();
  if (!result) return <EmptyState label="Belum ada response. Jalankan parse terlebih dahulu." />;
  return (
    <pre className="scroll-thin max-h-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-base-500/20 bg-base-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
      {result.html}
    </pre>
  );
}

function ResponsePreview() {
  const { result } = useAppStore();
  if (!result) return <EmptyState label="Belum ada preview." />;
  return (
    <div className="h-full min-h-[300px] overflow-hidden rounded-lg border border-base-500/30 bg-white">
      <iframe
        title="preview"
        sandbox=""
        srcDoc={result.html}
        className="h-full min-h-[300px] w-full"
      />
    </div>
  );
}

function ResponseHeaders() {
  const { result } = useAppStore();
  if (!result) return <EmptyState label="Belum ada headers." />;
  return (
    <div className="space-y-1">
      {Object.entries(result.responseHeaders).map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-3 gap-2 rounded-md border border-base-500/10 bg-base-800/30 px-2.5 py-1.5 text-xs"
        >
          <div className="truncate font-medium text-accent-300">{key}</div>
          <div className="col-span-2 truncate break-all font-mono text-slate-300">{value}</div>
        </div>
      ))}
    </div>
  );
}

function ResponseCookies() {
  const { result } = useAppStore();
  if (!result || result.cookies.length === 0)
    return <EmptyState label="Tidak ada cookies pada response ini." />;
  return (
    <div className="space-y-2">
      {result.cookies.map((c) => (
        <div key={c.id} className="rounded-lg border border-base-500/20 bg-base-800/30 p-2.5 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold text-accent-300">{c.name}</span>
            <div className="flex gap-1">
              {c.httpOnly && <Badge variant="neutral">HttpOnly</Badge>}
              {c.secure && <Badge variant="neutral">Secure</Badge>}
            </div>
          </div>
          <div className="break-all font-mono text-slate-400">{c.value}</div>
          <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-slate-500">
            {c.domain && <span>Domain: {c.domain}</span>}
            {c.path && <span>Path: {c.path}</span>}
            {c.expires && <span>Expires: {c.expires}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResponseJson() {
  const { result } = useAppStore();
  const jsonString = useMemo(() => (result ? JSON.stringify(result, null, 2) : ""), [result]);
  if (!result) return <EmptyState label="Belum ada data JSON." />;
  return (
    <pre className="scroll-thin max-h-full overflow-auto whitespace-pre-wrap break-all rounded-lg border border-base-500/20 bg-base-950/60 p-3 font-mono text-[11px] leading-relaxed text-slate-300">
      {jsonString}
    </pre>
  );
}
