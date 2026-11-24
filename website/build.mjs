import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy } from "./copy.mjs";

const repo = "https://github.com/Xerolux/idm-heatpump-client";
const base = "https://xerolux.github.io/idm-heatpump-client/";
const output = fileURLToPath(new URL("../dist/pages/", import.meta.url));
const root = fileURLToPath(new URL("../", import.meta.url));
const escape = (text) => String(text).replace(/[&<>"']/gu, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

async function readRelease() {
  const mockPath = process.argv[2];
  if (mockPath) return JSON.parse(await readFile(mockPath, "utf8"));
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  const response = await fetch("https://api.github.com/repos/Xerolux/idm-heatpump-client/releases/latest",
    { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);
  return response.json();
}

const release = await readRelease();
if (!/^v\d+\.\d+\.\d+$/u.test(release.tag_name) || release.draft || release.prerelease) {
  throw new Error("Expected a public stable release");
}
const releaseUrl = `${repo}/releases/tag/${release.tag_name}`;
const downloadPrefix = `${repo}/releases/download/${release.tag_name}/`;
const [major, minor] = release.tag_name.slice(1).split(".").map(Number);
const platforms = [
  { label: "Windows", files: [["EXE", ".exe"]] },
  { label: "Linux", files: [["AppImage", ".AppImage"], ["DEB", ".deb"]] },
  { label: "macOS", files: [["DMG", ".dmg"]] },
].map((platform) => ({
  ...platform,
  files: platform.files.map(([label, extension]) => {
    const matches = release.assets.filter(({ name, state, browser_download_url: url }) =>
      state === "uploaded" && name.endsWith(extension) && url === downloadPrefix + encodeURIComponent(name));
    if (matches.length !== 1) throw new Error(`Missing or ambiguous ${label} download`);
    return { label, url: matches[0].browser_download_url };
  }),
}));
const template = await readFile(join(root, "website/page.html"), "utf8");
const stylesheet = await readFile(join(root, "website/styles.css"));
const stylesheetName = "styles-" + createHash("sha256").update(stylesheet).digest("hex").slice(0, 12) + ".css";
await mkdir(join(output, "assets"), { recursive: true });
await mkdir(join(output, "en"), { recursive: true });
await Promise.all([
  ...["dashboard-demo.png", "connection-manager.png"].map((name) => copyFile(join(root, "docs", name), join(output, "assets", name))),
  copyFile(join(root, "src/main/assets/tray.png"), join(output, "assets/icon.png")),
  writeFile(join(output, stylesheetName), stylesheet),
]);

for (const [lang, content] of Object.entries(copy)) {
  const en = lang === "en";
  const canonical = en ? base + "en/" : base;
  const values = {
    ...Object.fromEntries(Object.entries(content).filter(([, value]) => typeof value === "string").map(([key, value]) => [key, escape(value)])),
    base, canonical, repo, lang, releaseUrl, stylesheetName,
    verification: en ? "" : '<meta name="google-site-verification" content="c0rgvwkppgFoG6F6z1_UvahSU70ABaVIGEkseiPD64s">',
    prefix: en ? "../" : "./",
    alternate: en ? "../" : "./en/",
    otherLang: en ? "de" : "en",
    otherLanguage: en ? "Deutsch" : "English",
    locale: en ? "en_US" : "de_DE",
    otherLocale: en ? "de_DE" : "en_US",
    guideAnchor: en ? "#english" : "",
    releaseTag: escape(release.tag_name),
    features: content.features.map(([title, description]) =>
      `<article class="feature"><h3>${escape(title)}</h3><p>${escape(description)}</p></article>`).join("\n"),
    licensing: major > 0 || minor >= 4
      ? `<section class="section" id="licensing"><div class="wrap"><h2>${escape(content.licensingHeading)}</h2><p>${escape(content.licensingIntro)}</p><p><a href="https://license.xerolux.de/kaufen">${en ? "Purchase page · Coming soon" : "Zur Kaufseite · Coming soon"}</a></p><div class="features">${content.tiers.map(([title, description]) =>
        `<article class="feature"><h3>${escape(title)}</h3><p>${escape(description)}</p></article>`).join("")}</div></div></section>`
      : "",
    setupSteps: content.setupSteps.map(([title, description]) =>
      `<li><strong>${escape(title)}</strong> ${escape(description)}</li>`).join("\n"),
    packages: platforms.map(({ label, files }, index) =>
      `<article class="package"><h3>${label}</h3><p>${escape(content.platformDetails[index])}</p><div class="actions">` +
      files.map((file) => `<a class="button" href="${escape(file.url)}" aria-label="${label} ${file.label}">${file.label}</a>`).join("") +
      "</div></article>").join("\n"),
    faq: content.faq.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join("\n"),
    schema: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "IDM Heatpump Client",
      description: content.description,
      url: canonical,
      inLanguage: lang,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Windows x64, Linux x64, macOS Apple Silicon",
      softwareVersion: release.tag_name.slice(1),
      screenshot: base + "assets/dashboard-demo.png",
      installUrl: releaseUrl,
      license: repo + "/blob/main/LICENSE",
      author: { "@type": "Organization", name: "Xerolux", url: "https://xerolux.de/" },
      offers: { "@type": "Offer", price: 0, priceCurrency: "EUR", url: canonical + "#downloads" },
    }).replaceAll("<", "\\u003c"),
  };
  const page = template.replace(/\{\{(\w+)\}\}/gu, (_, key) => {
    if (!Object.hasOwn(values, key)) throw new Error(`Undefined template value: ${key}`);
    return values[key];
  });
  await writeFile(join(output, en ? "en/index.html" : "index.html"), page);
}
const urls = [base, base + "en/"];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  urls.map((url) => `  <url><loc>${url}</loc><xhtml:link rel="alternate" hreflang="de" href="${base}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${base}en/"/><xhtml:link rel="alternate" hreflang="x-default" href="${base}"/></url>`).join("\n") +
  "\n</urlset>\n";
await Promise.all([
  writeFile(join(output, "sitemap.xml"), sitemap),
  writeFile(join(output, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`),
  writeFile(join(output, ".nojekyll"), ""),
]);
console.log(`Built German and English Pages for ${release.tag_name}`);
