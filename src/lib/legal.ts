/**
 * Single source of truth for the identity data that the legal pages (Terms,
 * Privacy) and their JSON-LD need.
 *
 * Couders is not registered as a company yet, so `entity.registered` is false
 * and the documents render the "sole trader / unregistered project" wording:
 * the operator is identified by brand + contact email, with no company form,
 * registry number or seat claimed anywhere. That is the honest position under
 * GDPR art. 13 — a controller must be identifiable and reachable, but it does
 * not have to be a limited company.
 *
 * ── WHEN THE COMPANY IS REGISTERED ──────────────────────────────────────────
 * Fill the fields marked TODO below and flip `registered` to true. Every
 * legal page, the address block in the footer and the Organization schema
 * pick the new data up automatically — no other file needs editing.
 */

export type LegalEntity = {
  /** Flip to true once the company exists in the register. */
  registered: boolean;
  /** Brand name, used in body copy on every page. */
  brand: string;
  /** Full legal name incl. company form. Empty until registered. */
  legalName: string;
  /** Street + number. Empty until registered. */
  street: string;
  /** Postal code + city. Empty until registered. */
  city: string;
  /** ISO 3166-1 alpha-2 country code of the seat. */
  country: string;
  /** Polish tax id. Empty until registered. */
  nip: string;
  /** Polish statistical id. Empty until registered. */
  regon: string;
  /** KRS number, only for a company (sp. z o.o., S.A.). Empty otherwise. */
  krs: string;
  /** General contact inbox. */
  email: string;
  /** Inbox for data-protection requests (GDPR art. 15-22). */
  privacyEmail: string;
  /** Public site origin without a trailing slash. */
  domain: string;
  /** Last substantive revision of the legal documents, ISO yyyy-mm-dd. */
  lastUpdated: string;
};

export const LEGAL_ENTITY: LegalEntity = {
  registered: false, // TODO: true once the company is registered
  brand: "Couders",
  legalName: "", // TODO: e.g. "Couders sp. z o.o."
  street: "", // TODO: e.g. "ul. Przykładowa 1/2"
  city: "", // TODO: e.g. "30-001 Kraków"
  country: "PL",
  nip: "", // TODO
  regon: "", // TODO
  krs: "", // TODO (company only)
  email: "contact@couders.com",
  privacyEmail: "contact@couders.com", // TODO: e.g. "privacy@couders.com"
  domain: "https://couders.com",
  lastUpdated: "2026-08-25",
};

/**
 * Address lines to print in a legal document's "who we are" block. Returns an
 * empty array while unregistered, so callers render the contact-only variant
 * instead of an address stub with blanks in it.
 */
export function entityAddressLines(e: LegalEntity = LEGAL_ENTITY): string[] {
  if (!e.registered) return [];
  return [e.legalName, e.street, e.city].filter(Boolean);
}

/**
 * Registry identifiers as "LABEL: value" pairs, skipping any that are unset
 * (a sole trader has NIP/REGON but no KRS).
 */
export function entityRegistryLines(e: LegalEntity = LEGAL_ENTITY): string[] {
  if (!e.registered) return [];
  return [
    e.nip && `NIP: ${e.nip}`,
    e.regon && `REGON: ${e.regon}`,
    e.krs && `KRS: ${e.krs}`,
  ].filter(Boolean) as string[];
}
