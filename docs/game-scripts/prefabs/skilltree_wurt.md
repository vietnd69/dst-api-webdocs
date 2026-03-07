---
id: skilltree_wurt
title: Skilltree Wurt
description: Provides skill tree configuration and data for Wurt's character skills in Don't Starve Together.
tags: [skilltree, character, configuration]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0407789d
system_scope: entity
---

# Skilltree Wurt

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_wurt` is a configuration module that defines the layout, behavior, and effects of all skills in Wurt's skill tree. It returns a function (`BuildSkillsData`) that constructs the full skill tree data structure, including positions, groups, activation/deactivation callbacks, and network-dependent lock conditions. This module does not implement any components itself but serves as a data provider for the skill tree UI and gameplay systems.

## Usage example
```lua
local BuildSkillsData = require "prefabs/skilltree_wurt"
local skilltree = BuildSkillsData(SomeSkillTreeFunctions)

-- Access defined skills
for skillname, skilldata in pairs(skilltree.SKILLS) do
    print("Skill:", skillname, "at position:", skilldata.pos)
end

-- Access skill ordering (group titles)
for _, groupdata in ipairs(skilltree.ORDERS) do
    print("Group:", groupdata[1], "at title position:", groupdata[2])
end
```

## Dependencies & tags
**Components used:** None directly; relies on external components (`damagetyperesist`, `damagetypebonus`, `inventory`, `moisture`, `temperature`) being present on the entity at skill activation time.  
**Tags:** Adds/removes tags including `amphibian`, `wetness_sanity`, `wetness_temperature`, `wetness_defense`, `marsh_wetness`, `wetness_healing`, `swampmaser`, `mosquito`, `civ`, `pathfinder`, `merm_king_max_hunger`, `merm_king_hunger_rate`, `merm_flee`, `mermking_quest`, `allegiance`, `lock`, `shadow`, `shadow_favor`, `lunar`, `lunar_favor`, `player_shadow_aligned`, `player_lunar_aligned`, and various `*_spelluser` tags.

## Properties
No public properties. The module defines only local constants and returns a function (`BuildSkillsData`) that yields a table with `SKILLS` and `ORDERS` fields.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete skill tree data for Wurt, including positions, group assignments, tag changes, and activation/deactivation logic. Accepts a table of helper functions (`SkillTreeFns`) used for lock generation.
*   **Parameters:** `SkillTreeFns` (table) - A table containing utility functions such as `CountSkills`, `MakeFuelWeaverLock`, `MakeNoLunarLock`, and `MakeCelestialChampionLock`.
*   **Returns:** A table with two keys:
    *   `SKILLS` (table): Map of skill names to skill configuration objects.
    *   `ORDERS` (table): Ordered list of skill group titles with display positions.

## Events & listeners
None directly. Activation callbacks for specific skills (e.g., `wurt_mosquito_craft_2`) register listeners for `itemget` and `itemlose` events on the entity. These are not part of the module's top-level behavior but are defined per-skill.