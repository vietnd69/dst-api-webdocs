---
id: skilltree_willow
title: Skilltree Willow
description: Defines Willow's skill tree data, including skill nodes, layout, and activation logic.
tags: [skills, willow, progression]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: data
source_hash: 677a355b
system_scope: player
---

# Skilltree Willow

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`skilltree_willow` is a data configuration module that defines the structure and logic for Willow's character skill tree. It returns a factory function `BuildSkillsData` which generates a table containing skill definitions (`SKILLS`) and layout ordering (`ORDERS`). This data is consumed by the skill tree UI and progression systems to render nodes and handle unlocks. Unlike prefab files, this module does not register an entity but provides static configuration and callbacks executed upon skill activation.

## Usage example
```lua
local WillowSkills = require("prefabs/skilltree_willow")

-- Generate the skill data table
local SkillTreeFns = { CountTags = function(...) end } -- Mock dependency
local data = WillowSkills(SkillTreeFns)

-- Access skill definitions
local skills = data.SKILLS
local first_skill = skills.willow_controlled_burn_1

-- Access layout order
local orders = data.ORDERS
```

## Dependencies & tags
**External dependencies:**
- `STRINGS` -- Localization keys for titles and descriptions.
- `TUNING` -- Balance constants for damage resist and bonuses.
- `TheGenericKV` -- Persistent key-value storage for progression checks (e.g., boss kills).

**Components used:**
- `skilltreeupdater` -- Checks if specific skills are activated via `IsActivated`.
- `damagetyperesist` -- Adds damage resistance upon allegiance skill activation.
- `damagetypebonus` -- Adds damage bonuses against specific types upon allegiance skill activation.

**Tags:**
- `controlled_burner` -- Added by `willow_controlled_burn_1`.
- `ember_master` -- Added by `willow_embers`.
- `player_shadow_aligned` -- Added by shadow allegiance skills.
- `player_lunar_aligned` -- Added by lunar allegiance skills.
- `lock` -- Used to mark locked skill nodes.
- `bernie`, `lighter`, `allegiance` -- Group identifiers used for filtering.
- `shadow_favor`, `lunar_favor` -- Allegiance type identifiers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLS` | table | --- | Map of skill IDs to skill definition tables. |
| `ORDERS` | table | --- | Layout order configuration for skill groups. |
| `title` | string | --- | Localization key for the skill title. |
| `desc` | string | --- | Localization key for the skill description. |
| `icon` | string | --- | Atlas name for the skill icon. |
| `pos` | table | --- | X, Y coordinates for UI placement. |
| `group` | string | --- | Skill group identifier (e.g., "lighter", "bernie"). |
| `tags` | table | --- | List of tags associated with the skill. |
| `onactivate` | function | --- | Callback executed when the skill is unlocked. |
| `root` | boolean | --- | Indicates if the skill is a starting node. |
| `connects` | table | --- | List of skill IDs this skill connects to. |
| `lock_open` | function | --- | Condition function to determine if a locked skill is unlockable. |
| `locks` | table | --- | List of skill IDs that must be unlocked to access this skill. |
| `defaultfocus` | boolean | --- | Indicates if this skill should be focused by default in UI. |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
*   **Description:** Constructs and returns the skill tree data table containing `SKILLS` and `ORDERS`. It utilizes `SkillTreeFns` for validation logic within locked skills.
*   **Parameters:**
    - `SkillTreeFns` -- Table containing utility functions like `CountTags` used by lock conditions.
*   **Returns:** Table containing `SKILLS` (skill definitions) and `ORDERS` (layout config).
*   **Error states:** Errors if `SkillTreeFns` is nil and a lock condition attempts to call `SkillTreeFns.CountTags`.

### `lock_open(prefabname, activatedskills, readonly)`
*   **Description:** Conditional function defined within specific skill entries (e.g., `willow_bernie_lock`). Determines if a locked skill node should be revealed or unlockable based on player progression.
*   **Parameters:**
    - `prefabname` -- String prefab name of the player.
    - `activatedskills` -- Table of currently activated skill IDs.
    - `readonly` -- Boolean indicating if the check is for display only.
*   **Returns:** Boolean `true` if unlocked, `false` if locked, or string `"question"` if readonly and unknown.
*   **Error states:** Errors if `TheGenericKV` is nil when checking boss kill status for allegiance locks.

### `onactivate(inst, fromload)`
*   **Description:** Callback function defined within skill entries. Executes logic when the skill is unlocked, such as adding tags or modifying components.
*   **Parameters:**
    - `inst` -- Player entity instance.
    - `fromload` -- Boolean indicating if the skill was loaded from save data.
*   **Returns:** None
*   **Error states:** Errors if `inst` is missing required components (`damagetyperesist`, `damagetypebonus`, `skilltreeupdater`) when allegiance skills are activated. Errors if `inst.bigbernies` is accessed but is nil (though guarded by `if` checks in source).