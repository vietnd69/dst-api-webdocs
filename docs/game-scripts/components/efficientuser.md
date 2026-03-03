---
id: efficientuser
title: Efficientuser
description: Manages action-specific multipliers using source-modifiable lists to support flexible, multi-source efficiency calculations.
tags: [inventory, crafting, modifier, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b479acab
system_scope: entity
---

# Efficientuser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`EfficientUser` is a lightweight component that tracks and computes action-specific efficiency multipliers. It delegates actual value storage and modification logic to `SourceModifierList` instances per action, enabling multiple sources to contribute or override a base multiplier (e.g., `1.0`). This pattern supports additive stacking, priority-based overrides, or clean removal per source—common in crafting, inventory, or ability systems where efficiency can be modified by equipment, buffs, or skills.

The component is designed to be attached to entities (e.g., characters or devices) that perform configurable actions, and it provides simple interface methods to set, query, and remove multipliers by source and action key.

## Usage example
```lua
local inst = TheOwnerEntity()
inst:AddComponent("efficientuser")

-- Increase cooking efficiency by 0.2 from a "tool" source
inst.components.efficientuser:AddMultiplier("cook", 1.2, "tool_iron_kettle")

-- Retrieve current multiplier for cooking
local multiplier = inst.components.efficientuser:GetMultiplier("cook")

-- Remove the tool-specific modifier when unequipped
inst.components.efficientuser:RemoveMultiplier("cook", "tool_iron_kettle")
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `actions` | table | `{}` | A dictionary mapping action names to `SourceModifierList` instances. Keys are action identifiers (strings), values are `SourceModifierList` objects. |

## Main functions
### `GetMultiplier(action)`
* **Description:** Returns the computed combined multiplier for a given action, based on all active modifiers. Defaults to `1` if no modifiers exist for the action.
* **Parameters:** `action` (string) — the action name to query.
* **Returns:** `number` — the final multiplier (e.g., `1.0`, `0.8`, `1.5`).
* **Error states:** Returns `1` when no modifiers are defined for the action.

### `AddMultiplier(action, multiplier, source)`
* **Description:** Registers a new multiplier source for an action. If no `SourceModifierList` exists yet for the action, it is created. The multiplier is applied under the given `source` identifier.
* **Parameters:**  
  - `action` (string) — the action name to modify.  
  - `multiplier` (number) — the value to add as a modifier (e.g., `1.2`, `0.9`).  
  - `source` (string or any hashable identifier) — the unique name/ID of the modifier source (e.g., `"perk_winter_coat"`, `"equipped_clothing"`).
* **Returns:** Nothing.

### `RemoveMultiplier(action, source)`
* **Description:** Removes a previously registered modifier for the given `source` on the specified `action`. If the `SourceModifierList` for the action becomes empty after removal, it is retained but should return a base value of `1` via its `Get()` method.
* **Parameters:**  
  - `action` (string) — the action name.  
  - `source` (string or any hashable identifier) — the modifier source to remove.
* **Returns:** Nothing.

## Events & listeners
None identified
