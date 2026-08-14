"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_EVENT, hasCookieConsent } from "@/lib/cookie-consent";

/** Счётчик Titlo (как в cabinet.titlo.ru). Отключить: NEXT_PUBLIC_YM_ID= */
const YM_ID = process.env.NEXT_PUBLIC_YM_ID ?? "89500732";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const YM_WEBVISOR = process.env.NEXT_PUBLIC_YM_WEBVISOR === "1";
/** Top.Mail.Ru / VK Ads. Отключить: NEXT_PUBLIC_TOP_MAIL_RU_ID= */
const TOP_MAIL_RU_ID = process.env.NEXT_PUBLIC_TOP_MAIL_RU_ID ?? "3787377";

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
      {TOP_MAIL_RU_ID && (
        <>
          <Script id="top-mail-ru" strategy="lazyOnload">
            {`
var _tmr = window._tmr || (window._tmr = []);
_tmr.push({id: "${TOP_MAIL_RU_ID}", type: "pageView", start: (new Date()).getTime()});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "tmr-code");
`}
          </Script>
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://top-fwz1.mail.ru/counter?id=${TOP_MAIL_RU_ID};js=na`}
                alt="Top.Mail.Ru"
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
