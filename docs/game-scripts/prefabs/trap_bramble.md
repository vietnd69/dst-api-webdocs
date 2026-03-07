---
id: trap_bramble
title: Trap Bramble
description: A reusable trap prefab that deals damage to enemies on contact, deactivates when sprung, and supports hauntable interaction with special refund mechanics.
tags: [combat, trap, reusable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4330568
system_scope: world
---

# Trap Bramble

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`trap_bramble` is a deployable, reusable trap prefab that triggers on entity contact, deals damage, and then deactivates until manually reset. It integrates with multiple systems: `mine` for detection and activation logic, `inventoryitem` for placement and dropping behavior, `finiteuses` for limited durability, `deployable` for smart placement constraints, and `hauntable` for haunter interaction with conditional refund behavior. The trap uses visual and sound feedback during activation, reset, and reuse phases.

## Usage example
```lua
local inst = SpawnPrefab("trap_bramble")
inst.Transform:SetPosition(x, y, z)
inst.components.deployable:Place() -- implicitly calls ondeploy hook
-- Trigger reset after depletion or manual reset if needed
if inst.components.mine ~= nil and inst.components.mine.inactive then
    inst.components.mine:Reset()
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `mine`, `finiteuses`, `deployable`, `hauntable`, `inspectable`, `physics`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`  
**Tags:** Adds `"trap"` and `"trap_bramble"`. Checks `"usesdepleted"` (via `finiteuses`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_damage` | number | `TUNING.TRAP_BRAMBLE_DAMAGE` | Damage value displayed in scrapbook. |
| `last_reset` | number | `nil` | Timestamp of last reset (set on `OnReset`). |
| `canhitplayers` | boolean | `false` | Controls whether the FX projectile hits players (set dynamically on trigger). |

## Main functions
### `OnExplode(inst)`
* **Description:** Triggered when the mine detects a valid target within radius. Plays activation animation and sound, spawns thorn FX after a short delay, and consumes one use if finiteuses is present.
* **Parameters:** `inst` (Entity) — the trap instance.
* **Returns:** Nothing.
* **Error states:** If `finiteuses` is `nil`, no uses are consumed.

### `OnReset(inst)`
* **Description:** Resets the trap to active state after it has been sprung or manually reset. Re-enables minimap visibility, plays reset animation/sounds, and marks it active again.
* **Parameters:** `inst` (Entity) — the trap instance.
* **Returns:** Nothing.

### `SetSprung(inst)`
* **Description:** Called immediately when the trap is sprung (before full deactivation). Sets `nobounce` to true, enables minimap icon, and plays the sprung idle animation.
* **Parameters:** `inst` (Entity) — the trap instance.
* **Returns:** Nothing.

### `SetInactive(inst)`
* **Description:** Called when the mine is explicitly deactivated (e.g., via `Deactivate`). Disables minimap icon and sets `nobounce` to false.
* **Parameters:** `inst` (Entity) — the trap instance.
* **Returns:** Nothing.

### `OnDropped(inst)`
* **Description:** Handles trap deactivation when the item is dropped from inventory. Calls `mine:Deactivate()` to disable detection.
* **Parameters:** `inst` (Entity) — the trap instance.
* **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
* **Description:** Callback used by `deployable` after successful placement. Resets the mine and teleports the entity to the deployment point.
* **Parameters:**  
  * `inst` (Entity) — the trap instance.  
  * `pt` (Vector3) — the deployment point.  
  * `deployer` (Entity) — the deploying entity (unused).  
* **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
* **Description:** Handles haunter interaction. Returns `true` (successful haunt) and refunds the trap under two conditions: (1) trap is inactive → tiny haunt, small launch; (2) trap is active and not sprung → 30% chance for small haunt + reset. Returns `false` otherwise.
* **Parameters:**  
  * `inst` (Entity) — the trap instance.  
  * `haunter` (Entity) — the haunter entity.  
* **Returns:** `true` if haunt succeeds (and effects trigger), `false` otherwise.

## Events & listeners
- **Listens to:** None (does not register `ListenForEvent` directly; relies on component callbacks).
- **Pushes:** `percentusedchange` (via `finiteuses:SetUses()`), implicitly handled by other components.