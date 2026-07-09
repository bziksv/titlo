/**
 * Карточки /services/ из lib/content/modules.ts → lib/content/services.generated.ts
 * (раньше скрейпил redbox.su и подтягивал «Компания», «Контакты», cookie — больше не используем.)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/content/services.generated.ts");

const lines = [
  "/** @deprecated Используйте lib/content/services.ts — список строится из modules.ts */",
  'export type { ServiceItem } from "./services";',
  'export { SERVICE_ITEMS, SERVICES_INTRO } from "./services";',
  "",
];

fs.writeFileSync(OUT, lines.join("\n"));
console.log("written", OUT, "(re-exports services.ts)");
