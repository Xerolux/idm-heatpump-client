# Third-party licenses

**Licenses** in the sidebar is available before connecting to a controller. The catalog shows the package name, version, declared license and original notice texts. It distinguishes the application, runtime packages and direct development tools.

## Catalog input and packaging

- The build reads production dependencies from the npm lockfile, including installed optional packages and nested versions. It also checks the esbuild input lists for additional package code in application, preload, renderer and CSS bundles.
- Original license, copyright, notice and author files from the installed packages are included in the catalog when present. The build fails if an applicable package has no license declaration or notice file. Conditional modules in the npm production tree can be listed even when a specific platform does not load or package them.
- Electron's own license and its original `LICENSES.chromium.html` are taken from the installed Electron distribution. The report includes upstream notices for Chromium, Node.js and incorporated components.
- Direct build and test tools are labeled separately. Their full dependency graph remains in [package-lock.json](../package-lock.json).

Build with `npm ci` and `npm run build`. The generated catalog and original Electron report are included in the application bundle under `dist/renderer/licenses/`. The generated `THIRD-PARTY-NOTICES.txt` is a readable copy of the package entries.

The client source is licensed under [MIT](../LICENSE). The licenses and copyrights of each dependency apply to that dependency.
