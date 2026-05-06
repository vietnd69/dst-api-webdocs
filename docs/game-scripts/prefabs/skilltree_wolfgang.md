---
id: skilltree_wolfgang
title: Skilltree Wolfgang
description: Data configuration file that defines Wolfgang's skill tree structure, including skill nodes, connections, activation callbacks, and allegiance locks.
tags: [skilltree, character, data]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 2cf2e77d
system_scope: player
---

# Skilltree Wolfgang

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`skilltree_wolfgang.lua` is a data configuration file that defines Wolfgang's skill tree structure. The `BuildSkillsData()` function returns a table containing all skill nodes organized into four groups: `might`, `training`, `planardamage`, and `allegiance`. Each skill node specifies position, connections, tags, and optional activation/deactivation callbacks that modify entity components (`mightiness`, `damagetypebonus`, `damagetyperesist`). The file is consumed by the skill tree UI system to render Wolfgang's progression tree.

## Usage example
```lua
-- Require and build the skill tree data:
local BuildSkillsData = require("prefabs/skilltree_wolfgang")
local SkillTreeFns = require("screens/skilltreefunctions") -- hypothetical dependency

local data = BuildSkillsData(SkillTreeFns)

-- Access skill definitions:
local skills = data.SKILLS
local wolfgang_critwork_1 = skills.wolfgang_critwork_1

-- Access category order/positioning:
local orders = data.ORDERS
```

## Dependencies & tags
**External dependencies:**
- `STRINGS.SKILLTREE.WOLFGANG` -- localization strings for skill titles and descriptions
- `TUNING.SKILLS` -- numeric values for skill bonuses (overbuff caps, damage resist, damage bonus)
- `TheGenericKV` -- key-value storage for tracking boss kills (fuelweaver, celestial champion)
- `SkillTreeFns` -- passed as parameter; provides `CountTags()` for lock conditions

**Components used:**
- `mightiness` -- modified via `SetOverMax()` in overbuff skills
- `damagetypebonus` -- modified via `AddBonus()`/`RemoveBonus()` in allegiance skills
- `damagetyperesist` -- modified via `AddResist()`/`RemoveResist()` in allegiance skills

**Tags:**
- `might` -- group tag for might skill tree branch
- `training` -- group tag for training skill tree branch
- `planardamage` -- group tag for planar damage skill tree branch
- `allegiance` -- group tag for allegiance skill tree branch
- `shadow_favor` / `lunar_favor` -- allegiance faction tags
- `wolfgang_coach` -- added by coach skill activation
- `wolfgang_overbuff_1` through `wolfgang_overbuff_5` -- overbuff tier tags
- `player_shadow_aligned` / `player_lunar_aligned` -- allegiance alignment tags

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `GAP` | constant (local) | `38` | Vertical spacing between skill nodes in the same column (pixels). |
| `BIGGAP` | constant (local) | `54` | Larger vertical gap used for special spacing (defined but unused in visible code). |
| `CATGAP` | constant (local) | `87` | Horizontal spacing between skill tree columns/categories. |
| `X` | constant (local) | `-212` | Base X coordinate for the first column (might group). |
| `Y` | constant (local) | `170` | Base Y coordinate for the top row of skill nodes. |
| `TITLE_Y_OFFSET` | constant (local) | `30` | Vertical offset applied to category titles in `ORDERS`. |
| `ORDERS` | table | `{...}` | Array of category definitions with name and position: `{"might", {x, y}}`, `{"training", ...}`, `{"planardamage", ...}`, `{"allegiance", ...}`. |
| `SKILLS` | table | `{...}` | Returned by `BuildSkillsData()`; contains all skill node definitions keyed by skill ID. |

## Main functions
### `RecalculatePlanarDamage(inst, fromload)` (local)
* **Description:** Callback function assigned to `onactivate` and `ondeactivate` for all planar damage skills. Calls `inst:RecalculatePlanarDamage()` to refresh planar damage modifiers when the skill is toggled.
* **Parameters:**
  - `inst` -- entity instance (player) owning the skill tree
  - `fromload` -- boolean indicating if activation is from save load (unused in this callback)
* **Returns:** None
* **Error states:** Errors if `inst` does not have a `RecalculatePlanarDamage` method (typically a player entity method).

