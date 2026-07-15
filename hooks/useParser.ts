"use client";

import { useRef, useCallback } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import { isValidUrl } from "@/lib/utils";
import type { ParserResult } from "@/types";

export function useParser() {
  const abortRef = useRef<AbortController | null>(null);
  const {
    url,
    headers,
    settings,
    setStatus,
    setIsLoading,
    setResult,
    addHistory,
    cookies,
  } = useAppStore();

  const parse = useCallback(async () => {
    if (!url) {
      toast.error("Masukkan URL terlebih dahulu.");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("URL tidak valid. Gunakan format http:// atau https://");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("connecting");
    setIsLoading(true);

    const headerMap: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.enabled && h.key.trim()) headerMap[h.key.trim()] = h.value;
    });
    if (cookies.length > 0) {
      const cookieHeader = cookies
        .filter((c) => c.name)
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      if (cookieHeader) headerMap["Cookie"] = cookieHeader;
    }

    try {
      const res = await fetch("/api/parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          url,
          method: settings.method,
          headers: headerMap,
          timeout: settings.timeout,
          maxRedirect: settings.maxRedirect,
          followRedirect: settings.followRedirect,
          verifySSL: settings.verifySSL,
          bodyType: settings.bodyType,
          requestBody: settings.requestBody,
          proxy: settings.proxy,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        toast.error(data.error || "Request gagal dijalankan.");
        setResult(null);
        return;
      }

      const result = data as ParserResult;
      setResult(result);
      addHistory(result);
      setStatus("connected");
      toast.success(`Berhasil parsing (${result.responseInfo.status})`);
    } catch (err: any) {
      if (err.name === "AbortError") {
        setStatus("idle");
        toast.info("Request dihentikan.");
      } else {
        setStatus("error");
        toast.error(err.message || "Terjadi kesalahan jaringan.");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [url, headers, settings, cookies, setStatus, setIsLoading, setResult, addHistory]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { parse, stop };
}
