---
id: skilltree_wilson
title: Skilltree Wilson
description: Defines Wilson's skill tree data structure, including skill nodes, layout orders, and activation logic for the character progression system.
tags: [skills, data, wilson, configuration]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data
source_hash: e564d5e5
system_scope: player
---

# Skilltree Wilson

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`skilltree_wilson.lua` is a data configuration module that defines the structure and logic for Wilson's character skill tree. It exports a factory function `BuildSkillsData` which generates the skill node definitions, UI layout orders, and callback logic for skill activation. The returned data is consumed by the skill tree UI and progression systems to render the tree and apply gameplay effects (e.g., damage resistances, beard inventory). Unlike prefab files, this module does not spawn entities but provides static configuration data.

## Usage example
```lua
-- Require the module to get the factory function:
local BuildSkillsData = require("prefabs/skilltree_wilson")

-- Call with SkillTreeFns utility table to generate data:
local data = BuildSkillsData(SkillTreeFns)

-- Access skill definitions and layout orders:
local skills = data.SKILLS
local orders = data.ORDERS

-- Example: Check a skill's position:
local pos = skills.wilson_alchemy_1.pos
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- Localization strings for skill titles and descriptions.
- `TUNING` -- Balance constants for damage bonuses and resistances.
- `TheGenericKV` -- Global key-value store used to check world state (e.g., boss kills) for skill unlocks.
- `SkillTreeFns` -- Passed as argument; provides utility functions like `CountTags` and `CountSkills`.

**Components used:**
- `beard` -- Accessed in `wilson_beard_7` onactivate to update beard inventory.
- `damagetyperesist` -- Modified in allegiance skills to add/remove resistances.
- `damagetypebonus` -- Modified in allegiance skills to add/remove damage bonuses.

**Tags:**
- `player_shadow_aligned` -- Added by `wilson_allegiance_shadow` onactivate.
- `player_lunar_aligned` -- Added by `wilson_allegiance_lunar` onactivate.
- `torch`, `alchemy`, `beard`, `allegiance` -- Group tags used for skill categorization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLS` | table | --- | Map of skill IDs (e.g., `wilson_alchemy_1`) to skill definition tables. Contains all node data. |
| `ORDERS` | table | --- | Array defining UI layout groups (`torch`, `alchemy`, `beard`, `allegiance`) and their base coordinates. |
| `title` | string | --- | (Skill Record) Localization key for the skill name. Displayed in UI. |
| `desc` | string | --- | (Skill Record) Localization key for the skill description. |
| `icon` | string | --- | (Skill Record) Asset name for the skill icon image. |
| `pos` | table | --- | (Skill Record) `{x, y}` coordinates for UI placement. Relative to group origin. |
| `group` | string | --- | (Skill Record) Category name matching an entry in `ORDERS` (e.g., `"alchemy"`). |
| `tags` | table | --- | (Skill Record) Array of string tags used for dependency checks (e.g., `{"torch", "torch1"}`). |
| `connects` | table | --- | (Skill Record) Array of skill IDs that this node unlocks. Defines the tree graph edges. |
| `locks` | table | --- | (Skill Record) Array of lock skill IDs that must be unlocked to access this node. |
| `root` | boolean | `false` | (Skill Record) If `true`, this node is a starting point (no prerequisites). |
| `lock_open` | function | `nil` | (Skill Record) Custom unlock condition. Signature: `fn(prefabname, activatedskills, readonly) → boolean|string`. |
| `onactivate` | function | `nil` | (Skill Record) Called when skill is unlocked. Signature: `fn(inst, fromload)`. Applies gameplay effects. |
| `ondeactivate` | function | `nil` | (Skill Record) Called when skill is reset. Signature: `fn(inst, fromload)`. Removes gameplay effects. |
| `defaultfocus` | boolean | `false` | (Skill Record) If `true`, this node is selected by default when the tree opens. |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Factory function that constructs and returns the skill tree data table. Iterates through predefined skill definitions, attaching localization, positioning, and logic callbacks. The `SkillTreeFns` argument provides utility methods for counting tags and skills during lock evaluation.
*   **Parameters:**
    - `SkillTreeFns` -- table containing utility functions (e.g., `CountTags`, `CountSkills`) required for dynamic lock conditions.
*   **Returns:** Table containing `SKILLS` (map of skill data) and `ORDERS` (layout configuration).
*   **Error states:** Errors if `SkillTreeFns` is nil or missing required methods (e.g., `CountTags`), as these are called during table construction.

## Events & listeners
None identified.