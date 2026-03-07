---
id: skilltree_willow
title: Skilltree Willow
description: Defines the complete skill tree data structure for the Willow character, including skill definitions, positions, dependencies, activation effects, and alignment mechanics.
tags: [skilltree, character, combat, player]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 807aa811
system_scope: player
---

# Skilltree Willow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_willow.lua` is a data-defining module that constructs the Willow character's skill tree via the `BuildSkillsData` function. It does not implement a component or instantiate an entity directly; instead, it returns a structured table (`SKILLS` and `ORDERS`) consumed by the skill tree system. Each skill includes metadata (title, description, icon), position, groupings, activation tags (`onactivate`), conditional locking logic (`lock_open`), and connection relationships (`connects`, `locks`). Activation effects modify the player's tags and interact with `damagetyperesist` and `damagetypebonus` components to apply resistances and bonuses for shadow or lunar alignment.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_willow")
local skilltree_data = BuildSkillsData(SkillTreeFns)

-- Access the defined skills
local skill_list = skilltree_data.SKILLS
local ordered_groups = skilltree_data.ORDERS

-- Example: get a specific skill definition
local controlled_burn_1 = skill_list.willow_controlled_burn_1
```

## Dependencies & tags
**Components used:** `damagetyperesist`, `damagetypebonus`, `skilltreeupdater`  
**Tags added on activation:** `controlled_burner`, `ember_master`, `player_shadow_aligned`, `player_lunar_aligned`, `lock`, `lighter`, `bernie`, `bernie4`, `bernie8`, `allegiance`, `shadow_favor`, `lunar_favor`

## Properties
No public properties; this module exports only a single function (`BuildSkillsData`) which returns a static table.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete Willow skill tree data, including all skill definitions, group ordering, and positioning. `SkillTreeFns` is a module containing helper functions such as `CountTags` used in `lock_open` checks.
*   **Parameters:** `SkillTreeFns` (table) – Module providing utility functions, notably `SkillTreeFns.CountTags(prefabname, tag, activatedskills)`.
*   **Returns:** Table with two keys:
    *   `SKILLS`: Dictionary mapping skill IDs (e.g., `"willow_controlled_burn_1"`) to skill definitions.
    *   `ORDERS`: Array of `{"group_name", {x, y}}` pairs defining rendering order/position for skill groups.
*   **Error states:** Returns `nil` values for missing skill definitions; no runtime validation beyond Lua syntax.

## Events & listeners
None — this file defines static data only; no events are listened to or pushed.