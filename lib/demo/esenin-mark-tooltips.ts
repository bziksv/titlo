const POPOVER_ID = "esenin-demo-tip-popover";

function getPopover(): HTMLDivElement {
  let el = document.getElementById(POPOVER_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = POPOVER_ID;
    el.className = "esenin-tip-popover";
    el.hidden = true;
    el.setAttribute("role", "tooltip");
    document.body.appendChild(el);
  }
  return el;
}

function showTip(mark: Element, popover: HTMLDivElement): void {
  const text = mark.getAttribute("data-esenin-tip") || "";
  if (!text) return;

  popover.textContent = text;
  popover.hidden = false;
  popover.classList.add("is-visible");

  const rect = mark.getBoundingClientRect();
  popover.style.top = `${rect.top + window.scrollY - popover.offsetHeight - 8}px`;
  popover.style.left = `${Math.max(8, rect.left + window.scrollX)}px`;
}

function hideTip(popover: HTMLDivElement): void {
  popover.classList.remove("is-visible");
  popover.hidden = true;
}

/** Hover-подсказки для mark[data-esenin-tip] в демо-отчёте Есенина. */
export function attachEseninMarkTooltips(container: HTMLElement | null): () => void {
  if (!container) return () => undefined;

  const popover = getPopover();
  const cleanups: Array<() => void> = [];

  container.querySelectorAll("[data-esenin-tip]").forEach((mark) => {
    const onEnter = () => showTip(mark, popover);
    const onLeave = () => hideTip(popover);

    mark.addEventListener("mouseenter", onEnter);
    mark.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      mark.removeEventListener("mouseenter", onEnter);
      mark.removeEventListener("mouseleave", onLeave);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
    hideTip(popover);
  };
}
