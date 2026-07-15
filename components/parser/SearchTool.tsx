"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";

const modeLabels: Record<string, string> = {
  text: "Text",
  regex: "Regex",
  tag: "HTML Tag",
  class: "Class",
  id: "ID",
  attribute: "Attribute",
};

function findMatches(html: string, mode: string, query: string): string[] {
  if (!query) return [];
  try {
    let pattern: RegExp;
    switch (mode) {
      case "regex":
        pattern = new RegExp(query, "gi");
        break;
      case "tag":
        pattern = new RegExp(`<${query}[^>]*>`, "gi");
        break;
      case "class":
        pattern = new RegExp(`class=["'][^"']*${query}[^"']*["']`, "gi");
        break;
      case "id":
        pattern = new RegExp(`id=["']${query}["']`, "gi");
        break;
      case "attribute":
        pattern = new RegExp(`${query}=["'][^"']*["']`, "gi");
        break;
      default:
        pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    }
    const matches = html.match(pattern) || [];
    return matches.slice(0, 100);
  } catch {
    return [];
  }
}

export function SearchTool() {
  const { result, searchQuery, setSearchQuery, searchMode, setSearchMode } = useAppStore();

  const matches = useMemo(() => {
    if (!result) return [];
    return findMatches(result.html, searchMode, searchQuery);
  }, [result, searchMode, searchQuery]);

  return (
    <div className="rounded-lg border border-base-500/20 bg-base-800/30 p-2.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari berdasarkan ${modeLabels[searchMode].toLowerCase()}...`}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value as any)}
          className="h-8 w-32 text-xs"
        >
          {Object.entries(modeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      {searchQuery && (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
          <Badge variant={matches.length > 0 ? "success" : "danger"}>{matches.length} match</Badge>
        </div>
      )}
      {searchQuery && matches.length > 0 && (
        <div className="scroll-thin mt-2 max-h-32 space-y-1 overflow-auto">
          {matches.map((m, i) => (
            <div
              key={i}
              className="truncate rounded bg-base-950/60 px-2 py-1 font-mono text-[10px] text-accent-300"
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
