---
id: tillweedsalve
title: Tillweedsalve
description: "Defines two prefabs: the tillweed salve inventory item that heals users, and the tillweed salve buff debuff that applies healing over time."
tags: [prefab, item, healing, consumable]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 60d5f6c7
system_scope: inventory
---

# Tillweedsalve

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`tillweedsalve.lua` registers two spawnable prefabs. The `tillweedsalve` prefab is a consumable inventory item that heals 10 HP instantly and applies a healing-over-time debuff. The `tillweedsalve_buff` prefab is a classified, non-networked entity that attaches to the target and periodically applies health delta until the buff duration expires. The salve uses the `healer` component for instant healing and spawns the buff prefab to handle overtime healing via the `debuff` component.

## Usage example
```lua
-- Spawn the salve item:
local salve = SpawnPrefab("tillweedsalve")
salve.Transform:SetPosition(0, 0, 0)

-- The buff prefab is spawned internally by the healer component:
-- Do not spawn directly; it is created when salve is used on a target
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- configures floating animation for inventory items
- `MakeHauntableLaunch` -- enables ghost hauntable behavior

**Components used (tillweedsalve):**
- `stackable` -- enables item stacking; maxsize set to TUNING.STACK_SIZE_SMALLITEM
- `inspectable` -- provides inspection text
- `inventoryitem` -- enables inventory carrying
- `healer` -- applies instant heal and triggers OnUse callback

**Components used (tillweedsalve_buff):**
- `debuff` -- manages attachment, detachment, and extension callbacks
- `timer` -- tracks buff duration; fires timerdone event on completion

**Tags:**
- `show_spoilage` -- added to salve; indicates perishable visual state
- `CLASSIFIED` -- added to buff; hides entity from most queries

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{Asset("ANIM", "anim/tillweedsalve.zip")}` | Animation assets loaded for both prefabs. |
| `BUFF_DURATION` | constant (local) | `TUNING.TILLWEEDSALVE_DURATION + FRAMES` | Total buff duration in seconds; adds 1 frame to compensate for timer tick alignment. |

## Main functions

### `fn()`
* **Description:** Prefab constructor (runs on both client and master). Creates the entity, sets up transform, anim state, and network components. Applies inventory physics and floatable behavior. On master, attaches stackable, inspectable, inventoryitem, and healer components. The healer applies 10 HP instant heal and triggers OnUse when consumed.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server).

### `buff_fn()`
* **Description:** Constructor for the tillweed salve buff prefab. Server-only; on client, the entity is removed immediately via DoTaskInTime. Creates a hidden, non-persisting classified entity that attaches to a target via the debuff component. Sets up timer for buff duration and listens for timerdone event.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — client-side removal is intentional design.

### `OnUse(inst, target)`
* **Description:** Called when the salve is used on a target via the healer component's OnHealFn callback. Adds the `tillweedsalve_buff` debuff to the target, which begins the overtime healing process.
* **Parameters:**
  - `inst` -- the salve item entity
  - `target` -- the entity being healed
* **Returns:** None
* **Error states:** Errors if `target` is nil (no nil guard before target:AddDebuff call).

### `OnTick(inst, target)` (local)
* **Description:** Periodic task callback that applies overtime healing. Called every TUNING.TILLWEEDSALVE_TICK_RATE seconds. Checks if target has health component, is not dead, and is not a player ghost. Applies health delta using TUNING.TILLWEEDSALVE_HEALTH_DELTA. If target is invalid, stops the debuff.
* **Parameters:**
  - `inst` -- the buff entity
  - `target` -- the entity receiving healing
* **Returns:** None
* **Error states:** None — the nil guard `if target.components.health ~= nil` prevents crash; function safely returns without action if health component is missing.

### `OnAttached(inst, target)` (local)
* **Description:** Called when the debuff attaches to a target. Sets the buff entity's parent to the target, resets position to origin (for load cases), and starts the periodic healing task. Listens for target death event to stop the debuff.
* **Parameters:**
  - `inst` -- the buff entity
  - `target` -- the entity the debuff attached to
* **Returns:** None
* **Error states:** None — the debuff component is guaranteed to exist on the buff entity when this callback executes.

### `OnTimerDone(inst, data)` (local)
* **Description:** Called when the timer component fires the timerdone event. Checks if the timer name is `regenover` and stops the debuff if so, ending the healing effect.
* **Parameters:**
  - `inst` -- the buff entity
  - `data` -- timer event data table containing `name` field
* **Returns:** None
* **Error states:** None — the debuff component is guaranteed to exist on the buff entity when timerdone event fires.

### `OnExtended(inst, target)` (local)
* **Description:** Called when the debuff duration is extended (e.g., by consuming another salve). Stops the existing timer, restarts it with BUFF_DURATION, cancels the current periodic task, and creates a new periodic task for healing ticks.
* **Parameters:**
  - `inst` -- the buff entity
  - `target` -- the entity receiving extended healing
* **Returns:** None
* **Error states:** None — the timer component is guaranteed to exist on the buff entity when OnExtended is called.

## Events & listeners
- **Listens to (tillweedsalve_buff):** `death` -- triggered on target; stops the debuff when target dies. Data: none
- **Listens to (tillweedsalve_buff):** `timerdone` -- triggered by timer component; ends buff when duration expires. Data: `{name = string}`