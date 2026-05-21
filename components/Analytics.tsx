"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, hasCookieConsent } from "@/lib/cookie-consent";

/** ID с live Kraken (ym(54591493)); отключить: NEXT_PUBLIC_YM_ID= */
const YM_ID = process.env.NEXT_PUBLIC_YM_ID ?? "54591493";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const YM_WEBVISOR = process.env.NEXT_PUBLIC_YM_WEBVISOR === "1";

export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (hasCookieConsent()) setEnabled(true);
    const onAccept = () => setEnabled(true);
    window.addEventListener(COOKIE_CONSENT_EVENT, onAccept);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onAccept);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {YM_ID && (
        <>
          <Script id="yandex-metrika" strategy="lazyOnload">
            {`
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${YM_ID}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:${YM_WEBVISOR} });
`}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                alt=""
                style={{ position: "absolute", left: "-9999px" }}
              />
            </div>
          </noscript>
        </>
      )}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
`}
          </Script>
        </>
      )}
    </>
  );
}
