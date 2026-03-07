---
id: skilltree_winona
title: Skilltree Winona
description: Defines the structure, layout, and metadata for Winona's skill tree, including skill nodes, groupings, positioning, unlock conditions, and visual decorations.
tags: [skilltree, ui, winona, game_system]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: de9a97e8
system_scope: ui
---

# Skilltree Winona

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`skilltree_winona.lua` is a Lua module that generates the complete skill tree data for the character Winona. It defines all skill nodes, their visual placement across shelves (low, mid, shadow, lunar), grouping logic, dependencies (connects, locks), and UI decoration behaviors. The module exposes a single function, `BuildSkillsData(SkillTreeFns)`, which returns a table containing `SKILLS`, `ORDERS`, and `BACKGROUND_SETTINGS`. It is not a component in the ECS sense but rather a static data provider used by the skill tree UI system.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_winona")
local SkillTreeFns = require("util/skilltree_functions")

local winonaSkillTree = BuildSkillsData(SkillTreeFns)
-- winonaSkillTree.SKILLS: table of skill node definitions
-- winonaSkillTree.ORDERS: ordered list of shelves
-- winonaSkillTree.BACKGROUND_SETTINGS: background rendering options
```

## Dependencies & tags
**Components used:** `grue` (via `inst.components.grue:AddImmunity` and `RemoveImmunity`) — for specific skill activation/deactivation effects.
**Tags:** Uses tags internally for grouping (`lowshelf`, `midshelf`, `charlie`, `wagstaff`, `lock`) and logic evaluation (e.g., `portableengineer`, `inspectacleshatuser`); does *not* add/remove tags on the entity directly outside of `onactivate`/`ondeactivate` handlers.

## Properties
No public properties are initialized or stored in this module. It is a functional data provider; all configuration is embedded in the returned `SKILLS`, `ORDERS`, and `BACKGROUND_SETTINGS` tables.

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the full skill tree configuration for Winona. It is called by the UI skill tree system to populate node definitions, positions, and inter-node relationships.
*   **Parameters:**  
    `SkillTreeFns` (table) — A module containing helper functions such as `CountTags`, used to evaluate lock conditions and group counts dynamically.
*   **Returns:**  
    Table with three keys:
    - `SKILLS`: Dictionary mapping skill IDs (e.g., `"winona_portable_structures"`) to node definitions (includes `title`, `desc`, `icon`, `pos`, `group`, `tags`, `lock_open`, `onactivate`, `ondeactivate`, `connects`, `locks`, `button_decorations`, etc.).
    - `ORDERS`: Array of shelf configurations specifying rendering order and origin positions (e.g., `{"wagstaff", {x, y}}`).
    - `BACKGROUND_SETTINGS`: Table with `tint_bright` and `tint_dim` booleans (both `false` here).

## Events & listeners
Not applicable — this file contains no runtime logic or event listeners. It is purely a static data definition module.