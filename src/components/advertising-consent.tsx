import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY, CONSENT_NOTICE, NOTICE_VERSION, REGULATED, readConsent, setVisitRegion, syncPixel, type ConsentRecord } from "@/lib/meta-pixel";

export function AdvertisingConsent() {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState("");
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    async function start() {
      let country = "";
      try {
        const res = await fetch("/cdn-cgi/trace", { signal: controller.signal });
        if (res.ok) {
          const trace = new URLSearchParams((await res.text()).trim().replace(/\n/g, "&"));
          if (trace.get("h") === window.location.host) country = trace.get("loc") || "";
        }
      } catch { /* Unknown regions require consent. */ }
      clearTimeout(timeout);
      if (!alive) return;
      setVisitRegion(country); setRegion(country);
      setOpen(!readConsent() && (!country || country === "XX" || country === "T1" || REGULATED.has(country)));
      syncPixel();
    }
    void start();
    const refresh = () => { syncPixel(); setOpen(false); };
    const show = () => setOpen(true);
    window.addEventListener("storage", refresh);
    window.addEventListener("open-cookie-settings", show);
    return () => { alive = false; controller.abort(); clearTimeout(timeout); window.removeEventListener("storage", refresh); window.removeEventListener("open-cookie-settings", show); };
  }, []);
  function choose(choice: ConsentRecord["choice"]) {
    const previous = readConsent();
    const now = new Date().toISOString();
    const record: ConsentRecord = {
      visitor: previous?.visitor || crypto.randomUUID(), region, choice, time: now,
      noticeVersion: NOTICE_VERSION, notice: CONSENT_NOTICE,
      choicesShown: ["Aceitar", "Recusar", "Configurações de cookies"],
      acceptedAt: choice === "accepted" ? now : previous?.acceptedAt,
    };
    try {
      const history = JSON.parse(localStorage.getItem(`${CONSENT_KEY}-history`) || "[]");
      localStorage.setItem(`${CONSENT_KEY}-history`, JSON.stringify([...history, record]));
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch { window.fbq?.("consent", "revoke"); setOpen(false); return; }
    syncPixel(); setOpen(false);
  }
  if (!open) return null;
  return <section role="dialog" aria-label="Preferências de cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-lg border border-border bg-card p-5 text-card-foreground shadow-soft">
    <h2 className="font-bold text-deep">Sua privacidade</h2>
    <p className="mt-2 text-sm">{CONSENT_NOTICE}</p>
    <Link to="/privacidade" className="mt-2 inline-block text-sm underline">Política de privacidade</Link>
    <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" onClick={() => choose("rejected")}>Recusar</Button><Button variant="outline" onClick={() => choose("accepted")}>Aceitar</Button></div>
  </section>;
}