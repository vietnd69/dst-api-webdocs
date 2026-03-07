---
id: skilltree_defs
title: Skilltree Defs
description: Provides the data structure and validation logic for character-specific skill trees, including connection rules, locks, and helper utilities for modders.
tags: [skill-tree, validation, network, utility]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1b6fa435
system_scope: entity
---

# Skilltree Defs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_defs.lua` defines the global skill tree data structures and validation logic used by the game's character skill system. It centralizes skill tree definitions, performs strict validation on connectivity and locking rules (e.g., `root`, `connects`, `locks`), enforces network constraints (e.g., max 32 skills), and exposes helper functions for modders to define custom locks and query skill-tree state. The module is loaded at startup, aggregates per-character data from `prefabs/skilltree_<character>` files, and makes them available via the exported `SKILLTREE_DEFS` and `SKILLTREE_METAINFO` tables.

## Usage example
```lua
-- Example: Accessing skill data for a character
local skills = require("prefabs/skilltree_defs").SKILLTREE_DEFS.wilson
if skills then
    for name, skill in pairs(skills) do
        print("Skill:", name, "Tags:", table.tostring(skill.tags or {}))
    end
end

-- Example: Using a built-in lock factory
local FN = require("prefabs/skilltree_defs").FN
local allegiance_lock = FN.MakeFuelWeaverLock({ pos = {0, 0}, connects = {"next_skill"} }, false)
```

## Dependencies & tags
**Components used:** None  
**Tags:** No tags are added or removed directly — the module only *reads* tag data from skill definitions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLTREE_DEFS` | table | `{}` | Global lookup table: `character_prefab_name` → `skill_definitions_table`. |
| `SKILLTREE_METAINFO` | table | `{}` | Metadata per character, including `RPC_LOOKUP`, `TOTAL_SKILLS_COUNT`, `TOTAL_LOCKS`, and `BACKGROUND_SETTINGS`. |
| `SKILLTREE_ORDERS` | table | `{}` | Ordered lists of skill names per character (used for UI rendering). |
| `CUSTOM_FUNCTIONS` | table | `{}` | Per-character custom function tables defined by modders. |
| `FN` | table | `{}` | Collection of utility functions exported for modder use (see "Main functions"). |

## Main functions
### `CreateSkillTreeFor(characterprefab, skills)`
*   **Description:** Validates and registers a skill tree definition for a given character. Performs structural validation (e.g., missing `root`, duplicate `defaultfocus`, invalid `connects`/`locks`, floating skills) and records network metadata (e.g., RPC IDs). Logs warnings via `PrintFixMe` for issues.
*   **Parameters:**
    *   `characterprefab` (string) — The prefab name (e.g., `"wilson"`) for which the skill tree is defined.
    *   `skills` (table) — A map of `skill_name` → `skill_definition`. Each skill definition may include keys like `tags`, `root`, `connects`, `locks`, `lock_open`, `defaultfocus`, `infographic`.
*   **Returns:** Nothing.
*   **Error states:** 
    *   Exceeding 32 non-infographic skills logs a warning and prevents networking for extra skills.
    *   Missing `defaultfocus`, invalid `connects`/`locks`, or `infographic` misused with `connects`/`locks`/non-`root` triggers warnings.

### `CountSkills(prefab, activatedskills)`
*   **Description:** Returns the total number of skills in `activatedskills` for the given character `prefab`.
*   **Parameters:**
    *   `prefab` (string) — Character prefab name.
    *   `activatedskills` (table or `nil`) — A set-like table of activated skill names. If `nil`, returns `0`.
*   **Returns:** `number` — Count of activated skills.

### `HasTag(prefab, targettag, activatedskills)`
*   **Description:** Checks whether *any* activated skill for `prefab` contains `targettag` in its `tags` list.
*   **Parameters:**
    *   `prefab` (string) — Character prefab name.
    *   `targettag` (string) — Tag to search for.
    *   `activatedskills` (table or `nil`) — Set-like table of activated skill names.
*   **Returns:** `boolean` — `true` if at least one activated skill has the tag, else `false`.

### `CountTags(prefab, targettag, activatedskills)`
*   **Description:** Counts how many times `targettag` appears across all activated skills for `prefab`.
*   **Parameters:**
    *   `prefab` (string) — Character prefab name.
    *   `targettag` (string) — Tag to count.
    *   `activatedskills` (table or `nil`) — Set-like table of activated skill names.
*   **Returns:** `number` — Total count of occurrences.

### `SkillHasTags(skill, tag, prefabname)`
*   **Description:** Checks if a *single* skill (by name) in the skill tree for `prefabname` contains `tag` in its `tags` list.
*   **Parameters:**
    *   `skill` (string) — Skill name to inspect.
    *   `tag` (string) — Tag to search for.
    *   `prefabname` (string) — Character prefab name.
*   **Returns:** `boolean?` — `true` if the skill exists and contains the tag; `nil` if the skill or prefab data is missing.

### `MakeFuelWeaverLock(extra_data, not_root)`
*   **Description:** Constructs a lock function that opens only when `"fuelweaver_killed" == "1"` in `TheGenericKV`.
*   **Parameters:**
    *   `extra_data` (table or `nil`) — Optional `pos`, `connects`, `group`.
    *   `not_root` (boolean) — If `false`, sets `root = true`; else, `root = false`.
*   **Returns:** `table` — Lock definition table with `lock_open` and other properties.

### `MakeNoShadowLock(extra_data, not_root)`
*   **Description:** Constructs a lock that opens only if the character has *zero* skills tagged `"shadow_favor"`. Returns `true` to unlock or `nil` (equiv. to "unknown") if not yet determinable.
*   **Parameters:** Same as `MakeFuelWeaverLock`.
*   **Returns:** `table` — Lock definition.

### `MakeCelestialChampionLock(extra_data, not_root)`
*   **Description:** Constructs a lock that opens only when `"celestialchampion_killed" == "1"` in `TheGenericKV`.
*   **Parameters:** Same as `MakeFuelWeaverLock`.
*   **Returns:** `table` — Lock definition.

### `MakeNoLunarLock(extra_data, not_root)`
*   **Description:** Constructs a lock that opens only if the character has *zero* skills tagged `"lunar_favor"`.
*   **Parameters:** Same as `MakeFuelWeaverLock`.
*   **Returns:** `table` — Lock definition.

### `MakePurelyVisualLock(skills, locknametoreplicate, locknamesuffix)`
*   **Description:** Duplicates an existing lock skill as a purely visual placeholder (e.g., for layout alignment), setting it as `root = true` and removing its connections.
*   **Parameters:**
    *   `skills` (table) — The `skills` table to modify (passed by reference).
    *   `locknametoreplicate` (string) — Name of the lock to duplicate.
    *   `locknamesuffix` (string) — Suffix appended to create the new name.
*   **Returns:** `table` — The newly created lock definition.

### `DEBUG_REBUILD()`
*   **Description:** Forces re-loading of all per-character skill tree data (clears `package.loaded` entries and calls `BuildAllData`), then pushes `debug_rebuild_skilltreedata` global event. Useful for mod development hot-reloading.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** `debug_rebuild_skilltreedata` — Pushed once by `DEBUG_REBUILD()` to notify systems of updated skill tree data.
