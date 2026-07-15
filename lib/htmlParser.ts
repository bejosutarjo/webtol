import * as cheerio from "cheerio";
import type { ExtractedData, ParsedElementSummary, ParsedMeta } from "@/types";

function attrsOf(el: cheerio.Cheerio<any>, $: cheerio.CheerioAPI): Record<string, string> {
  const node = el.get(0) as any;
  const attribs = node?.attribs || {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(attribs)) {
    out[key] = String(attribs[key]);
  }
  return out;
}

function summarize(
  $: cheerio.CheerioAPI,
  selector: string,
  withText = false,
  limit = 500
): ParsedElementSummary[] {
  const results: ParsedElementSummary[] = [];
  $(selector)
    .slice(0, limit)
    .each((_, node) => {
      const el = $(node);
      results.push({
        tag: (node as any).tagName || (node as any).name || selector,
        attributes: attrsOf(el, $),
        text: withText ? el.text().trim().slice(0, 300) : undefined,
      });
    });
  return results;
}

export function extractHtmlData(html: string, baseUrl: string): ExtractedData {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";
  const keywords = $('meta[name="keywords"]').attr("content") || "";
  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const language = $("html").attr("lang") || "";
  const charset =
    $("meta[charset]").attr("charset") ||
    $('meta[http-equiv="Content-Type"]').attr("content") ||
    "";

  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, node) => {
    const el = $(node);
    const prop = el.attr("property");
    const content = el.attr("content");
    if (prop && content !== undefined) openGraph[prop] = content;
  });

  const twitterCard: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, node) => {
    const el = $(node);
    const name = el.attr("name");
    const content = el.attr("content");
    if (name && content !== undefined) twitterCard[name] = content;
  });

  const headings: Record<string, string[]> = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  (["h1", "h2", "h3", "h4", "h5", "h6"] as const).forEach((tag) => {
    $(tag).each((_, node) => {
      headings[tag].push($(node).text().trim());
    });
  });

  const links = summarize($, "a[href]");
  const images = summarize($, "img");
  const scripts = summarize($, "script");
  const styles = summarize($, 'link[rel="stylesheet"], style');
  const forms = summarize($, "form");
  const inputs = summarize($, "input, textarea, select");
  const buttons = summarize($, "button");
  const tables = summarize($, "table");
  const iframes = summarize($, "iframe");
  const videos = summarize($, "video");
  const audios = summarize($, "audio");
  const svgs = summarize($, "svg");

  const metas: ParsedMeta[] = [];
  $("meta").each((_, node) => {
    const el = $(node);
    metas.push({
      name: el.attr("name"),
      property: el.attr("property"),
      content: el.attr("content"),
      charset: el.attr("charset"),
    });
  });

  const jsonLd: string[] = [];
  $('script[type="application/ld+json"]').each((_, node) => {
    const content = $(node).html();
    if (content) jsonLd.push(content.trim());
  });

  return {
    title,
    description,
    keywords,
    canonical,
    language,
    charset,
    openGraph,
    twitterCard,
    headings,
    links,
    images,
    scripts,
    styles,
    metas,
    forms,
    inputs,
    buttons,
    tables,
    iframes,
    videos,
    audios,
    svgs,
    jsonLd,
  };
}

export function resolveAssetUrls(extracted: ExtractedData, baseUrl: string) {
  const resolve = (u?: string) => {
    if (!u) return "";
    try {
      return new URL(u, baseUrl).toString();
    } catch {
      return u;
    }
  };

  const images = extracted.images.map((i) => resolve(i.attributes.src)).filter(Boolean);
  const styles = extracted.styles.map((s) => resolve(s.attributes.href)).filter(Boolean);
  const scripts = extracted.scripts.map((s) => resolve(s.attributes.src)).filter(Boolean);

  return { images, styles, scripts };
}
