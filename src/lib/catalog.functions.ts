import { createServerFn } from "@tanstack/react-start";
import type { Sku } from "./catalog-types";

const SPREADSHEET_ID = "1ItM29QVpYh85ESpMLWVJjg13RP-ACHkSPRcGtL21yl8";
const TABS = [
  "Modus Furniture",
  "Ferm Living",
  "Arteriors Home",
  "Havenly",
  "Hem",
  "Vesta",
  "Castlery",
];
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

type CacheEntry = { at: number; data: Sku[] };
let cache: CacheEntry | null = null;

function parseMoney(v: string | undefined): number {
  if (!v) return 0;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function parseInt0(v: string | undefined): number {
  if (!v) return 0;
  const n = parseInt(String(v).replace(/[^0-9-]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

async function fetchFromSheet(): Promise<Sku[]> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey || !sheetKey) {
    throw new Error("Google Sheets connector not configured");
  }
  const params = TABS.map(
    (t) => `ranges=${encodeURIComponent(`'${t}'!A2:I`)}`,
  ).join("&");
  const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${params}&majorDimension=ROWS`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetKey,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets gateway ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    valueRanges?: { values?: string[][] }[];
  };

  const out: Sku[] = [];
  json.valueRanges?.forEach((vr, tabIdx) => {
    const brand = TABS[tabIdx];
    vr.values?.forEach((row) => {
      const [name, sheetBrand, category, image, price, msrp, , units, updated] =
        row;
      if (!name) return;
      const priceN = parseMoney(price);
      const msrpN = parseMoney(msrp);
      if (!priceN) return;
      const unitsN = parseInt0(units);
      const finalBrand = (sheetBrand || brand || "").trim();
      const finalCat = (category || "Uncategorized").trim();
      const img =
        image && image !== "N/A" && image.startsWith("http")
          ? image
          : "";
      const id = `${slug(finalBrand)}-${hash(name + image)}`;
      out.push({
        id,
        name: String(name).trim(),
        brand: finalBrand,
        category: finalCat,
        image: img,
        price: priceN,
        msrp: msrpN || priceN,
        units: unitsN,
        lastUpdated: updated || "",
      });
    });
  });
  return out;
}

export const getCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: Sku[]; fetchedAt: string }> => {
    const now = Date.now();
    if (cache && now - cache.at < CACHE_TTL_MS) {
      return { items: cache.data, fetchedAt: new Date(cache.at).toISOString() };
    }
    try {
      const items = await fetchFromSheet();
      cache = { at: now, data: items };
      return { items, fetchedAt: new Date(now).toISOString() };
    } catch (err) {
      if (cache) {
        // Serve stale on failure
        return {
          items: cache.data,
          fetchedAt: new Date(cache.at).toISOString(),
        };
      }
      throw err;
    }
  },
);