### `BuildSkillsData(SkillTreeFns)`
* **Description:** Constructs and returns the complete skill tree data structure for Wolfgang. Defines all skill nodes with their properties (position, connections, callbacks, locks). The `SkillTreeFns` parameter provides utility functions for evaluating lock conditions.
* **Parameters:**
  - `SkillTreeFns` -- table containing skill tree helper functions; must provide `CountTags(prefabname, tag, activatedskills)` for lock evaluation
* **Returns:** Table with structure `{ SKILLS = {...}, ORDERS = {...} }` where `SKILLS` contains all skill node definitions and `ORDERS` contains category layout data.
* **Error states:** Errors if `SkillTreeFns` is nil or missing `CountTags` method when allegiance lock skills are evaluated.

## Skill Node Properties
The `SKILLS` table contains skill node definitions. Each node may have the following properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `title` | string | `---` | Localization key for skill title (e.g., `STRINGS.SKILLTREE.WOLFGANG.WOLFGANG_CRITWORK_1_TITLE`). |
| `desc` | string | `---` | Localization key for skill description. |
| `icon` | string | `---` | Asset name for the skill icon (e.g., `"wolfgang_critwork_1"`). |
| `pos` | table | `---` | `{x, y}` screen coordinates for node placement. |
| `group` | string | `---` | Category group name: `"might"`, `"training"`, `"planardamage"`, or `"allegiance"`. |
| `tags` | table | `---` | Array of tags applied when skill is activated. |
| `root` | boolean | `false` | If `true`, this skill has no prerequisites and is a tree root. |
| `connects` | table | `---` | Array of skill IDs that this node connects to (children). |
| `locks` | table | `---` | Array of lock skill IDs that must be satisfied to unlock this node. |
| `lock_open` | function | `nil` | Custom lock evaluation function; returns `true` if unlocked, `false`/`nil` if locked. |
| `onactivate` | function | `nil` | Callback fired when skill is activated. Signature: `fn(inst, fromload)`. |
| `ondeactivate` | function | `nil` | Callback fired when skill is deactivated. Signature: `fn(inst, fromload)`. |
| `defaultfocus` | boolean | `false` | If `true`, this skill is the default focused node when the tree opens. |

## Allegiance Lock Conditions
Four lock nodes control access to allegiance skills based on boss kills and faction choices:

| Lock Node | Unlock Condition |
|-----------|------------------|
| `wolfgang_allegiance_lock_1` | Requires `fuelweaver_killed` KV == `"1"` (Shadow boss defeated). |
| `wolfgang_allegiance_lock_2` | Requires `celestialchampion_killed` KV == `"1"` (Lunar boss defeated). |
| `wolfgang_allegiance_lock_3` | Unlocked if player has 0 `lunar_favor` tags; locks if lunar favor exists. |
| `wolfgang_allegiance_lock_4` | Unlocked if player has 0 `shadow_favor` tags; locks if shadow favor exists. |

**Code note:** Lock functions return `nil` (not `false`) when locked — this is intentional per the source comment "Important to return nil and not false."

## Skill Activation Effects
Skills modify entity state through `onactivate`/`ondeactivate` callbacks:

| Skill Group | Component Modified | Effect |
|-------------|-------------------|--------|
| `training` (coach) | Entity tags | Adds/removes `"wolfgang_coach"` tag. |
| `training` (speed) | `mightiness` | Calls `RecalculateMightySpeed()` on toggle. |
| `training` (overbuff 1-5) | `mightiness` | Sets `overmaxmax` to `TUNING.SKILLS.WOLFGANG_OVERBUFF_X` if current value is lower. Adds `"wolfgang_overbuff_X"` tag. |
| `planardamage` (1-5) | Entity method | Calls `RecalculatePlanarDamage()` on toggle. |
| `allegiance_shadow` | `damagetyperesist`, `damagetypebonus`, tags | Adds `"player_shadow_aligned"` tag, shadow resist vs shadow damage, bonus damage vs lunar-aligned targets. |
| `allegiance_lunar` | `damagetyperesist`, `damagetypebonus`, tags | Adds `"player_lunar_aligned"` tag, lunar resist vs lunar damage, bonus damage vs shadow-aligned targets. |

## Events & listeners
Not applicable — this is a data configuration file with no event registration.