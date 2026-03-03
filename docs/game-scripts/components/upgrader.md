---
id: upgrader
title: Upgrader
description: Determines whether a given entity can be upgraded based on type and user permissions.
tags: [upgrades, validation, permissions]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1c914b16
system_scope: entity
---

# Upgrader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Upgrader` component acts as a validation layer for upgrade operations. It ensures that an upgrade request is valid by checking two conditions:  
1. Whether the target entity's upgrade type matches this upgrader's configured type.  
2. Whether the entity performing the upgrade (the "doer") possesses the required permission tag (`<upgradetype>_upgradeuser`).  

This component is designed to be attached to entities (e.g., workshop benches, upgrade stations) that facilitate item or building upgrades, and works in conjunction with the `upgradeable` component on the target entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgrader")
inst.components.upgrader.upgradetype = "structure"
inst.components.upgrader.upgradevalue = 2

-- Later, during an upgrade attempt:
if inst.components.upgrader:CanUpgrade(target_entity, player_entity) then
    -- Proceed with upgrade logic
end
```

## Dependencies & tags
**Components used:** `upgradeable` (accessed on target entity), `HasTag` (on `doer` entity)  
**Tags:** Adds `<upgradetype>_upgrader` tag on itself when `upgradetype` is set; removes it when changed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `upgradetype` | string | `"DEFAULT"` | The upgrade category this upgrader supports (e.g., `"structure"`, `"tool"`). Must match the target's `upgradeable.upgradetype`. |
| `upgradevalue` | number | `1` | Arbitrary upgrade value multiplier or cost modifier (usage context-dependent). |

## Main functions
### `CanUpgrade(target, doer)`
* **Description:** Validates whether the `doer` is allowed to upgrade the `target` using this upgrader.  
* **Parameters:**  
  * `target` (Entity) — The entity being upgraded; must have an `upgradeable` component.  
  * `doer` (Entity) — The entity attempting the upgrade (e.g., a player); checked for permission tags.  
* **Returns:** `true` if both conditions are met; otherwise `false`.  
* **Error states:** Returns `false` if `target` lacks the `upgradeable` component, or if either type mismatch or permission tag is missing.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None  

## Notes
- The `upgradetype` property is reactive: assigning a new value triggers the `onupgradetype` callback, which updates the upgrader's own tags dynamically (`<type>_upgrader`).  
- The component assumes the target’s `upgradeable.upgradetype` is already initialized; undefined behavior may occur if accessed before `upgradeable` is properly configured on the target.
