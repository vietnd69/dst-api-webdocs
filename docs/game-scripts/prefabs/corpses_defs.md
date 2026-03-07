---
id: corpses_defs
title: Corpses Defs
description: Defines configuration templates for corpse prefabs, specifying visual, physical, and gameplay properties for creature deaths including burn behavior, sanity effects, and mutation mappings.
tags: [entity, corpse, death, mutation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91f5e05b
system_scope: entity
---

# Corpses Defs

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`corpses_defs.lua` defines the `CORPSE_DEFS` array and supporting data structures that specify how creature corpses behave in the game. Each entry serves as a blueprint for spawning a corpse entity when a specific creature dies. The definitions include animation bank/build mappings, stategraph references, burnable properties (via `makeburnablefn`), physics configurations, sanity aura values, and mutation support for lunar/Incursive Gestalt changes. This file does not define a component but instead exports configuration tables used by corpse prefabs.

## Usage example
```lua
-- Example: Retrieve and inspect the deer corpse definition
local corpses_defs = require("prefabs/corpses_defs")
local deer_data = corpses_defs.GetCorpseData("deer")
-- deer_data is a table containing build, bank, faces, sanityaura, etc.

-- Example: Add corpse loot override (e.g., from a mod)
corpses_defs.CORPSE_LOOT_OVERRIDES["bearger_fur"] = { "furtuft", 25 }
```

## Dependencies & tags
**Components used:** None — this file exports configuration data only. However, corpse prefabs created using these definitions commonly use components such as `inspectable`, `named`, `playeravatardata`, `skinner`, and `entitytracker` (via `GetEntity`).
**Tags:** None — tag lists are embedded within individual `CORPSE_DEFS` entries.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CORPSE_DEFS` | array of tables | — | Primary configuration array; each table describes a corpse definition. |
| `CORPSE_PROP_DEFS` | array of tables | — | Separate array for “prop” corpse variants (non-persistent). |
| `CORPSE_LOOT_OVERRIDES` | table | `{}` | Maps original loot names to override definitions (e.g., `{ newprefab, count }` or function). |
| `BUILDS` | table | `{}` | Deprecated empty table. |
| `BANKS` | table | `{}` | Deprecated empty table. |
| `BUILDS_TO_NAMES` | table | (see source) | Maps creature categories to build names (e.g., `"bird"` → `{"crow_build" = "crow"}`). |
| `FACES` | table | `{ FOUR = 1, SIX = 2, TWO = 3, EIGHT = 4 }` | Named constants for face orientation (used in animation). |

## Main functions
### `GetCorpseData(creaturename)`
* **Description:** Searches `CORPSE_DEFS` and returns the first entry whose `creature` field matches `creaturename`.
* **Parameters:** `creaturename` (string) — the prefab name of the creature (e.g., `"deer"`, `"player"`).
* **Returns:** Table — corpse definition data if found, otherwise `nil`.
* **Error states:** Returns `nil` if no matching definition exists.

### `GetCorpsePropData(creaturename)`
* **Description:** Searches `CORPSE_PROP_DEFS` and returns the first entry whose `creature` field matches `creaturename`.
* **Parameters:** `creaturename` (string) — the prefab name of the creature.
* **Returns:** Table — prop corpse definition data if found, otherwise `nil`.
* **Error states:** Returns `nil` if no matching definition exists.

## Events & listeners
None identified. This file defines configuration data and utility functions; event handling occurs in prefabs that consume these definitions.

