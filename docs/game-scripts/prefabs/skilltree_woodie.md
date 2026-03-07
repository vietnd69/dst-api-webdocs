---
id: skilltree_woodie
title: Skilltree Woodie
description: Defines the skill tree structure and activation logic for the Woodie character in Don't Starve Together, including transformations, allegiance paths, and associated gameplay bonuses.
tags: [skilltree, character, combat, transformation, alignment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f41c637
system_scope: entity
---

# Skilltree Woodie

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_woodie.lua` is a skill tree definition module that declares all skill nodes for the Woodie character, grouped into Curse (wereform progression), Human (human-form progression), and Allegiance (shadow/lunar path alignment) categories. It includes position data, activation conditions (e.g., lock gates), and callbacks that modify gameplay via components such as `worker`, `health`, `moisture`, `attackdodger`, `damagetypebonus`, `damagetyperesist`, and `planardefense`. This file does not implement a component itself but serves as a configuration factory used by the broader skill tree system.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_woodie")
local skill_data = BuildSkillsData(SkillTreeFns)

-- Access skill definitions
local beaver_skill = skill_data.SKILLS.woodie_curse_beaver_1
print(beaver_skill.title, beaver_skill.pos[1], beaver_skill.pos[2])

-- The returned table is used by the UI and progression logic to render and evaluate skill nodes.
```

## Dependencies & tags
**Components used:** `worker`, `health`, `moisture`, `attackdodger`, `damagetypebonus`, `damagetyperesist`, `planardefense`  
**Tags:** Adds tags dynamically on skill activation (e.g., `cursemaster`, `woodiequickpicker`, `player_shadow_aligned`, `player_lunar_aligned`) and checks tags via `SkillTreeFns.CountTags` for lock resolution.

## Properties
No public properties — this file is a pure data/config module returning a table with `SKILLS` and `ORDERS` keys. All values are data structures defining skill behavior, positions, and conditions.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete Woodie skill tree definition, including all skill nodes, their positions, tags, lock conditions, and activation/deactivation callbacks. This factory function accepts a reference to `SkillTreeFns` (a utility table for querying tag counts and building locks) to resolve dynamic locking logic.
*   **Parameters:** `SkillTreeFns` (table) — utility module providing helper functions such as `CountTags`, `CountSkills`, `MakeFuelWeaverLock`, `MakeNoLunarLock`, and `MakeCelestialChampionLock`.
*   **Returns:** Table with two keys:  
    - `SKILLS` (table): Map of skill IDs (strings) to skill node configurations (tables). Each node includes `pos` (x, y coordinates), `group` (`"curse"`, `"human"`, or `"allegiance"`), `tags` (list), `root`, `connects`, `lock_open` (optional), `onactivate` (optional), and `ondeactivate` (optional).  
    - `ORDERS` (table): Order specification for skill group rendering (Curse → Human → Allegiance).
*   **Error states:** None — assumes `SkillTreeFns` provides required helper functions.

## Events & listeners
None — this module is data-only and does not register or emit events directly. Event-driven behavior is handled in the activation callbacks via component methods (e.g., `inst.components.health:AddRegenSource(...)`).

