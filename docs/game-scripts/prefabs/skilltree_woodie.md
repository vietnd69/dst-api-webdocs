---
id: skilltree_woodie
title: Skilltree Woodie
description: Defines the skill tree data structure for Woodie character, including all skill nodes, positions, unlock conditions, and activation callbacks.
tags: [skills, character, woodie, data]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 3c2faa68
system_scope: player
---

# Skilltree Woodie

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`skilltree_woodie` is a data configuration module that defines Woodie's complete skill tree structure. It returns a builder function `BuildSkillsData` that generates skill node definitions with positions, group assignments, unlock conditions, and activation/deactivation callbacks. The skill tree is divided into three main groups: `curse` (wereform abilities), `human` (human form abilities), and `allegiance` (shadow/lunar alignment paths).

## Usage example
```lua
local SkillTreeWoodie = require("prefabs.skilltree_woodie")
local SkillTreeFns = require("scripts.skilltree.skilltreefns")

local skillData = SkillTreeWoodie(SkillTreeFns)
local skills = skillData.SKILLS
local orders = skillData.ORDERS

-- Access a specific skill node
local beaverSkill = skills.woodie_curse_beaver_1
print(beaverSkill.pos) -- {x, y} position for UI
print(beaverSkill.group) -- "curse"
print(beaverSkill.tags) -- {"curse", "beaver"}

-- Iterate through display order
for i, orderData in ipairs(orders) do
    local groupName = orderData[1]
    local position = orderData[2]
end
```

## Dependencies & tags
**External dependencies:**
- `STRINGS.SKILLTREE.WOODIE` -- localization strings for skill titles and descriptions
- `TUNING.SKILLS.WOODIE` -- balance values for skill effects (damage bonuses, regen rates, etc.)
- `ACTIONS` -- action definitions for worker skill modifiers
- `SkillTreeFns` -- passed as parameter, provides helper functions for locks and tag counting

**Components used:**
- `damagetypebonus` -- adds damage bonuses vs specific enemy types (treeguards, lunar/shadow aligned)
- `damagetyperesist` -- adds damage resistance for shadow/lunar alignment
- `health` -- adds health regeneration source for Weremoose skills
- `moisture` -- sets waterproofness for Weregoose skills
- `planardefense` -- adds planar defense bonus for epic Weremoose
- `worker` -- modifies action effectiveness for Werebeaver mining/chopping
- `attackdodger` -- added dynamically for Weregoose dodge ability

**Tags:**
- `cursemaster` -- added when curse master skill activated
- `toughworker` -- added when Werebeaver can break hard materials
- `weremoosecombo` -- added for epic Weremoose combat abilities
- `woodiequickpicker` -- added for faster item collection
- `player_shadow_aligned` -- added when shadow allegiance chosen
- `player_lunar_aligned` -- added when lunar allegiance chosen
- `recoilimmune` -- added for Werebeaver hard material breaking

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKILLS` | table | --- | Table containing all skill node definitions keyed by skill ID |
| `ORDERS` | array | --- | Array defining display order and positioning for skill tree groups |

## Main functions
### `BuildSkillsData(SkillTreeFns)`
* **Description:** Constructs and returns the complete skill tree data structure for Woodie. Processes all skill nodes, assigns localization strings, and sets default icons for non-lock skills.
* **Parameters:**
  - `SkillTreeFns` -- external module providing helper functions for lock conditions and tag counting
* **Returns:** Table with `SKILLS` (skill definitions) and `ORDERS` (display order) keys
* **Error states:** Errors if `SkillTreeFns` is nil or missing required methods (`CountTags`, `CountSkills`, `MakeFuelWeaverLock`, `MakeNoLunarLock`, `MakeCelestialChampionLock`, `MakeNoShadowLock`)

### `CreateAddTagFn(tag)`
* **Description:** Factory function that returns a callback function to add a specific tag to the player instance when a skill is activated.
* **Parameters:** `tag` -- string tag name to add
* **Returns:** Function that takes `inst` parameter and calls `inst:AddTag(tag)`
* **Error states:** None

### `CreateRemoveTagFn(tag)`
* **Description:** Factory function that returns a callback function to remove a specific tag from the player instance when a skill is deactivated.
* **Parameters:** `tag` -- string tag name to remove
* **Returns:** Function that takes `inst` parameter and calls `inst:RemoveTag(tag)`
* **Error states:** None

### `CreateAddDamageBonusVsTreeguardsFn(level)`
* **Description:** Factory function that returns a callback to add damage bonus against treeguards. Uses `damagetypebonus` component with unique key per level.
* **Parameters:** `level` -- number representing skill level for unique key generation
* **Returns:** Function that takes `inst` parameter and adds damage bonus if `damagetypebonus` component exists
* **Error states:** None -- gracefully handles missing `damagetypebonus` component with nil check

### `CreateRemoveDamageBonusVsTreeguardsFn(level)`
* **Description:** Factory function that returns a callback to remove damage bonus against treeguards. Uses matching key from activation function.
* **Parameters:** `level` -- number representing skill level for unique key matching
* **Returns:** Function that takes `inst` parameter and removes damage bonus if `damagetypebonus` component exists
* **Error states:** None -- gracefully handles missing `damagetypebonus` component with nil check

### `RecalculateWereformSpeed(inst)`
* **Description:** Callback function that triggers wereform speed recalculation. Used by moose and goose speed skills for both activation and deactivation.
* **Parameters:** `inst` -- player entity instance
* **Returns:** None
* **Error states:** Errors if `inst` does not have `RecalculateWereformSpeed` method

## Skill node structure
Each skill in the `SKILLS` table follows this schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pos` | array | Yes | `{x, y}` position coordinates for UI rendering |
| `group` | string | Yes | Skill group: `curse`, `human`, or `allegiance` |
| `tags` | array | Yes | Tags used for filtering and lock conditions |
| `root` | boolean | No | Marks skill as a starting node in its branch |
| `connects` | array | No | List of skill IDs this node connects to |
| `locks` | array | No | List of lock skill IDs that must be opened first |
| `lock_open` | function | No | Custom condition function for lock skills |
| `onactivate` | function | No | Callback fired when skill is activated |
| `ondeactivate` | function | No | Callback fired when skill is deactivated |
| `defaultfocus` | boolean | No | Sets this skill as default focus in UI |
| `icon` | string | No | Icon name for UI display (auto-generated if omitted) |
| `title` | string | No | Display title (auto-loaded from STRINGS if omitted) |
| `desc` | string | No | Description text (auto-loaded from STRINGS if omitted) |

## Events & listeners
Not applicable - this is a data configuration file with no event system integration.