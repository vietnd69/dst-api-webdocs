---
id: modcompatability
title: Modcompatability
description: Provides a utility function to upgrade legacy mod level data from version 1 to version 2 format for compatibility with newer DST engine expectations.
tags: [modding, compatibility, worldgen, migration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a5f1ac2a
system_scope: world
---

# Modcompatability

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`modcompatability.lua` exposes a single utility function, `UpgradeModLevelFromV1toV2`, that transforms older (v1) mod level definitions into the required v2 structure used by the DST world generation system. It processes fields like `overrides` (converting array-style key-value pairs to a map), validates presence of `location`, and removes obsolete fields like `set_pieces`. The function is intended for internal use during mod loading to ensure backward-compatible level data works with current engine expectations.

## Usage example
```lua
local modcompatability = require("modcompatability")
local level_v1 = {
    id = "custom_level",
    overrides = { {"forest_tree", "palm_tree"}, {"rock", "obsidian"} },
    set_pieces = { "some_piece" },
    -- missing location field
}
local level_v2 = modcompatability.UpgradeModLevelFromV1toV2("my_mod", level_v1)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties  

## Main functions
### `UpgradeModLevelFromV1toV2(mod, level)`
*   **Description:** Converts a level definition from v1 format to v2 format by normalizing `overrides`, warning about outdated usage patterns, and ensuring required fields like `location` are present.
*   **Parameters:**
    *   `mod` (string) - The name of the mod providing the level; used for diagnostic messages.
    *   `level` (table) - The level definition table in v1 format.
*   **Returns:** (table) A new table containing the upgraded v2-level data.
*   **Error states:**
    *   Overridden fields use `moderror()` to warn about deprecated usage (non-fatal errors printed to console).
    *   If `level.location` is absent, a default of `"forest"` is assigned and a warning is emitted via `moderror()`.
    *   `required_prefabs` migration code is commented out and not active.

## Events & listeners
None identified