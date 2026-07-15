"use client";

import { StatusOverview } from "@/components/parser/StatusOverview";
import { SourceEditor } from "@/components/parser/SourceEditor";
import { ResponsePanel } from "@/components/parser/ResponsePanel";

export function HomeView() {
  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden p-3">
      <div className="shrink-0">
        <StatusOverview />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="min-h-[320px] overflow-hidden rounded-xl border border-base-500/30 bg-[#0b0e14] shadow-panel lg:col-span-3">
          <SourceEditor />
        </div>
        <div className="min-h-[320px] overflow-hidden rounded-xl border border-base-500/30 bg-base-850/40 shadow-panel lg:col-span-2">
          <ResponsePanel />
        </div>
      </div>
    </div>
  );
}
