"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SearchTool } from "@/components/parser/SearchTool";

function Section({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-base-500/20 bg-base-800/30">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          {title}
          <Badge variant="neutral">{count}</Badge>
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-slate-500 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="scroll-thin max-h-56 overflow-auto border-t border-base-500/10 p-2.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyRow() {
  return <div className="py-2 text-center text-[11px] text-slate-600">Tidak ditemukan.</div>;
}

export function ExtractedDataPanel() {
  const { result } = useAppStore();

  if (!result) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-base-500/30 text-xs text-slate-500">
        Jalankan parse untuk melihat hasil ekstraksi HTML.
      </div>
    );
  }

  const e = result.extracted;
  const headingList = Object.entries(e.headings).flatMap(([tag, arr]) =>
    arr.map((text) => ({ tag, text }))
  );

  return (
    <div className="space-y-3">
      <SearchTool />

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-base-500/20 bg-base-800/30 p-3 text-xs sm:grid-cols-3">
        <MetaField label="Title" value={e.title} />
        <MetaField label="Charset" value={e.charset} />
        <MetaField label="Language" value={e.language} />
        <MetaField label="Canonical" value={e.canonical} full />
        <MetaField label="Description" value={e.description} full />
        <MetaField label="Keywords" value={e.keywords} full />
      </div>

      <Section title="Semua Heading H1-H6" count={headingList.length} defaultOpen>
        {headingList.length === 0 && <EmptyRow />}
        {headingList.map((h, i) => (
          <div key={i} className="flex items-center gap-2 py-1 text-xs">
            <Badge variant="default">{h.tag.toUpperCase()}</Badge>
            <span className="truncate text-slate-300">{h.text || "(kosong)"}</span>
          </div>
        ))}
      </Section>

      <Section title="OpenGraph" count={Object.keys(e.openGraph).length}>
        {Object.keys(e.openGraph).length === 0 && <EmptyRow />}
        {Object.entries(e.openGraph).map(([k, v]) => (
          <div key={k} className="py-1 text-xs">
            <span className="text-accent-300">{k}</span>{" "}
            <span className="break-all text-slate-400">{v}</span>
          </div>
        ))}
      </Section>

      <Section title="Twitter Card" count={Object.keys(e.twitterCard).length}>
        {Object.keys(e.twitterCard).length === 0 && <EmptyRow />}
        {Object.entries(e.twitterCard).map(([k, v]) => (
          <div key={k} className="py-1 text-xs">
            <span className="text-accent-300">{k}</span>{" "}
            <span className="break-all text-slate-400">{v}</span>
          </div>
        ))}
      </Section>

      <Section title="Semua Link" count={e.links.length}>
        {e.links.length === 0 && <EmptyRow />}
        {e.links.map((l, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {l.attributes.href || "(no href)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Gambar" count={e.images.length}>
        {e.images.length === 0 && <EmptyRow />}
        {e.images.map((img, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {img.attributes.src || "(no src)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Script" count={e.scripts.length}>
        {e.scripts.length === 0 && <EmptyRow />}
        {e.scripts.map((s, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {s.attributes.src || "(inline script)"}
          </div>
        ))}
      </Section>

      <Section title="Semua CSS" count={e.styles.length}>
        {e.styles.length === 0 && <EmptyRow />}
        {e.styles.map((s, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {s.attributes.href || "(inline style)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Meta" count={e.metas.length}>
        {e.metas.length === 0 && <EmptyRow />}
        {e.metas.map((m, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {(m.name || m.property || m.charset || "meta") + ": " + (m.content || "")}
          </div>
        ))}
      </Section>

      <Section title="Semua Form" count={e.forms.length}>
        {e.forms.length === 0 && <EmptyRow />}
        {e.forms.map((f, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            method={f.attributes.method || "get"} action={f.attributes.action || "(none)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Input" count={e.inputs.length}>
        {e.inputs.length === 0 && <EmptyRow />}
        {e.inputs.map((f, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {f.tag} type={f.attributes.type || "text"} name={f.attributes.name || ""}
          </div>
        ))}
      </Section>

      <Section title="Semua Button" count={e.buttons.length}>
        {e.buttons.length === 0 && <EmptyRow />}
        {e.buttons.map((b, i) => (
          <div key={i} className="truncate py-1 text-[11px] text-slate-400">
            {b.text || "(button tanpa teks)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Table" count={e.tables.length}>
        {e.tables.length === 0 && <EmptyRow />}
        {e.tables.map((t, i) => (
          <div key={i} className="py-1 text-[11px] text-slate-400">
            Table #{i + 1}
          </div>
        ))}
      </Section>

      <Section title="Semua iframe" count={e.iframes.length}>
        {e.iframes.length === 0 && <EmptyRow />}
        {e.iframes.map((f, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {f.attributes.src || "(no src)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Video" count={e.videos.length}>
        {e.videos.length === 0 && <EmptyRow />}
        {e.videos.map((v, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {v.attributes.src || "(source anak)"}
          </div>
        ))}
      </Section>

      <Section title="Semua Audio" count={e.audios.length}>
        {e.audios.length === 0 && <EmptyRow />}
        {e.audios.map((a, i) => (
          <div key={i} className="truncate py-1 font-mono text-[11px] text-slate-400">
            {a.attributes.src || "(source anak)"}
          </div>
        ))}
      </Section>

      <Section title="Semua SVG" count={e.svgs.length}>
        {e.svgs.length === 0 && <EmptyRow />}
        {e.svgs.map((s, i) => (
          <div key={i} className="py-1 text-[11px] text-slate-400">
            SVG #{i + 1} {s.attributes.viewBox ? `viewBox="${s.attributes.viewBox}"` : ""}
          </div>
        ))}
      </Section>

      <Section title="Semua JSON-LD" count={e.jsonLd.length}>
        {e.jsonLd.length === 0 && <EmptyRow />}
        {e.jsonLd.map((j, i) => (
          <pre key={i} className="mb-1 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-base-950/60 p-2 text-[10px] text-slate-400">
            {j}
          </pre>
        ))}
      </Section>
    </div>
  );
}

function MetaField({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={cn(full && "col-span-2 sm:col-span-3")}>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="truncate text-slate-200">{value || "-"}</div>
    </div>
  );
}
