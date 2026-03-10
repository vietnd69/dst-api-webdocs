---
id: scrapbook_prefabs
title: Scrapbook Prefabs
description: Defines a static list of prefabs to include or exclude from the scrapbook and achievement visibility filtering.
tags: [scrapbook, achievement, filtering, data]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 46ff46c7
system_scope: world
---

# Scrapbook Prefabs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`scrapbook_prefabs.lua` defines a global `PREFABS` table that acts as a whitelist or blacklist for prefabs included or excluded from scrapbook entry visibility and achievement tracking. The file contains no runtime logic, component behaviors, or event listeners — it is a pure data configuration file composed of a large, theme-grouped table literal where keys are prefab names and values are booleans (`true` for inclusion, `false` or commented for exclusion). Prefabs marked as `--` (commented) are explicitly excluded due to incomplete implementation, irrelevance, or being proxies/POI items that should not appear in the scrapbook.

## Usage example
```lua
-- In other files, the table is imported to filter scrapbook entries
local ScrapbookPrefabs = require "scrapbook_prefabs"

if ScrapbookPrefabs["beefalo"] then
    -- include beefalo in scrapbook
end

if ScrapbookPrefabs["rock_moon_shell"] == nil then
    -- rock_moon_shell is commented out — intentionally excluded
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PREFABS` | `table<string, boolean>` | `{}` (populated at load time) | A lookup table mapping prefab names (strings) to inclusion flags (`true` = include, `false` or missing = exclude). Organized by thematic groups (e.g., Cotl, Rifts, Hallowed Nights). |

## Main functions
None found — this file contains no functions. It is a pure data module exposing only the `PREFABS` table.

## Events & listeners
None found — no event registration or dispatch occurs in this module.