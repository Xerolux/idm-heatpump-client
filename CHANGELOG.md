# Changelog

## 0.4.1

- Live charts now redraw once per measurement batch. Paused charts keep their view as new samples arrive, and long histories retain their full resolution.
- The upper-right corner shows the current Free, Standard, Pro or Ultra tier. Select it to manage your license, even when no heat pump is connected.
- Activation now guides you through entering an existing 32-character license code and confirming your email with a separate eight-digit code.
- The license portal explains tiers and offline use. The purchase page shows the shop's coming-soon status. The admin console guides trial issuance, plant-slot changes and device transfers.

## 0.4.0

- Introduce Free, Standard, Pro and Ultra. Free includes one real heat pump and a one-time chart demo. Standard adds charts and CSV export, Pro adds watermark-free PDF and printing, and Ultra adds licensed heat-pump slots.
- Activate under Settings with an activation code and email confirmation. A code covers one desktop installation and one major version.
- Renew licenses online daily while the app runs. The current signed entitlement remains valid for up to 72 hours offline, subject to the trial end date.
- Keep existing connection profiles when an Ultra entitlement expires. Free access remains available for the primary plant.

## 0.3.3

- Show the project's MIT license with an acceptance button in the Windows setup wizard.

## 0.3.2

- Show an update dialog at startup with the changelog, Update now and Later.
- Download and verify the package after confirmation, then start the installer or show the package for manual installation.

## 0.3.1

- Bundle the TypeScript port of iDM Heatpump API 2.17.0rc1.
- Reject incomplete model detection results and prevent overlapping EEPROM writes.
- Close interrupted Navigator 10 WebSocket handshakes and reject unknown Navigator 2.0 statistics units.
- Update dependencies, refresh the cross-platform npm lockfile and run CI on Node.js 24 LTS.

## 0.3.0

- Bundles `@xerolux/idm-heatpump` 2.16.1 at **full Python parity**: the
  optional web supplement (status, freshwater, home detail incl. PV demand
  reasons, performance, weather, iON, energy flow, system overview,
  statistics and web writes), the 2005-entry error-code database, per-register
  read diagnostics and the Navigator 1.7 coil commands are now part of the
  shipped library — ready for upcoming views.
- Library baseline: Python `idm-heatpump-api` v2.16.1, tag `v2.16.1`
  (161/161 public symbols mapped complete).

Auf Deutsch: Die integrierte Bibliothek erreicht volle Parität mit der
Python-Referenz 2.16.1 — inklusive Web-Supplement, Störcode-Datenbank,
Lesediagnostik und der Navigator-1.7-Coil-Kommandos.

## 0.2.1

- Switch between light and dark directly from the app's top bar. The saved appearance is applied on startup.
- Xerolux is now credited consistently in About, the project license, the website and package metadata.
- Added a guide for future Windows Authenticode signing. The signed update manifest continues to verify downloads.

Auf Deutsch: Hell und Dunkel lassen sich direkt oben in der App umschalten. Die Copyright- und Herausgeberangaben verwenden jetzt Xerolux.

## 0.2.0

The built-in updater is new in this release. Upgrade from 0.1.0 once by installing the new package manually. Subsequent releases can be checked from the app. Windows x64 and AppImage can start installation from the app. DEB and macOS Apple Silicon use a verified package for manual installation.

Der Updater ist ab dieser Version enthalten. Beim Wechsel von 0.1.0 musst du das neue Paket einmal manuell installieren. Spätere Updates kannst du in der App prüfen.

### Added

- Persistent light and dark themes for the desktop app and live charts.
- Windows uninstaller cleanup for app data and startup registration, with update data retained.
- Optional start at login and tray minimization with continued polling.
- Minimum, maximum and average cards and a timestamped timeline in live analysis.
- Bilingual About page, donation links and a previewable report for private email or public GitHub issues.

- Per-profile live charts with configurable series and time ranges, pause and grouped units.
- German and English A4 reports for live analysis or current readings, including the software version and diagonal Xerolux watermark.
- Searchable offline license catalog with original notices, component versions and Electron runtime credits.

- Signed update checks and verified package downloads for packaged builds. Windows and AppImage can launch installation from the app.
- Connection manager at startup with saved profiles for multiple installations and access to the built-in simulator.
- Direct profile switching and automatic navigation to the dashboard after the first successful poll.
- German and English user guide and updated screenshots.

### Changed

- Redesigned dashboard with metric cards, a simplified hydraulic diagram and a system status panel.
- The dashboard distinguishes unavailable fault readings from a confirmed no-fault reading.

### Fixed

- The build now bundles and loads the application and chart styles.
- Charts now use seconds for their time axis and represent missing samples as gaps.
- The renderer clears readings and session history when switching installations.

## 0.1.0

- Initial desktop release with live Modbus readings, charts and CSV export, register diagnostics, an error-code database and a simulator.
- Windows NSIS, Linux AppImage and DEB, and macOS ARM64 DMG published on [GitHub Releases](https://github.com/Xerolux/idm-heatpump-client/releases/tag/v0.1.0).
