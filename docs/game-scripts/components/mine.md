---
id: mine
title: Mine
description: Triggers an explosion effect when a valid nearby entity enters its detection radius, commonly used for traps.
tags: [trap, combat, trigger]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 55c647e3
system_scope: world
---

# Mine

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `mine` component enables an entity to act as a proximity-triggered trap. It periodically scans its surroundings for suitable targets within a configurable radius using a custom test function (`mine_test_fn`), and detonates upon detection. The component integrates with the `health` and `combat` components to determine target viability (e.g., ignoring dead or non-attackable entities). It manages lifecycle states (`mineactive`, `minesprung`) and supports reusable or single-use designs via tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mine")
inst.components.mine:SetRadius(5)
inst.components.mine:SetOnExplodeFn(function(mine_inst, target)
    --引爆邏輯，例如造成傷害或施加效果
end)
inst.components.mine:Reset() --启用陷阱并开始检测
```

## Dependencies & tags
**Components used:** `health`, `combat`  
**Tags:** Adds/removes `mineactive`, `minesprung`, `mine_not_reusable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number or nil | `nil` | Detection radius; must be set to enable scanning. |
| `onexplode` | function or nil | `nil` | Callback fired on explosion: `fn(inst, target)`. |
| `onreset` | function or nil | `nil` | Callback fired on reset: `fn(inst)`. |
| `onsetsprung` | function or nil | `nil` | Callback fired when sprung: `fn(inst)`. |
| `ondeactivate` | function or nil | `nil` | Callback fired when deactivated: `fn(inst)`. |
| `testtimefn` | function or nil | `nil` | Returns next test delay; defaults to `1 + math.random()`. |
| `inactive` | boolean | `true` | Whether the mine is currently inactive. |
| `issprung` | boolean | `false` | Whether the mine has been triggered. |
| `alignment` | string | `"player"` | Tag to exclude from targets (e.g., `"player"`, `"monster"`). |
| `target` | entity or nil | `nil` | Last detected target. |

## Main functions
### `SetRadius(radius)`
* **Description:** Sets the radius (in world units) within which the mine detects targets.
* **Parameters:** `radius` (number) – detection radius; must be non-negative.
* **Returns:** Nothing.

### `SetOnExplodeFn(fn)`
* **Description:** Sets the callback function executed when the mine explodes.
* **Parameters:** `fn` (function) – signature: `fn(mine_inst, target)`.
* **Returns:** Nothing.

### `SetOnSprungFn(fn)`
* **Description:** Sets the callback executed when the mine is sprung (but before explosion logic).
* **Parameters:** `fn` (function) – signature: `fn(mine_inst)`.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Resets the mine to an armed, active state: unsprung, inactive=false, starts testing again.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Fires `onreset` callback if assigned.

### `Explode(target)`
* **Description:** Triggers the explosion effect immediately, recording the target and invoking `onexplode`.
* **Parameters:** `target` (entity) – the entity that triggered the mine.
* **Returns:** Nothing.
* **Error states:** Stops further testing and sets `issprung = true`.

### `Deactivate()`
* **Description:** Disarms the mine: stops testing, marks as inactive, prevents arming until reactivated.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Fires `ondeactivate` callback if assigned.

### `StartTesting()`
* **Description:** Begins periodic scanning for targets within `radius`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Cancels existing `testtask` before starting a new one.

### `StopTesting()`
* **Description:** Immediately cancels the current periodic test task.
* **Parameters:** None.
* **Returns:** Nothing.

### `Spring()`
* **Description:** Marks the mine as sprung and stops further testing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Fires `onsetsprung` callback if assigned.

### `OnSave()`
* **Description:** Returns serialization data for saving.
* **Parameters:** None.
* **Returns:** table or nil – `{sprung = true}`, `{inactive = true}`, or `nil` (if active and not sprung).

### `OnLoad(data)`
* **Description:** Restores state from `data` produced by `OnSave()`.
* **Parameters:** `data` (table) – state data.
* **Returns:** Nothing.
* **Error states:** Calls `Spring()`, `Deactivate()`, or `Reset()` based on `data`.

### `OnEntitySleep()`
* **Description:** Pauses testing during entity sleep and resumes after a fixed 10-second delay.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Restores normal periodic testing on entity wake.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `onputininventory` – deactivates the mine when picked up.  
  `onpickup` – deactivates the mine when placed in inventory.  
  `teleported` – deactivates the mine upon teleportation.  
  `issprung` – updates `minesprung` and `mineactive` tags.  
  `inactive` – updates `mineactive` tag if not already sprung.

- **Pushes:**  
  `trap_sprung_<prefab>` – used for stats tracking (e.g., `trap_sprung_wilson`).
