---
id: skilltree_walter
title: Skilltree Walter
description: Builds and returns skill tree data for Walter's skill tree, including skill positions, dependencies, tags, and activation/deactivation logic.
tags: [skilltree, player, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 850f686b
system_scope: player
---

# Skilltree Walter

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_walter` is a factory function (`BuildSkillsData`) that constructs and returns the complete skill tree configuration for Walter, a playable character in DST. It defines skill layout positions, group memberships, activation requirements (including conditional locks based on tags and global keys), and activation/deactivation side effects that modify component state (e.g., tag toggling, resistances, multipliers). It interacts with `skilltreeupdater`, `damagetypebonus`, `damagetyperesist`, and `efficientuser` components to apply or remove gameplay effects when skills are toggled.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_walter")
local skilltreefns = { CountTags = fn, HasTag = fn } -- Implement CountTags/HasTag logic
local tree = BuildSkillsData(skilltreefns)

-- tree.SKILLS contains all skill definitions
-- tree.ORDERS defines title groupings and positions
```

## Dependencies & tags
**Components used:** `damagetypebonus`, `damagetyperesist`, `efficientuser`, `skilltreeupdater`  
**Tags added:** `slingshotammo_crafting`, `shadow`, `lunar`, `shadow_favor`, `lunar_favor`, `woby_basics`, `woby_dash`, `portable_campfire_user`, `fasthealer`, `slingshotammocontaineruser`, `lock`  
**Tags checked:** `shadow_favor`, `lunar_favor`, `woby_dash`, `woby_basics`, `camping`, `slingshotammo_crafting`

## Properties
No public properties. This file exports a factory function returning a table with `SKILLS` and `ORDERS` keys.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Generates the complete skill tree configuration for Walter. Returns a table with `SKILLS` (all defined skills) and `ORDERS` (title groupings). Handles position assignment, tag defaulting, localization, and activation lock logic.
*   **Parameters:**  
    - `SkillTreeFns` (table) — A table containing two functions: `CountTags(prefabname, tag, activatedskills)` and `HasTag(prefabname, tag, activatedskills)`. These are used for evaluating skill lock conditions without requiring the actual component.
*   **Returns:**  
    - (table) — `{ SKILLS = { [string] = skilldef, ... }, ORDERS = { { group, {x, y} }, ... } }`
*   **Error states:** None. Returns a consistent table structure regardless of input (though lock evaluations may fail if functions in `SkillTreeFns` are missing).

## Events & listeners
None identified. This file defines static configuration data and does not register or fire events directly.