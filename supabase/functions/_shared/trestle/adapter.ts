// Transforms a Trestle Property record into the same normalised structure the
// CSV importer produces. No field is referenced unless it is in PROPERTY_SELECT.

import type { NormalisedRecord, PropertyData, AgentData } from '../mls/ingest.ts';

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]+/g, ''));
  return Number.isNaN(n) ? null : n;
}

function dateOnly(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
}

export function mapProperty(p: any): PropertyData {
  const streetNumber = str(p.StreetNumberNumeric);
  const streetDirPrefix = str(p.StreetDirPrefix);
  const streetName = str(p.StreetName);
  const streetSuffix = str(p.StreetSuffix);

  const parts = [streetNumber, streetDirPrefix, streetName, streetSuffix].filter(Boolean);
  const fullAddress = parts.length > 0 ? parts.join(' ') : str(p.UnparsedAddress);

  return {
    city: str(p.City),
    state: str(p.StateOrProvince),
    zip: str(p.PostalCode),
    country: str(p.Country),
    county: str(p.CountyOrParish),
    // Closed listings report ClosePrice; everything else uses ListPrice.
    price: num(p.ClosePrice) ?? num(p.ListPrice),
    // Never manufacture a close date for a listing that has not closed.
    closeDate: dateOnly(p.CloseDate),
    daysOnMarket: num(p.DaysOnMarket) === null ? null : Math.trunc(num(p.DaysOnMarket) as number),
    streetNumber,
    streetDirPrefix,
    streetName,
    streetSuffix,
    fullAddress,
  };
}

export function mapRecord(p: any): NormalisedRecord {
  const property = mapProperty(p);

  const listingAgent: AgentData = {
    firstName: str(p.ListAgentFirstName),
    lastName: str(p.ListAgentLastName),
    email: str(p.ListAgentEmail),
    phone: str(p.ListAgentMobilePhone),
    type: 'Listing Agent',
    property,
    agentKey: str(p.ListAgentKey),
  };

  const coEmail = str(p.CoListAgentEmail);
  const coPhone = str(p.CoListAgentMobilePhone);
  const coListingAgent: AgentData | null =
    coEmail || coPhone
      ? {
          firstName: str(p.CoListAgentFirstName),
          lastName: str(p.CoListAgentLastName),
          email: coEmail,
          phone: coPhone,
          type: 'Co-Listing Agent',
          property,
        }
      : null;

  return {
    mlsId: str(p.ListingId),
    listingKey: str(p.ListingKey),
    // Raw provider status preserved exactly as supplied.
    standardStatus: str(p.StandardStatus),
    mlsStatusRaw: str(p.MlsStatus) ?? str(p.StandardStatus),
    contractStatusChangeDate: dateOnly(p.ContractStatusChangeDate),
    modificationTimestamp: str(p.ModificationTimestamp),
    property,
    listingAgent,
    coListingAgent,
  };
}
