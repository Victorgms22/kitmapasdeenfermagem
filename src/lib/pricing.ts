export const PRICE_FROM = 279.9;
export const PRICE_NOW = 27.99;

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (v: number) => brl.format(v).replace(/\u00a0/g, " ");

export const discountPercent = (from: number, now: number) => Math.round((1 - now / from) * 100);
