import type { ParserResult } from "@/types";
import { downloadTextFile } from "@/lib/utils";
import { resolveAssetUrls } from "@/lib/htmlParser";

export function buildHar(result: ParserResult) {
  const reqHeaders = Object.entries(result.requestHeaders).map(([name, value]) => ({
    name,
    value,
  }));
  const resHeaders = Object.entries(result.responseHeaders).map(([name, value]) => ({
    name,
    value,
  }));

  return {
    log: {
      version: "1.2",
      creator: { name: "Web Parser Tool", version: "1.0.0" },
      entries: [
        {
          startedDateTime: result.timestamp,
          time: result.responseInfo.responseTimeMs,
          request: {
            method: result.requestMethod,
            url: result.requestUrl,
            httpVersion: "HTTP/1.1",
            cookies: result.cookies.map((c) => ({ name: c.name, value: c.value })),
            headers: reqHeaders,
            queryString: [],
            headersSize: -1,
            bodySize: 0,
          },
          response: {
            status: result.responseInfo.status,
            statusText: result.responseInfo.statusText,
            httpVersion: result.responseInfo.httpVersion || "HTTP/1.1",
            cookies: result.cookies.map((c) => ({ name: c.name, value: c.value })),
            headers: resHeaders,
            content: {
              size: result.responseInfo.contentLength,
              mimeType: result.responseInfo.contentType,
              text: result.html,
            },
            redirectURL: result.responseInfo.redirected
              ? result.responseInfo.finalUrl
              : "",
            headersSize: -1,
            bodySize: result.responseInfo.contentLength,
          },
          cache: {},
          timings: {
            send: 0,
            wait: result.responseInfo.responseTimeMs,
            receive: 0,
          },
        },
      ],
    },
  };
}

function safeFileName(url: string) {
  try {
    const host = new URL(url).hostname.replace(/\W+/g, "_");
    return `${host || "web-parser"}`;
  } catch {
    return "web-parser";
  }
}

export function downloadHtml(result: ParserResult) {
  downloadTextFile(`${safeFileName(result.requestUrl)}.html`, result.html, "text/html");
}

export function downloadJson(result: ParserResult) {
  downloadTextFile(
    `${safeFileName(result.requestUrl)}.json`,
    JSON.stringify(result, null, 2),
    "application/json"
  );
}

export function downloadTxt(result: ParserResult) {
  downloadTextFile(`${safeFileName(result.requestUrl)}.txt`, result.html, "text/plain");
}

export function downloadHeaders(result: ParserResult) {
  downloadTextFile(
    `${safeFileName(result.requestUrl)}-headers.json`,
    JSON.stringify(
      { request: result.requestHeaders, response: result.responseHeaders },
      null,
      2
    ),
    "application/json"
  );
}

export function downloadCookies(result: ParserResult) {
  downloadTextFile(
    `${safeFileName(result.requestUrl)}-cookies.json`,
    JSON.stringify(result.cookies, null, 2),
    "application/json"
  );
}

export function downloadImages(result: ParserResult) {
  const { images } = resolveAssetUrls(result.extracted, result.requestUrl);
  downloadTextFile(`${safeFileName(result.requestUrl)}-images.txt`, images.join("\n"));
}

export function downloadCss(result: ParserResult) {
  const { styles } = resolveAssetUrls(result.extracted, result.requestUrl);
  downloadTextFile(`${safeFileName(result.requestUrl)}-css.txt`, styles.join("\n"));
}

export function downloadJs(result: ParserResult) {
  const { scripts } = resolveAssetUrls(result.extracted, result.requestUrl);
  downloadTextFile(`${safeFileName(result.requestUrl)}-scripts.txt`, scripts.join("\n"));
}

export function downloadAllAssets(result: ParserResult) {
  const { images, styles, scripts } = resolveAssetUrls(result.extracted, result.requestUrl);
  const content = [
    "# Images", ...images,
    "", "# CSS", ...styles,
    "", "# JavaScript", ...scripts,
  ].join("\n");
  downloadTextFile(`${safeFileName(result.requestUrl)}-all-assets.txt`, content);
}

export function downloadHar(result: ParserResult) {
  downloadTextFile(
    `${safeFileName(result.requestUrl)}.har`,
    JSON.stringify(buildHar(result), null, 2),
    "application/json"
  );
}
