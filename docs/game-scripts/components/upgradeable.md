---
id: upgradeable
title: Upgradeable
description: Tracks and manages upgrade progression for entities, handling stage advancement and upgrade counting logic.
tags: [crafting, progression, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3fcf5ff1
system_scope: entity
---

# Upgradeable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Upgradeable` component enables entities to be upgraded through repeated application of items that provide upgrade value. It maintains state about current stage, total upgrades accumulated, and triggers progression when thresholds are met. It works closely with the `upgrader` component (which provides the upgrade value of an item) and the `stackable` component (to consume upgrade items). The component also manages dynamic tagging for upgrade type and stage-based visual or behavioral changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("upgradeable")
inst.components.upgradeable:SetStage(1)
inst.components.upgradeable:SetNumStages(3)
inst.components.upgradeable:SetOnUpgradeFn(function(inst, performer, item)
    -- Apply upgrade logic (e.g., change stats, appearance)
end)
```

## Dependencies & tags
**Components used:** `upgrader`, `stackable`
**Tags:** Dynamically adds/removes `<upgradetype>_upgradeable` based on upgrade state (e.g., `gear_upgradeable`). Tag is added when `CanUpgrade()` is true.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `upgradetype` | string | `UPGRADETYPES.DEFAULT` | Identifier for the upgrade type; used to generate tags and match with compatible `upgrader` items. |
| `stage` | number | `1` | Current upgrade stage (1-indexed). |
| `numstages` | number | `3` | Total number of upgrade stages available. |
| `upgradesperstage` | number | `5` | Number of upgrade points required to advance to the next stage. |
| `numupgrades` | number | `0` | Accumulated upgrade points in the current stage. |
| `onstageadvancefn` | function or nil | `nil` | Callback executed when advancing stages; receives `inst` as argument. |
| `onupgradefn` | function or nil | `nil` | Callback executed when an upgrade item is applied; receives `(inst, performer, item)` as arguments. |
| `canupgradefn` | function or nil | `nil` | Optional predicate; returns `(can_upgrade: boolean, reason?: string)`. |

## Main functions
### `SetOnUpgradeFn(fn)`
* **Description:** Sets the callback function invoked each time an upgrade item is successfully applied.
* **Parameters:** `fn` (function) - signature: `fn(inst, performer, item)`.
* **Returns:** Nothing.

### `SetCanUpgradeFn(fn)`
* **Description:** Sets a custom predicate to determine whether the entity can be upgraded further.
* **Parameters:** `fn` (function) - signature: `fn(inst) → can_upgrade: boolean, reason?: string`.
* **Returns:** Nothing.

### `GetStage()`
* **Description:** Returns the current upgrade stage.
* **Parameters:** None.
* **Returns:** number - current stage (e.g., `1`, `2`, `3`).

### `SetStage(num)`
* **Description:** Explicitly sets the current stage. Does *not* reset `numupgrades`.
* **Parameters:** `num` (number) - new stage value.
* **Returns:** Nothing.

### `AdvanceStage()`
* **Description:** Increments the stage by one and resets `numupgrades` to `0`. Triggers the `onstageadvancefn` callback if present.
* **Parameters:** None.
* **Returns:** Result of `onstageadvancefn` if defined; otherwise returns nothing.

### `CanUpgrade()`
* **Description:** Determines whether the entity is eligible for further upgrades.
* **Parameters:** None.
* **Returns:** boolean or `(boolean, string)` — `true` if upgradeable and not at max stage; `false, reason` if blocked by `canupgradefn`, or `false` if at max stage.
* **Error states:** Returns `false, reason` if `canupgradefn` returns false and provides a reason string.

### `Upgrade(obj, upgrade_performer)`
* **Description:** Processes the application of an upgrade item (`obj`) to this entity. Consumes the item and advances `numupgrades`. If the threshold `upgradesperstage` is reached, advances to the next stage.
* **Parameters:**  
  * `obj` (entity) — the item being used to upgrade; must have an `upgrader` component.  
  * `upgrade_performer` (entity) — the entity performing the upgrade (e.g., player).
* **Returns:** `true` — always.
* **Error states:** Consumes `obj` unconditionally via `stackable:Get(1):Remove()` or `obj:Remove()`, regardless of result.

### `OnSave()`
* **Description:** Serializes upgrade state for world save.
* **Parameters:** None.
* **Returns:** table — `{ numupgrades = number, stage = number }`.

### `OnLoad(data)`
* **Description:** Restores upgrade state from world save.
* **Parameters:** `data` (table) — save data from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for the current upgrade state.
* **Parameters:** None.
* **Returns:** string — formatted string like `"Upgrade type: gear; Current stage: 2 / 3; Upgrade Count: 3 / 5"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
