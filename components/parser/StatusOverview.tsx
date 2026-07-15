"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  HardDrive,
  Server,
  FileType,
  Zap,
  Link2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { formatBytes, formatMs } from "@/lib/utils";
import { cn } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  valueClassName,
  delay = 0,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  valueClassName?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="flex items-center gap-3 rounded-lg border border-base-500/30 bg-base-800/40 px-3 py-2.5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-500/10 text-accent-400">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
        <div className={cn("truncate text-sm font-semibold text-slate-100", valueClassName)}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}

export function StatusOverview() {
  const { result } = useAppStore();

  if (!result) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  const { responseInfo } = result;
  const statusColor =
    responseInfo.status >= 200 && responseInfo.status < 300
      ? "text-success"
      : responseInfo.status >= 300 && responseInfo.status < 400
      ? "text-info"
      : responseInfo.status >= 400
      ? "text-danger"
      : "text-slate-100";

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      <StatCard
        icon={Activity}
        label="Status"
        value={`${responseInfo.status} ${responseInfo.statusText}`}
        valueClassName={statusColor}
      />
      <StatCard icon={Clock} label="Response Time" value={formatMs(responseInfo.responseTimeMs)} delay={0.03} />
      <StatCard icon={HardDrive} label="Content Length" value={formatBytes(responseInfo.contentLength)} delay={0.06} />
      <StatCard icon={Server} label="Server" value={responseInfo.server} delay={0.09} />
      <StatCard icon={FileType} label="Content Type" value={responseInfo.contentType} delay={0.12} />
      <StatCard icon={Zap} label="Encoding" value={responseInfo.encoding} delay={0.15} />
    </div>
  );
}
