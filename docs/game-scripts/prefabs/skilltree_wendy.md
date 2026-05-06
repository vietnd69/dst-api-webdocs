---
id: skilltree_wendy
title: Skilltree Wendy
description: Defines the data structure and logic for Wendy's skill tree, including skill nodes, groups, and activation effects.
tags: [skills, wendy, data, ui]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 37953fe4
system_scope: ui
---

# Skilltree Wendy

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`skilltree_wendy` is a data configuration module that returns a builder function for generating Wendy's skill tree data. It defines skill groups such as Sisturn, Potion, Allegiance, and Ghost upgrades, mapping their positions, connections, and activation logic. This module is typically required by the skill tree UI system to construct the interactive graph for the character Wendy.

## Usage example
```lua
local BuildSkillsData = require("prefabs/skilltree_wendy")

-- Generate the skill tree data table
local skilltree_data = BuildSkillsData(SkillTreeFns)

-- Access specific skill definitions
local sisturn_skill = skilltree_data.SKILLS["wendy_sisturn_1"]
print(sisturn_skill.pos) -- Prints position coordinates

-- Check global flags
print(skilltree_data.PUCK) -- Returns true
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- Accesses `STRINGS.SKILLTREE.WENDY` for localization titles and descriptions.
- `TUNING` -- References `TUNING.SKILLS.WENDY` for balance values (resistances, bonuses).
- `UPGRADETYPES` -- Used for tagging gravestone upgrade users.
- `TheWorld` -- Accesses `TheWorld.components.sisturnregistry` to check blossom state.

**Components used:**
- `sanityauraadjuster` -- Starts/stops sanity aura tasks on skill activation.
- `ghostlybond` -- Accesses linked ghost entity for tag and defense modifications.
- `damagetyperesist` -- Adds/removes damage resistances based on allegiance.
- `damagetypebonus` -- Adds/removes damage bonuses based on allegiance.
- `planardefense` -- Sets base defense on the ghost entity.
- `sisturnregistry` -- World component checked for blossom status.

**Tags:**
- `player_damagescale` -- Added/Removed on ghost during Sisturn upgrades.
- `elixircontaineruser` -- Added/Removed on potion container activation.
- `gravedigger_user` -- Added/Removed on gravestone upgrade activation.
- `player_shadow_aligned` -- Added/Removed on shadow allegiance activation.
- `player_lunar_aligned` -- Added/Removed on lunar allegiance activation.
- `shadow_aligned` -- Added/Removed on ghost during shadow allegiance.
- `lunar_aligned` -- Added/Removed on ghost during lunar allegiance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skilltree_data` | table | --- | The table returned by `BuildSkillsData` containing all skill tree configuration. |
| `SKILLS` | table | --- | Contains all defined skill nodes indexed by skill name. |
| `ORDERS` | table | --- | Defines display ordering for skill groups (currently mostly commented out). |
| `PUCK` | boolean | --- | Flag indicating puck interaction availability. |
| `skill.pos` | table | --- | `{x, y}` coordinates for the skill node in the UI. |
| `skill.tags` | table | --- | List of tags associated with the skill for filtering or logic. |
| `skill.root` | boolean | --- | Indicates if the skill is a root node (starting point). |
| `skill.connects` | table | --- | List of skill names this node connects to. |
| `skill.onactivate` | function | --- | Callback function executed when the skill is unlocked. |
| `skill.ondeactivate` | function | --- | Callback function executed when the skill is locked. |
| `skill.locks` | table | --- | List of skill names that lock this node until completed. |
| `skill.group` | string | --- | Assigned group name (e.g., "sisturn_upgrades", "potion_upgrades"). |
| `skill.title` | string | --- | Display title, auto-filled from `STRINGS` if not provided. |
| `skill.desc` | string | --- | Display description, auto-filled from `STRINGS` if not provided. |
| `skill.icon` | string | --- | Icon asset name, defaults to skill name if not provided. |

## Main functions

### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the complete skill tree data table for Wendy. It processes internal skill group tables into a unified `SKILLS` map and applies localization strings.
*   **Parameters:**
    - `SkillTreeFns` -- Table containing helper functions for locks (e.g., `MakeFuelWeaverLock`).
*   **Returns:** Table containing `SKILLS`, `ORDERS`, and `PUCK`.
*   **Error states:** None.

### `finalize_skill_group(skill_subset, group_name)`
*   **Description:** Internal helper that iterates through a subset of skills, assigns group metadata, and resolves localization strings for title and description.
*   **Parameters:**
    - `skill_subset` -- Table of skill definitions to process.
    - `group_name` -- String name of the group to assign (e.g., "sisturn_upgrades").
*   **Returns:** Nothing (modifies the external `skills` table directly).
*   **Error states:** None.

## Events & listeners
None.