---
id: damagetypebonus
title: Damagetypebonus
description: Calculates multiplicative damage bonuses based on target tags by aggregating source-specific modifiers per tag.
tags: [combat, damage, modifier]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 312f5585
system_scope: combat
---

# Damagetypebonus

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DamageTypeBonus` manages conditional damage multipliers that apply based on whether the damage target possesses certain tags. It uses `SourceModifierList` (from `util/sourcemodifierlist.lua`) to track and combine modifiers from multiple sources per tag, ensuring correct stacking and removal behavior. This component is typically attached to entities that deal damage and need to support tag-based bonus calculations (e.g., weapons or character abilities that deal extra damage to specific entity types).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("damagetypebonus")
inst.components.damagetypebonus:AddBonus("monster", "player_great_hammer", 0.5, "primary")
inst.components.damagetypebonus:AddBonus("monster", "player_magic", 0.25, "spell")
local mult = inst.components.damagetypebonus:GetBonus(target_entity)
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`; relies on the external `SourceModifierList` utility (not a component).  
**Tags:** Adds no tags to the entity; checks tags on the *target* entity (via `target:HasTag(k)`) during `GetBonus`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tags` | table of `SourceModifierList` | `{}` | Maps tag strings to their associated modifier lists. Keys are tags; values are `SourceModifierList` instances. |

## Main functions
### `AddBonus(tag, src, pct, key)`
* **Description:** Adds or updates a damage bonus multiplier for a specific tag. Applies only while the *target* has the specified tag.
* **Parameters:**
  * `tag` (string) – The tag the *target* must have to trigger this bonus.
  * `src` (string) – Unique source identifier (e.g., weapon or ability name) for modifier tracking.
  * `pct` (number) – Relative bonus percentage (e.g., `0.5` for +50% damage).
  * `key` (string) – Optional key for fine-grained modifier differentiation.
* **Returns:** Nothing.

### `RemoveBonus(tag, src, key)`
* **Description:** Removes a specific bonus modifier added via `AddBonus` for a given tag and source.
* **Parameters:**
  * `tag` (string) – The tag associated with the bonus to remove.
  * `src` (string) – Source identifier matching the original `AddBonus` call.
  * `key` (string) – Optional key matching the original `AddBonus` call.
* **Returns:** Nothing.
* **Error states:** If the modifier list for `tag` becomes empty after removal, the entry for `tag` is automatically deleted from `self.tags`.

### `GetBonus(target)`
* **Description:** Calculates the cumulative multiplicative damage multiplier for a given *target* entity based on tags with registered bonuses.
* **Parameters:**
  * `target` (Entity or nil) – The entity being damaged. If `nil`, returns `1`.
* **Returns:** `number` – Multiplicative multiplier (e.g., `1.75` = 75% bonus). Starts at `1.0` and multiplies values from all matching tag modifier lists.
* **Error states:** Returns `1` if `target` is `nil` or has no matching tags.

### `GetDebugString()`
* **Description:** Returns a formatted string summarizing active tag bonuses for debugging.
* **Parameters:** None.
* **Returns:** `string` – Multi-line string listing each tag and its current modifier value (e.g., `"\n\t[monster] 1.750000"`). Returns `nil` if no bonuses exist.

## Events & listeners
None.
