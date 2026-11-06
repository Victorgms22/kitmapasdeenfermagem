export const PIXEL_ID = "2623259094801410";
export const CONSENT_KEY = "advertising-consent-v1";
export const NOTICE_VERSION = "meta-2026-11-06";
export const CONSENT_NOTICE = "Usamos cookies da Meta para medir visitas e cliques nos botões de compra e apoiar a otimização de anúncios. Compartilhamos com a Meta dados de navegação, endereço IP, informações do navegador e identificadores de cookies. Você pode aceitar, recusar ou retirar sua autorização em Configurações de cookies.";
export const REGULATED = new Set("AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LI LV LT LU MT NL NO PL PT RO SK SI ES SE GB CH BR".split(" "));

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
};
declare global {
  interface Window { fbq?: Fbq; _fbq?: Fbq; metaPixelStarted?: boolean; metaPageViewSent?: boolean; }
  interface Navigator { globalPrivacyControl?: boolean; }
}
export type ConsentRecord = {
  visitor: string; region: string; choice: "accepted" | "rejected";
  time: string; noticeVersion: string; notice: string;
  choicesShown: string[]; acceptedAt?: string | undefined;
};
export function permitsAdvertising(region: string, choice?: string, gpc = false) {
  if (gpc || choice === "rejected") return false;
  if (choice === "accepted") return true;
  return Boolean(region && region !== "XX" && region !== "T1" && !REGULATED.has(region));
}
export function readConsent(): ConsentRecord | undefined {
  try { const record = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    return record?.noticeVersion === NOTICE_VERSION && ["accepted", "rejected"].includes(record.choice) ? record : undefined;
  } catch { return undefined; }
}
let visitRegion = "";
export function setVisitRegion(region: string) { visitRegion = region; }
export function advertisingAllowed() {
  return permitsAdvertising(visitRegion, readConsent()?.choice, navigator.globalPrivacyControl === true);
}
export function syncPixel() {
  if (!advertisingAllowed()) { window.fbq?.("consent", "revoke"); return; }
  if (!window.fbq) return;
  window.fbq("consent", "grant");
  if (!window.metaPixelStarted) {
    window.metaPixelStarted = true;
    window.fbq("init", PIXEL_ID, {}, { agent: "lovable" });
    const script = document.createElement("script");
    script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  if (!window.metaPageViewSent) {
    window.metaPageViewSent = true;
    window.fbq("track", "PageView");
  }
}
export function trackBuyClick() {
  if (typeof window === "undefined" || !window.fbq || !advertisingAllowed()) return;
  try { window.fbq("trackCustom", "ClicouComprar"); } catch { /* Checkout remains available if blocked. */ }
}
// Official queue bootstrap only; the remote SDK, initialization and events wait for permission.
export const PIXEL_BOOTSTRAP = `(function(f){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];})(window);`;