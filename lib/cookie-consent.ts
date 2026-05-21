export const COOKIE_CONSENT_KEY = "datagon-cookie-consent";

export const COOKIE_CONSENT_EVENT = "datagon-cookie-consent";

export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(COOKIE_CONSENT_KEY));
}

export function acceptCookieConsent(): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, "1");
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
