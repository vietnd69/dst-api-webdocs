---
id: versioning
title: DST API Versioning System
sidebar_position: 2
---

# DST API Versioning System

## Overview

The Don't Starve Together API documentation uses two main versioning systems:

1. **Build Number Versioning** - Used by the game itself (e.g., 619045)
2. **API Version** - Used for the DST API (e.g., 0.5.2)

## Build Number Versioning (Game Updates)

The number **619045** and similar numbers (e.g., 587581, 580433) represent the build number or revision of the game itself. These are sequential identifiers assigned to each update of the game, regardless of the size or importance of the changes.

### How to Read Build Numbers

- Each Don't Starve Together update has a unique build number
- Higher numbers indicate newer updates
- Build numbers appear in:
  - Game update announcements
  - Patch notes on the Klei Forums
  - Steam update information

### Example

Update **619045** (released on July 5, 2024) contained:
- Added new animation effects for Vine Bridges about to break
- Added minimap indicators for Winona's wormhole path choosing
- Crab King update with rebalanced gem thresholds
- Various bug fixes

## DST API Version

The DST API itself uses semantic versioning (e.g., 0.5.2) which follows the pattern of MAJOR.MINOR.PATCH:

- **MAJOR**: Significant changes that may break backward compatibility
- **MINOR**: New features that maintain backward compatibility
- **PATCH**: Bug fixes and minor improvements

The current DST API version is stored in the `version.txt` file in the dst-api directory.

## Compatibility Between Versions

When documenting API features, it's important to note:

1. The API version where a feature was introduced
2. The game build number for context (if relevant)
3. Any deprecated features and when they will be removed

This ensures mod developers can maintain compatibility across game updates.

## Documentation Version Tagging

All documentation pages should include:

1. The API version they apply to (in the frontmatter metadata)
2. The date of the last update
3. Notes about any deprecated features

## Version History

For a complete list of game updates, see:
- [Klei Forums Game Updates](https://forums.kleientertainment.com/game-updates/dst/)
- [Don't Starve Wiki Version History](https://dontstarve.fandom.com/wiki/Don%27t_Starve_Together/Version_History)

For API version history, see the API changelog in the documentation. 