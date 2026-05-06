---
id: skilltree_wurt
title: Skilltree Wurt
description: Defines Wurt's character skill tree data structure including skill nodes, positions, groups, and activation callbacks.
tags: [skills, character, wurt, data]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: c5efa2f1
system_scope: player
---

# Skilltree Wurt

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`skilltree_wurt` is a data configuration file that defines the complete skill tree structure for the character Wurt. It provides a factory function `BuildSkillsData` that generates skill node definitions with positions, group assignments, tags, and activation/deactivation callbacks. This file is consumed by the skill tree UI system to render and manage Wurt's unlockable abilities across three categories: Amphibian, Swampmaster, and Allegiance.

## Usage example
```lua
local SkillTreeFns = require("scripts/skilltree_functions")
local WurtSkillTree = require("prefabs/skilltree_wurt")

local skillData = WurtSkillTree(SkillTreeFns)

-- Access skill definitions
local skills = skillData.SKILLS
local orders = skillData.ORDERS

-- Access individual skill node
local amphibianSanity = skills.wurt_amphibian_sanity_1
print(amphibianSanity.pos)  -- {x, y} coordinates
print(amphibianSanity.group)  -- "amphibian"
```

## Dependencies & tags
**External dependencies:**
- `STRINGS.SKILLTREE.WURT` -- localization strings for skill titles and descriptions
- `TUNING.SKILLS.WURT` -- balance constants for skill effects
- `SkillTreeFns` -- external skill tree utility functions passed as parameter

**Components used:**
- `damagetypebonus` -- modified by allegiance skills for damage bonuses
- `damagetyperesist` -- modified by allegiance skills for damage resistance
- `inventory` -- checked via `HasItemWithTag` for mosquito craft skill
- `moisture` -- modified by amphibian temperature skill for drying rates
- `temperature` -- modified by amphibian skill for moisture penalty

**Tags:**
- `amphibian` -- group tag for amphibian skill tree
- `swampmaser` -- group tag for swampmaster skill tree (note: typo in source)
- `allegiance` -- group tag for allegiance skill tree
- `mosquitograbber` -- added/removed by mosquito craft skill
- `player_shadow_aligned` -- added by shadow allegiance skill
- `player_lunar_aligned` -- added by lunar allegiance skill
- Various spell user tags based on `SPELLTYPES` constants

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLS` | table | --- | Table containing all skill node definitions keyed by skill ID. |
| `ORDERS` | table | --- | Array of category definitions with name and position for UI ordering. |
| `pos` | table | --- | Skill node position as `{x, y}` coordinates in UI space. |
| `group` | string | --- | Skill tree category: "amphibian", "swampmaster", or "allegiance". |
| `tags` | table | --- | Array of tags associated with this skill node. |
| `root` | boolean | --- | Whether this skill is a root node (no prerequisites). |
| `connects` | table | --- | Array of skill IDs this node connects to (children). |
| `onactivate` | function | --- | Callback fired when skill is activated. |
| `ondeactivate` | function | --- | Callback fired when skill is deactivated. |
| `locks` | table | --- | Array of lock IDs that must be satisfied to unlock this skill. |
| `lock_open` | function | --- | Custom lock validation function for special requirements. |
| `defaultfocus` | boolean | --- | Whether this skill should be the default UI focus. |
| `title` | string | --- | Display title for the skill (auto-populated from STRINGS if not set). |
| `desc` | string | --- | Display description for the skill (auto-populated from STRINGS if not set). |
| `icon` | string | --- | Icon asset name for the skill (defaults to skill ID if not set). |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
* **Description:** Factory function that constructs and returns the complete skill tree data structure for Wurt. Iterates through all skill definitions to auto-populate missing title, description, and icon fields from localization strings.
* **Parameters:**
  - `SkillTreeFns` -- table containing skill tree utility functions for lock creation
* **Returns:** Table with `SKILLS` (skill definitions) and `ORDERS` (category ordering) keys.
* **Error states:** Errors if `SkillTreeFns` is nil and lock functions like `MakeFuelWeaverLock` are called.

### `CreateAddTagFn(tag)`
* **Description:** Factory function that returns a callback function to add a specific tag to the player instance when a skill is activated.
* **Parameters:** `tag` -- string tag name to add
* **Returns:** Function that takes `inst` parameter and calls `inst:AddTag(tag)`.
* **Error states:** None

### `CreateRemoveTagFn(tag)`
* **Description:** Factory function that returns a callback function to remove a specific tag from the player instance when a skill is deactivated.
* **Parameters:** `tag` -- string tag name to remove
* **Returns:** Function that takes `inst` parameter and calls `inst:RemoveTag(tag)`.
* **Error states:** None

### `RefreshWetnessSkills(inst)`
* **Description:** Callback wrapper that calls the entity's `RefreshWetnessSkills` method. Used by amphibian tree skills to update wetness-related bonuses.
* **Parameters:** `inst` -- player entity instance
* **Returns:** None
* **Error states:** Errors if `inst` does not have a `RefreshWetnessSkills` method.

### `RefreshPathFinderSkill(inst)`
* **Description:** Callback wrapper that calls the entity's `RefreshPathFinderSkill` method. Used by pathfinder skill to update navigation bonuses.
* **Parameters:** `inst` -- player entity instance
* **Returns:** None
* **Error states:** Errors if `inst` does not have a `RefreshPathFinderSkill` method.

### `CheckMosquitoCounts(inst)`
* **Description:** Checks if the player has at least one item with the "mosquitomusk" tag in their inventory. Adds or removes the `mosquitograbber` tag accordingly.
* **Parameters:** `inst` -- player entity instance with inventory component
* **Returns:** None
* **Error states:** Errors if `inst` does not have an `inventory` component (nil dereference on `inst.components.inventory` -- no guard present).

## Events & listeners
- **Listens to:** `itemget` -- registered by mosquito craft skill to check inventory changes
- **Listens to:** `itemlose` -- registered by mosquito craft skill to check inventory changes
- **Pushes:** None identified