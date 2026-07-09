import { existsSync } from "node:fs";
import { join } from "node:path";
import { screens } from "../src/data/screens-manifest.mjs";

const root = process.cwd();
const required = [
  "public/assets/logo.png",
  ...screens.map((screen) => `public/assets/screenshots/${screen.file}`)
];

const missing = required.filter((file) => !existsSync(join(root, file)));

if (screens.length !== 18) {
  console.error(`Expected 18 screens, found ${screens.length}.`);
  process.exit(1);
}

if (missing.length) {
  console.error("Missing required website assets:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`Validated ${screens.length} screenshots and logo.`);
