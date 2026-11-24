# Signed desktop updates

Packaged builds check the latest stable GitHub release at startup. When an update is available, a dialog shows the changelog and offers Update now or Later. The title bar reopens the dialog and offers a manual check. Windows x64 opens the verified NSIS installer. Linux x64 AppImage replaces the running AppImage and restarts if its directory is writable. Linux DEB and macOS Apple Silicon reveal the verified package for manual installation. Local source runs and the browser demo do not use the updater.

The release workflow builds all four installers. A separate publish job creates an Ed25519-signed manifest containing the version, release notes, exact asset names, byte counts and SHA-256 hashes. It publishes the manifest with the installers. The app embeds the public key and verifies the signature before trusting the metadata. It checks the package again before opening or installing it.

## Release setup

1. Store the matching Ed25519 PKCS#8 PEM in the GitHub Actions repository secret named `IDM_CLIENT_UPDATE_PRIVATE_KEY`. Keep an offline backup. The [public key](../src/main/services/update-public-key.json) ships with the app.
2. Synchronize the version in `package.json` and `package-lock.json`. Push a stable `vMAJOR.MINOR.PATCH` tag that matches the package version.
3. Check that the release contains `update-manifest.json`, the Windows EXE, Linux AppImage and DEB, and the macOS DMG.
4. Install an updater-enabled package with a lower version. Check for updates, download the package, and confirm the installed version after updating.

The older `v0.1.0` installers predate the updater. Install the first updater-enabled release manually.

For Windows publisher signatures and installer signing, see [Authenticode signing](WINDOWS-SIGNING.md).
