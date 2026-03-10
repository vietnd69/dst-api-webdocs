---
id: clothing
title: Clothing
description: A static data registry defining clothing items, their visual overrides, hide layers, and associated sounds/symbols used by the game's rendering and UI systems.
tags: [clothing, data, assets, rendering, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 2c1775d6
system_scope: entity
---

# Clothing

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `clothing.lua` file defines a global `CLOTHING` table that serves as a static registry of clothing item definitions. Each entry specifies metadata such as skins, tags, symbol overrides, and hide layer configurations. Additional global tables — `CLOTHING_SFX`, `CLOTHING_SYMBOLS`, and `HIDE_SYMBOLS` — are derived from `CLOTHING` and used for audio playback, symbol rendering, and visibility control of base layers (e.g., to hide undergarments when certain clothing is equipped). This file is not an ECS component; it contains no logic, no components, no constructors, and no runtime behavior — it is purely a data schema for clothing assets.

## Usage example
```lua
-- Example of accessing clothing metadata
if CLOTHING["MY_CLOTHING_PREFAB"] then
    local clothing_def = CLOTHING["MY_CLOTHING_PREFAB"]
    local skins = clothing_def.skins
    local tags = clothing_def.skin_tags
    print(string.format("Clothing %s has %d skins", "MY_CLOTHING_PREFAB", #skins))
end

-- Example of checking if a prefab has symbol overrides
if CLOTHING_SYMBOLS["SOME_CLOTHING"] then
    print("Symbol overrides defined for SOME_CLOTHING")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:**  
- `"CLOTHING_BODY"`  
- `"CLOTHING"`  
- `"BLACK"`  
*(Tags appear as string literals within `skin_tags` arrays in `CLOTHING` records. They are not dynamically applied or queried at runtime in this file.)*

## Properties
The `CLOTHING` table contains keys (prefab names) mapping to records with the following fields:
| Field | Type | Description |
|-------|------|-------------|
| `skins` | table of strings | List of skin asset paths or identifiers |
| `skin_tags` | table of strings | Tags associated with the clothing (e.g., `"CLOTHING"`, `"BLACK"`) |
| `symbol_overrides` | table (optional) | Defines which symbols are replaced when this clothing is equipped |
| `symbol_hides` | table (optional) | Defines symbols to hide on the base layer |
| `symbol_in_base_hides` | table (optional) | Defines base-layer symbols hidden when *this* item is equipped |

`CLOTHING_SFX`, `CLOTHING_SYMBOLS`, and `HIDE_SYMBOLS` are derived tables (see Overview), but no *user-defined* properties are exposed beyond the `CLOTHING` registry.

## Main functions
None — this file contains no functions. All logic is limited to data initialization via table constructors and simple loops for derived data population.

## Events & listeners
None — no events are registered or pushed in this file.