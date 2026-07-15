import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { extractHtmlData } from "@/lib/htmlParser";
import type {
  CookieEntry,
  HttpMethod,
  ParserErrorInfo,
  ParserResult,
} from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface ParserRequestBody {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  timeout: number;
  maxRedirect: number;
  followRedirect: boolean;
  verifySSL: boolean;
  bodyType: string;
  requestBody: string;
  proxy?: {
    enabled: boolean;
    httpProxy: string;
    httpsProxy: string;
    proxyUsername: string;
    proxyPassword: string;
  };
}

function parseSetCookie(header: string | string[] | undefined): CookieEntry[] {
  if (!header) return [];
  const arr = Array.isArray(header) ? header : [header];
  return arr.map((raw, idx) => {
    const parts = raw.split(";").map((p) => p.trim());
    const [nameValue, ...attrs] = parts;
    const eqIdx = nameValue.indexOf("=");
    const name = eqIdx >= 0 ? nameValue.slice(0, eqIdx) : nameValue;
    const value = eqIdx >= 0 ? nameValue.slice(eqIdx + 1) : "";
    const entry: CookieEntry = {
      id: `cookie-${idx}-${name}`,
      name,
      value,
      path: "/",
    };
    for (const attr of attrs) {
      const [k, v] = attr.split("=");
      const key = k.toLowerCase();
      if (key === "domain") entry.domain = v;
      else if (key === "path") entry.path = v;
      else if (key === "expires") entry.expires = v;
      else if (key === "httponly") entry.httpOnly = true;
      else if (key === "secure") entry.secure = true;
      else if (key === "samesite") entry.sameSite = v;
    }
    return entry;
  });
}

function classifyError(err: unknown): ParserErrorInfo {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError;
    if (e.code === "ECONNABORTED" || e.message.toLowerCase().includes("timeout")) {
      return { type: "timeout", message: "Request timed out.", code: e.code };
    }
    if (e.code === "ENOTFOUND" || e.code === "EAI_AGAIN") {
      return { type: "dns", message: "Domain could not be resolved (DNS error).", code: e.code };
    }
    if (
      e.code?.startsWith("CERT_") ||
      e.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
      e.message.toLowerCase().includes("certificate") ||
      e.message.toLowerCase().includes("ssl")
    ) {
      return { type: "ssl", message: "SSL/TLS certificate error.", code: e.code };
    }
    if (e.response) {
      const status = e.response.status;
      let message = `Server responded with status ${status}.`;
      if (status === 403) message = "Access forbidden (403). The server refused the request.";
      if (status === 404) message = "Resource not found (404).";
      if (status === 429) message = "Too many requests (429). Rate limited by server.";
      if (status >= 500) message = `Server error (${status}).`;
      return { type: "http", message, status, code: e.code };
    }
    if (e.code === "ECONNREFUSED" || e.code === "ECONNRESET" || e.message.includes("network")) {
      return { type: "network", message: "Network error, connection refused or reset.", code: e.code };
    }
    return { type: "unknown", message: e.message, code: e.code };
  }
  return { type: "unknown", message: err instanceof Error ? err.message : "Unknown error occurred." };
}

export async function POST(req: NextRequest) {
  let body: ParserRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    url,
    method = "GET",
    headers = {},
    timeout = 15000,
    maxRedirect = 5,
    followRedirect = true,
    verifySSL = true,
    bodyType = "raw",
    requestBody = "",
    proxy,
  } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only http and https protocols are supported.");
    }
  } catch {
    return NextResponse.json({ error: "URL is not valid." }, { status: 400 });
  }

  const start = performance.now();
  const redirectChain: string[] = [];

  try {
    const axiosConfig: Record<string, any> = {
      method,
      url,
      headers: { ...headers },
      timeout,
      maxRedirects: followRedirect ? maxRedirect : 0,
      responseType: "text",
      validateStatus: () => true,
      decompress: true,
      transitional: { clarifyTimeoutError: true },
    };

    if (["POST", "PUT", "PATCH"].includes(method) && requestBody) {
      axiosConfig.data = requestBody;
      if (bodyType === "json" && !axiosConfig.headers["Content-Type"]) {
        axiosConfig.headers["Content-Type"] = "application/json";
      }
    }

    if (!verifySSL) {
      const https = await import("https");
      axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    }

    if (proxy?.enabled) {
      const proxyUrl = parsedUrl.protocol === "https:" ? proxy.httpsProxy : proxy.httpProxy;
      if (proxyUrl) {
        try {
          const pUrl = new URL(proxyUrl);
          axiosConfig.proxy = {
            host: pUrl.hostname,
            port: Number(pUrl.port) || 80,
            protocol: pUrl.protocol.replace(":", ""),
          };
          if (proxy.proxyUsername) {
            axiosConfig.proxy.auth = {
              username: proxy.proxyUsername,
              password: proxy.proxyPassword || "",
            };
          }
        } catch {
          // ignore invalid proxy url
        }
      }
    }

    const response = await axios.request(axiosConfig);
    const elapsed = performance.now() - start;

    const html: string = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
    const responseHeaders: Record<string, string> = {};
    Object.entries(response.headers || {}).forEach(([k, v]) => {
      responseHeaders[k] = Array.isArray(v) ? v.join(", ") : String(v);
    });

    const cookies = parseSetCookie(response.headers["set-cookie"] as any);
    const finalUrl = (response.request?.res?.responseUrl as string) || url;
    const extracted = extractHtmlData(html, finalUrl);

    const contentLength = Number(response.headers["content-length"]) || Buffer.byteLength(html, "utf8");

    const result: ParserResult = {
      requestUrl: url,
      requestMethod: method,
      requestHeaders: headers,
      responseInfo: {
        status: response.status,
        statusText: response.statusText || "",
        ok: response.status >= 200 && response.status < 400,
        responseTimeMs: elapsed,
        contentLength,
        server: responseHeaders["server"] || "Unknown",
        contentType: responseHeaders["content-type"] || "Unknown",
        encoding: responseHeaders["content-encoding"] || "identity",
        finalUrl,
        redirected: finalUrl !== url,
        redirectChain,
      },
      responseHeaders,
      cookies,
      html,
      extracted,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const errorInfo = classifyError(err);
    const elapsed = performance.now() - start;
    return NextResponse.json(
      {
        error: errorInfo.message,
        errorType: errorInfo.type,
        errorCode: errorInfo.code,
        status: errorInfo.status,
        responseTimeMs: elapsed,
      },
      { status: errorInfo.status || 502 }
    );
  }
}
