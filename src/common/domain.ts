/**
 * Extracts the top-level domain (registered domain) from a hostname.
 * e.g., "www.netflix.com" -> "netflix.com"
 *       "watch.netflix.com" -> "netflix.com"
 *       "youtube.com" -> "youtube.com"
 */
export function getTopLevelDomain(hostname: string): string {
  if (!hostname) return "";
  const clean = hostname
    .toLowerCase()
    .trim()
    .replace(/^www\./, "");
  const parts = clean.split(".");
  if (parts.length <= 2) return clean;

  const secondLast = parts[parts.length - 2];
  if (["co", "com", "net", "org", "gov", "edu", "ac"].includes(secondLast) && parts.length > 2) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

/**
 * Checks if a hostname's top-level domain is present in the enabled domains list.
 */
export function isDomainEnabled(hostname: string, enabledDomains: string[]): boolean {
  if (!hostname) return false;
  const domain = getTopLevelDomain(hostname);
  const enabledSet = new Set(enabledDomains.map((d) => d.toLowerCase()));
  return enabledSet.has(domain);
}
