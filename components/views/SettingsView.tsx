"use client";

import {
  Settings2, Network, Shield, Cookie as CookieIcon, Braces, Palette,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import { CookieManager } from "@/components/parser/CookieManager";
import type { BodyType, HttpMethod } from "@/types";

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-base-800/40">
      <span className="text-xs text-slate-300">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SettingsView() {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="scroll-thin h-full overflow-auto p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Pengaturan</h2>
        <p className="text-xs text-slate-500">
          Konfigurasi request, jaringan, proxy, cookie, dan tampilan aplikasi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {/* Request Settings */}
        <Card>
          <CardHeader>
            <CardTitle><Settings2 className="h-3.5 w-3.5" /> Request Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Request Method</Label>
                <Select
                  value={settings.method}
                  onChange={(e) => updateSettings({ method: e.target.value as HttpMethod })}
                  className="mt-1"
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Timeout (ms)</Label>
                <Input
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => updateSettings({ timeout: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Retry</Label>
                <Input
                  type="number"
                  value={settings.retry}
                  onChange={(e) => updateSettings({ retry: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Redirect</Label>
                <Input
                  type="number"
                  value={settings.maxRedirect}
                  onChange={(e) => updateSettings({ maxRedirect: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <ToggleRow label="Follow Redirect" checked={settings.followRedirect} onChange={(v) => updateSettings({ followRedirect: v })} />
              <ToggleRow label="Verify SSL" checked={settings.verifySSL} onChange={(v) => updateSettings({ verifySSL: v })} />
              <ToggleRow label="Keep Alive" checked={settings.keepAlive} onChange={(v) => updateSettings({ keepAlive: v })} />
              <ToggleRow label="HTTP/2" checked={settings.http2} onChange={(v) => updateSettings({ http2: v })} />
              <ToggleRow label="Gzip" checked={settings.gzip} onChange={(v) => updateSettings({ gzip: v })} />
              <ToggleRow label="Brotli" checked={settings.brotli} onChange={(v) => updateSettings({ brotli: v })} />
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings */}
        <Card>
          <CardHeader>
            <CardTitle><Braces className="h-3.5 w-3.5" /> Perilaku Aplikasi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-1">
            <ToggleRow label="Auto Cookie" checked={settings.autoCookie} onChange={(v) => updateSettings({ autoCookie: v })} />
            <ToggleRow label="Auto Save" checked={settings.autoSave} onChange={(v) => updateSettings({ autoSave: v })} />
            <ToggleRow label="Auto Scroll" checked={settings.autoScroll} onChange={(v) => updateSettings({ autoScroll: v })} />
            <ToggleRow label="Pretty Print" checked={settings.prettyPrint} onChange={(v) => updateSettings({ prettyPrint: v })} />
            <ToggleRow label="Dark Mode" checked={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} />
          </CardContent>
        </Card>

        {/* Proxy Settings */}
        <Card>
          <CardHeader>
            <CardTitle><Network className="h-3.5 w-3.5" /> Proxy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <ToggleRow label="Aktifkan Proxy" checked={settings.proxy.enabled} onChange={(v) => updateSettings({ proxy: { ...settings.proxy, enabled: v } })} />
            <div>
              <Label>Proxy HTTP</Label>
              <Input
                value={settings.proxy.httpProxy}
                onChange={(e) => updateSettings({ proxy: { ...settings.proxy, httpProxy: e.target.value } })}
                placeholder="http://host:port"
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label>Proxy HTTPS</Label>
              <Input
                value={settings.proxy.httpsProxy}
                onChange={(e) => updateSettings({ proxy: { ...settings.proxy, httpsProxy: e.target.value } })}
                placeholder="http://host:port"
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label>SOCKS5 Proxy</Label>
              <Input
                value={settings.proxy.socks5Proxy}
                onChange={(e) => updateSettings({ proxy: { ...settings.proxy, socks5Proxy: e.target.value } })}
                placeholder="socks5://host:port"
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Proxy Username</Label>
                <Input
                  value={settings.proxy.proxyUsername}
                  onChange={(e) => updateSettings({ proxy: { ...settings.proxy, proxyUsername: e.target.value } })}
                  className="mt-1 text-xs"
                />
              </div>
              <div>
                <Label>Proxy Password</Label>
                <Input
                  type="password"
                  value={settings.proxy.proxyPassword}
                  onChange={(e) => updateSettings({ proxy: { ...settings.proxy, proxyPassword: e.target.value } })}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Locale */}
        <Card>
          <CardHeader>
            <CardTitle><Palette className="h-3.5 w-3.5" /> Tampilan &amp; Bahasa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value as "id" | "en" })}
                  className="mt-1"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </Select>
              </div>
              <div>
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as any })}
                  className="mt-1"
                >
                  <option value="dark-blue">Dark Blue</option>
                  <option value="dark-slate">Dark Slate</option>
                  <option value="midnight">Midnight</option>
                </Select>
              </div>
            </div>
            <div>
              <Label>Default Download Folder</Label>
              <Input
                value={settings.downloadFolder}
                onChange={(e) => updateSettings({ downloadFolder: e.target.value })}
                className="mt-1 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Body Request */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle><Shield className="h-3.5 w-3.5" /> Body Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {(["raw", "json", "xml", "form-data", "multipart", "binary", "text"] as BodyType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => updateSettings({ bodyType: type })}
                    className={`rounded-md border px-2.5 py-1 text-xs capitalize transition-colors ${
                      settings.bodyType === type
                        ? "border-accent-500/50 bg-accent-500/15 text-accent-300"
                        : "border-base-500/30 text-slate-400 hover:bg-base-800/50"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
            <Textarea
              value={settings.requestBody}
              onChange={(e) => updateSettings({ requestBody: e.target.value })}
              placeholder={
                settings.bodyType === "json"
                  ? '{\n  "key": "value"\n}'
                  : "Isi body request di sini..."
              }
              className="min-h-[140px]"
            />
            <p className="text-[11px] text-slate-500">
              Body dikirim hanya untuk method POST, PUT, dan PATCH.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Manager */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle><CookieIcon className="h-3.5 w-3.5" /> Cookie Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <CookieManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
