---
id: skilltree_wendy
title: Skilltree Wendy
description: Generates the structured skill data for Wendy's skill tree, including positions, tags, activation logic, and relationships between skills.
tags: [skilltree, configuration, wendy,lua]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39ed9295
system_scope: entity
---

# Skilltree Wendy

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file is a Lua generator function (`BuildSkillsData`) that constructs and returns the full data model for Wendy’s skill tree. It defines each skill’s position, associated tags, root status, connected nodes, and activation/deactivation behaviors. It interacts with several components (e.g., `sanityauraadjuster`, `ghostlybond`, `damagetyperesist`, `damagetypebonus`, `planardefense`, `sisturnregistry`) and uses tags to apply gameplay effects dynamically when skills are unlocked. This is not a runtime component itself, but a configuration helper used to populate the skill tree UI and backend logic.

## Usage example
```lua
local BuildSkillsData = require "prefabs/skilltree_wendy"
local skill_tree_data = BuildSkillsData(MySkillTreeFns)

-- Access skills
local skill = skill_tree_data.SKILLS.wendy_sisturn_1

-- Check global constants used internally
print("Root node:", skill.root) -- true
print("Tags:", table.concat(skill.tags, ", ")) -- "sisturn,sisturn_upgrades"
```

## Dependencies & tags
**Components used:** `sanityauraadjuster`, `ghostlybond`, `damagetyperesist`, `damagetypebonus`, `planardefense`, `sisturnregistry` (via `TheWorld.components.sisturnregistry`).  
**Tags added/removed:** `sisturn`, `player_damagescale`, `elixircontaineruser`, `player_shadow_aligned`, `shadow_aligned`, `player_lunar_aligned`, `lunar_aligned`, `UPGRADETYPES.GRAVESTONE.."_upgradeuser"`, `gravedigger_user`.  
Note: Tags are applied and removed via `onactivate`/`ondeactivate` callbacks in specific skill definitions.

## Properties
No public properties. The file exports a single function: `BuildSkillsData`.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete skill tree data for Wendy. Accepts a table of helper functions (`SkillTreeFns`) to define locked skill nodes. Internally groups skills by category (e.g., `sisturn`, `potion`, `allegiance`) and registers activation/deactivation callbacks that mutate the world and entity state via component calls.
*   **Parameters:** `SkillTreeFns` (table) — expects methods like `MakeFuelWeaverLock` and `MakeNoLunarLock` to generate locked skill nodes.
*   **Returns:** table with two keys:
    *   `SKILLS` (table): Map of skill names → skill data objects.
    *   `ORDERS` (table): Optional layout ordering hints (currently commented out).
    *   `PUCK` (boolean): Always `true` in this implementation.
*   **Error states:** None documented. Failures would likely manifest as missing skill nodes or runtime errors if `SkillTreeFns` is malformed.

## Events & listeners
Not applicable — this file is a data generator, not a runtime component. It does not listen to or push game events. Event handling occurs inside `onactivate`/`ondeactivate` callbacks embedded in the returned skill data, which are invoked by the skill tree system at runtime.