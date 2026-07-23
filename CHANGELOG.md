## [1.0.3](https://github.com/wyre-technology/node-huntress/compare/v1.0.2...v1.0.3) (2026-07-23)


### Bug Fixes

* **ci:** drop Node 18.x from the test matrix (EOL, vitest 4 requires 20.12+) ([#27](https://github.com/wyre-technology/node-huntress/issues/27)) ([898fcdd](https://github.com/wyre-technology/node-huntress/commit/898fcddd8c5c31525e4f7dce0e23b7ca180f701b))
* **deps:** re-pin typescript to ^6.0.3 + ignoreDeprecations for TS7 DTS build breakage ([#26](https://github.com/wyre-technology/node-huntress/issues/26)) ([f07ef27](https://github.com/wyre-technology/node-huntress/commit/f07ef2734a54a3d2bb315e18d214e1e5bf483101)), closes [blackpoint-mcp#44](https://github.com/blackpoint-mcp/issues/44)

## [1.0.2](https://github.com/wyre-technology/node-huntress/compare/v1.0.1...v1.0.2) (2026-05-20)


### Bug Fixes

* packaging hygiene, audit fixes, and 429 backoff ([#2](https://github.com/wyre-technology/node-huntress/issues/2)) ([76c783c](https://github.com/wyre-technology/node-huntress/commit/76c783c93b2ed1640b0dcfd1b95679d31be9291c))

## [Unreleased]

### Fixed

- Stop tracking `node_modules/` and `dist/` in git; both are now ignored as intended.
- `ValidationError` for 400 responses now extracts structured field errors from the response body.
- Resolve transitive `npm audit` vulnerabilities via `npm audit fix` (16 down to 6; remaining 6 are dev-only and require breaking upgrades).
- Retry backoff no longer stacks two sleeps on a 429 response — only the `retry-after` delay applies for that iteration.

## [1.0.1](https://github.com/wyre-technology/node-huntress/compare/v1.0.0...v1.0.1) (2026-04-06)


### Bug Fixes

* add .npmrc and files field for GitHub Packages publishing ([36f1a02](https://github.com/wyre-technology/node-huntress/commit/36f1a02ded0da5eb449617e63007b5190c422a91))

# 1.0.0 (2026-02-26)


### Bug Fixes

* use Node 22 for semantic-release in CI ([144b623](https://github.com/wyre-technology/node-huntress/commit/144b62379dc45cbf732f63d7010a54a137b2c6a3))


### Features

* initial Huntress API client library ([60013f2](https://github.com/wyre-technology/node-huntress/commit/60013f2202742b97aeb059492c35f785554c7c63))
