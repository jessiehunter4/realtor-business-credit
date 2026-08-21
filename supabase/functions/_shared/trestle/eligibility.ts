// Server-side validation and in-memory record filtering.
// Status is NEVER a filter — every MLS status is ingested.

import type { NormalisedRecord } from '../mls/ingest.ts';

export function isValidZip(zip: unknown): boolean {
  return typeof zip === 'string' && /^[0-9]{5}$/.test(zip.trim());
}

export function validateZips(zips: string[]): string[] {
  const valid = zips.map((z) => String(z).trim()).filter(isValidZip);
  return Array.from(new Set(valid));
}

export interface RecordFilters {
  allowedZips: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  maxDaysOnMarket?: number | null;
}

export interface FilterResult {
  eligible: boolean;
  reason?: string;
}

export function evaluateRecord(record: NormalisedRecord, filters: RecordFilters): FilterResult {
  const zip = record.property.zip;
  if (!zip || !isValidZip(zip)) return { eligible: false, reason: 'missing or invalid ZIP' };
  // Defence in depth: re-check the ZIP after retrieval.
  if (!filters.allowedZips.includes(zip)) return { eligible: false, reason: 'ZIP not in an enabled group' };

  const price = record.property.price;
  if (filters.minPrice != null && price != null && price < filters.minPrice) {
    return { eligible: false, reason: 'below minimum price' };
  }
  if (filters.maxPrice != null && price != null && price > filters.maxPrice) {
    return { eligible: false, reason: 'above maximum price' };
  }

  if (
    filters.maxDaysOnMarket != null &&
    record.standardStatus === 'Active' &&
    record.property.daysOnMarket != null &&
    record.property.daysOnMarket > filters.maxDaysOnMarket
  ) {
    return { eligible: false, reason: 'exceeds maximum days on market' };
  }

  return { eligible: true };
}
