---
id: damagetyperesist
title: Damagetyperesist
description: Manages resistances to damage based on the tag(s) of the attacker or weapon applying the damage.
tags: [combat, damage, resistance]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c80e8ab6
system_scope: combat
---

# Damagetyperesist

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Damagetyperesist` is a component that enables an entity to resist damage based on the tags of the attacker or weapon performing the damage. It tracks modifier sources per damage-type tag and computes a cumulative resistance multiplier when damage is applied. This component is typically used to model immunities or vulnerabilities to specific entities (e.g., fire resistance against fire-based attackers) and integrates with the `combat` and `damage` systems via tag matching.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("damagetyperesist")

-- Grant 50% resistance against fire-tagged attackers
inst.components.damagetyperesist:AddResist("fire", "fire_resist_1", 0.5, "unique_key_1")

-- Remove the resistance
inst.components.damagetyperesist:RemoveResist("fire", "fire_resist_1", "unique_key_1")

-- Compute total resistance against a given attacker
local mult = inst.components.damagetyperesist:GetResist(attacker, weapon)
```

## Dependencies & tags
**Components used:** `source modifier list` via `util/sourcemodifierlist.lua` (used internally to manage per-source modifiers).  
**Tags:** Checks `attacker:HasTag(k)` and `weapon:HasTag(k)` during resistance calculation; no tags are added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | The entity instance that owns this component. |
| `tags` | table | `{}` | A dictionary mapping tag names (`string`) to `SourceModifierList` instances. Each list holds modifiers contributed by different sources. |

## Main functions
### `AddResist(tag, src, pct, key)`
*   **Description:** Adds or updates a resistance modifier for a specific damage-type tag. Applies a multiplicative reduction (or increase, if `pct > 1`) to damage coming from attackers or weapons with the specified tag.
*   **Parameters:**  
    - `tag` (string): The tag used to identify the damage type (e.g., `"fire"`, `"holy"`, `"undead"`).  
    - `src`: The source identifier (typically a string or unique object) for tracking the origin of this modifier.  
    - `pct` (number): The multiplier applied to damage; `1` = no change, `0.5` = 50% reduction, `2` = 100% increase.  
    - `key` (string or any): A unique key to allow adding multiple modifiers from the same source (e.g., for stacking buffs).
*   **Returns:** Nothing.
*   **Error states:** If `tag` is `nil` or invalid, the behavior is undefined (assertion may occur in development builds).

### `RemoveResist(tag, src, key)`
*   **Description:** Removes a specific resistance modifier by source and key for the given tag. If no modifiers remain for the tag, the tag entry is deleted.
*   **Parameters:**  
    - `tag` (string): The tag whose modifier is to be removed.  
    - `src`: The source identifier originally used in `AddResist`.  
    - `key`: The unique key used when adding the modifier.
*   **Returns:** Nothing.
*   **Error states:** If the tag or modifier does not exist, no action is taken and no error is raised.

### `GetResistForTag(tag)`
*   **Description:** Returns the current cumulative resistance multiplier for a specific tag (regardless of attacker or weapon). Useful for debugging or per-tag status displays.
*   **Parameters:**  
    - `tag` (string): The tag to query.
*   **Returns:** (number) The combined modifier value for the tag. Returns `1` if the tag has no modifiers.
*   **Error states:** Returns `1` if `tag` is not present in `self.tags`.

### `GetResist(attacker, weapon)`
*   **Description:** Computes the total resistance multiplier applicable to damage from a specific `attacker` and/or `weapon`. For each tag present in `self.tags`, if the attacker or weapon carries that tag, the corresponding modifier is multiplied into the result.
*   **Parameters:**  
    - `attacker` (`Entity?`): The entity dealing the damage, or `nil`.  
    - `weapon` (`Entity?`): The weapon used to deal damage, or `nil`.
*   **Returns:** (number) The cumulative damage multiplier (e.g., `0.5` = half damage, `2.0` = double damage).
*   **Error states:** If `attacker` is `nil`, returns `1` (no resistance applied). If both `attacker` and `weapon` are `nil`, returns `1`.

### `GetDebugString()`
*   **Description:** Returns a formatted string containing all currently active resistances and their values. Intended for debugging or debug UI use.
*   **Parameters:** None.
*   **Returns:** (string) A newline-separated list of tags and their modifier values, e.g. `\n\t[fire] 0.500000\n\t[holy] 2.000000`. Returns `nil` if no resistances are present.

## Events & listeners
None.
