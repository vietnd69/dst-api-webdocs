---
id: skilltree_wathgrithr
title: Skilltree Wathgrithr
description: Defines the complete skill tree configuration for the Wathgrithr character, including node positions, skill dependencies, activation effects, and unlocking conditions.
tags: [skilltree, character, combat, ui]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a465a23f
system_scope: ui
---

# Skilltree Wathgrithr

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_wathgrithr.lua` is a configuration script that builds the skill tree structure for the Wathgrithr character. It defines all skill nodes with their positions, dependencies, tags, and activation/deactivation behaviors. The script is consumed by the skill tree UI system and uses helper functions to compute unlock conditions and apply gameplay effects via the Entity Component System (ECS). It does not define a component itself, but rather a data-generating function `BuildSkillsData`.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_wathgrithr")
local skilltree = BuildSkillsData(SkillTreeFns)
-- skilltree.SKILLS contains all node definitions
-- skilltree.ORDERS defines the ordering/titles of skill groups
```

## Dependencies & tags
**Components used:** `planardefense`, `damagetyperesist`, `damagetypebonus`, `rider`  
**Tags:** `spear`, `inspirationgain`, `helmet`, `helmetcondition`, `shield`, `beefalodomestication`, `beefalobucktime`, `beefaloinspiration`, `saddle`, `shadow`, `lunar`, `shadow_favor`, `lunar_favor`, `wathgrithrshielduser`, `battlesongcontaineruser`, `lock`, and derived upgrade tags like `lightningspear_upgradeuser`. Also uses tags `player_shadow_aligned` and `player_lunar_aligned` during activation.

## Properties
No public properties. This script exports a single function `BuildSkillsData` that returns a table with `SKILLS` and `ORDERS` keys.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Generates and returns the complete skill tree configuration for Wathgrithr. It constructs the `SKILLS` map and `ORDERS` list used by the UI to render nodes, connections, and group titles. Each skill node is configured with position, tags, dependencies, and activation callbacks.
*   **Parameters:** `SkillTreeFns` (table) – A table of skill tree utility functions (e.g., `CountSkills`, `MakeFuelWeaverLock`, `MakeNoLunarLock`, `MakeCelestialChampionLock`, `MakeNoShadowLock`).
*   **Returns:** Table with two keys:
    *   `SKILLS` (table): A map from node name (string) to skill definition (table). Each skill definition includes: `group`, `tags`, `root`, `connects`, `pos`, `title`, `desc`, `icon`, optional `lock_open`, and `onactivate`/`ondeactivate` callbacks.
    *   `ORDERS` (array): Ordered list of skill group titles with their positions and group names (e.g., `{"songs", {SONGS_TITLE_X, TITLE_Y}}`).
*   **Error states:** None; assumes `SkillTreeFns` provides required lock-making functions.

## Events & listeners
Not applicable. This is a data definition script with no event listeners or event firing logic.