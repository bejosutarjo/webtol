# Web Parser Tool

Aplikasi web modern untuk melakukan request HTTP ke URL manapun dan menampilkan source
code HTML beserta seluruh informasi request/response, dengan tampilan profesional
terinspirasi dari Postman, VS Code, dan Chrome DevTools.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Lalu buka [http://localhost:3000](http://localhost:3000).

## Fitur Utama

- **Parser HTTP** — request dilakukan sepenuhnya di server (API Route Next.js) sehingga
  tidak terkena CORS, menggunakan Axios dengan penanganan timeout, redirect, SSL error,
  DNS error, dan status HTTP (404/500/403/429).
- **Monaco Editor** — menampilkan source HTML dengan syntax highlight, line number,
  word wrap, search, format, copy, download, dan mode read-only.
- **Response Panel** — tab Response / Preview / Headers / Cookies / JSON / HTML Parser.
- **HTML Parser** — ekstraksi otomatis title, description, keywords, canonical,
  OpenGraph, Twitter Card, heading H1-H6, link, gambar, script, CSS, meta, form, input,
  button, table, iframe, video, audio, SVG, dan JSON-LD.
- **Search Tool** — pencarian di source HTML berdasarkan text, regex, tag, class, id,
  atau attribute.
- **Header Builder** — semua field header umum, custom header, import/export JSON,
  dan preset (Chrome Windows/Android, Firefox, Safari, Edge, Postman, Curl).
- **Download Center** — HTML, JSON, TXT, Headers, Cookies, daftar URL gambar/CSS/JS,
  seluruh asset, dan HAR.
- **Pengaturan** — method, timeout, retry, redirect, SSL, keep-alive, HTTP/2, gzip,
  brotli, proxy (HTTP/HTTPS/SOCKS5 + auth), tema, bahasa, folder unduhan, dan
  Cookie Manager penuh (tambah/edit/hapus, import Netscape/JSON, export).
- **Body Request** — Raw, JSON, XML, Form Data, Multipart, Binary, Text.

## Struktur Folder

```
app/                API routes & root page
  api/parser/        Endpoint parsing HTTP (server-side, no CORS)
components/
  layout/            Header, UrlBar, BottomNav
  views/             Home, Download, Header Builder, Settings views
  parser/            Monaco editor, response panel, extracted data, search, cookies
  ui/                 Reusable primitives (button, input, tabs, dll)
lib/                 Utilities: HTML parser, header presets, download helpers
hooks/               useParser (fetch + abort controller)
store/               Zustand global state
types/               Shared TypeScript types
```

## Teknologi

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Monaco Editor ·
Axios · Cheerio · Zustand · Framer Motion · React Hook Form · Sonner (toast).
