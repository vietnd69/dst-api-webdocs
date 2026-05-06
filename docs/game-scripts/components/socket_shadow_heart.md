---
id: socket_shadow_heart
title: Socket Shadow Heart
description: Applies a periodic shadow debuff to nearby combat entities for WX-78 skill system.
tags: [wx78, skills, debuff]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: b11d8c98
system_scope: entity
---

# Socket Shadow Heart

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Socket_Shadow_Heart` is a WX-78 skill component that applies a shadow-based debuff to nearby hostile entities. For player entities, it runs a periodic task that finds combat-capable entities within a radius and applies the `wx78_shadow_heart_debuff`. For WX-78 backup body entities, it spawns a visual heart vein spawner attached to the entity. The component integrates with the `combat` and `health` components to validate targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("socket_shadow_heart")
inst.components.socket_shadow_heart:SetDebuffRadius(6)
inst.components.socket_shadow_heart:SetDamageMult(1.5)
```

## Dependencies & tags
**External dependencies:**
- `TUNING.SKILLS.WX78.SHADOWHEART_PASSIVE_TICK_PERIOD` -- tick interval constant
- `TheNet:GetPVPEnabled()` -- determines if players can be debuffed
- `TheSim:FindEntities()` -- finds entities in debuff radius
- `SpawnPrefab()` -- spawns visual FX and spawner entities

**Components used:**
- `combat` -- checks `CanTarget()`, `IsAlly()` for target validation
- `health` -- checks `IsDead()` to skip dead entities

**Tags:**
- `_combat` -- required tag for debuff targets
- `FX`, `NOCLICK`, `DECOR`, `INLIMBO` -- excluded from debuff
- `player` -- excluded when PVP is disabled

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. |
| `debuffradius` | number | `4` | Radius in units for finding debuff targets. |
| `damagemult` | number | `1.25` | Damage multiplier for the shadow heart effect. |
| `DEBUFF_MUST_TAGS` | table | `{"_combat"}` | Tags that targets must have to receive debuff. |
| `DEBUFF_CANT_TAGS` | table | varies | Tags that exclude entities from debuff. Adds `"player"` if PVP disabled. |
| `OnTick` | function | `nil` | Periodic callback function (player entities only). |
| `periodictask` | task | `nil` | Handle for the periodic task (player entities only). |
| `spawner` | entity | `nil` | Heart vein spawner entity reference (wx78_backupbody only). |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed. Cancels the periodic task and removes the spawner entity if present.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `SetDebuffRadius(debuffradius)`
* **Description:** Sets the radius for finding debuff targets.
* **Parameters:** `debuffradius` -- number, radius in units
* **Returns:** nil
* **Error states:** None.

### `SetDamageMult(damagemult)`
* **Description:** Sets the damage multiplier for the shadow heart effect.
* **Parameters:** `damagemult` -- number, damage multiplier value
* **Returns:** nil
* **Error states:** None.

## Events & listeners
- **Listens to:** `onremove` (on spawner entity) -- clears `self.spawner` reference when spawner is removed (wx78_backupbody only)