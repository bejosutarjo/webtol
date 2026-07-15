"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { editor } from "monaco-editor";
import {
  Copy,
  Download,
  WrapText,
  Search,
  Sparkles,
  Lock,
  Unlock,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { downloadHtml } from "@/lib/downloadUtils";
import { toast } from "sonner";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="skeleton h-6 w-40 rounded" />
    </div>
  ),
});

function formatHtml(html: string): string {
  let formatted = "";
  let indent = 0;
  const tokens = html
    .replace(/></g, ">\n<")
    .split("\n");
  const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);

  for (const line of tokens) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing =
      /\/>$/.test(trimmed) ||
      voidTags.has(trimmed.replace(/^<\/?([a-zA-Z0-9-]+).*/, "$1"));
    const isComment = /^<!--/.test(trimmed);
    const isDoctype = /^<!doctype/i.test(trimmed);

    if (isClosing && indent > 0) indent--;
    formatted += "  ".repeat(indent) + trimmed + "\n";
    if (!isClosing && !isSelfClosing && !isComment && !isDoctype && /^<[a-zA-Z]/.test(trimmed)) {
      const hasClosingSameLine = new RegExp(`</${trimmed.match(/^<([a-zA-Z0-9-]+)/)?.[1]}>`).test(
        trimmed
      );
      if (!hasClosingSameLine) indent++;
    }
  }
  return formatted.trim();
}

export function SourceEditor() {
  const { result, isLoading, settings } = useAppStore();
  const [wordWrap, setWordWrap] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const [formatted, setFormatted] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const html = result?.html || "";
  const displayValue = formatted ? formatHtml(html) : html;

  const handleCopy = async () => {
    if (!html) return;
    await navigator.clipboard.writeText(displayValue);
    toast.success("Source code disalin ke clipboard.");
  };

  const handleDownload = () => {
    if (!result) return;
    downloadHtml(result);
    toast.success("File HTML sedang diunduh.");
  };

  const handleSearch = () => {
    editorRef.current?.getAction("actions.find")?.run();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="glass flex shrink-0 items-center justify-between gap-2 border-b border-base-500/30 px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Code className="h-3.5 w-3.5 text-accent-400" />
          <span className="font-mono">
            {result ? `${(html.length / 1024).toFixed(1)} KB` : "Belum ada data"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            size="xs"
            variant={wordWrap ? "secondary" : "ghost"}
            onClick={() => setWordWrap((w) => !w)}
            title="Word Wrap"
          >
            <WrapText className="h-3.5 w-3.5" />
          </Button>
          <Button size="xs" variant="ghost" onClick={handleSearch} title="Search">
            <Search className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="xs"
            variant={formatted ? "secondary" : "ghost"}
            onClick={() => setFormatted((f) => !f)}
            title="Format HTML"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
          <Button size="xs" variant="ghost" onClick={handleCopy} title="Copy">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="xs" variant="ghost" onClick={handleDownload} title="Download HTML">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="xs"
            variant={readOnly ? "ghost" : "secondary"}
            onClick={() => setReadOnly((r) => !r)}
            title={readOnly ? "Read Only" : "Editable"}
          >
            {readOnly ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-[#0b0e14]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col gap-2 bg-base-900/80 p-4">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-3.5 rounded"
                style={{ width: `${40 + Math.random() * 55}%` }}
              />
            ))}
          </div>
        )}
        <MonacoEditor
          height="100%"
          defaultLanguage="html"
          language="html"
          value={displayValue || "// Masukkan URL lalu klik Parse untuk menampilkan source code HTML."}
          theme="vs-dark"
          onMount={(editorInstance) => {
            editorRef.current = editorInstance;
          }}
          options={{
            readOnly,
            wordWrap: wordWrap ? "on" : "off",
            minimap: { enabled: true },
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderWhitespace: "selection",
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
