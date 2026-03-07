---
id: charlierose
title: Charlierose
description: A one-time consumable flower item that shatters on drop and disappears after a short time unless picked up and placed in inventory.
tags: [consumable, fx, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eeb07b32
system_scope: inventory
---

# Charlierose

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`charlierose` is a non-persistent FX item prefab representing a fragile flower that shatters and erodes away if not retrieved quickly. It is designed to be dropped from Charlie's attacks and only exists temporarily in the world. Once picked up, it becomes pickable but not droppable, and persists in inventory until used or manually dropped again (at which point it may re-shatter depending on state). Its lifecycle is managed via animation callbacks and entity sleep/wake events.

## Usage example
```lua
-- The charlierose prefab is created and registered as a_prefab by the game engine.
-- Modders typically do not instantiate it directly but may reference its properties:
local inst = Prefab("charlierose", nil, assets)
-- Or spawn via entity builder logic in a component or prefab:
-- local rose = SpawnPrefab("charlierose")
```

## Dependencies & tags
**Components used:** `inventoryitem`, `fuel`, `inspectable`, `animstate`, `soundemitter`, `transform`, `network`
**Tags:** Adds `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._sleeptask` | Task | `nil` | Reference to the delayed `Remove` task scheduled on sleep. |
| `inst._soundtask` | Task | `nil` | Reference to the sound playback task scheduled on drop. |
| `inst.persists` | boolean | `false` (initially) | Whether the item persists across world saves/loads. Set to `true` only when picked up and anim done. |
| `inst.OnEntitySleep` | function | `nil` → `OnEntitySleep` | Hook for sleep behavior (sets removal task). |
| `inst.OnEntityWake` | function | `nil` → `OnEntityWake` | Hook for wake behavior (cancels removal task). |

## Main functions
### `OnDropped(inst)`
* **Description:** Called when the item is dropped from inventory. Triggers shatter animation, schedules a one-time shatter sound, registers `animover` callback to remove entity after animation ends, and sets sleep/wake hooks.
* **Parameters:** `inst` (Entity) — the entity instance.
* **Returns:** Nothing.
* **Error states:** May schedule duplicate tasks if called repeatedly without state checks (protected by `if inst._soundtask == nil`).

### `OnPutInInventory(inst, owner)`
* **Description:** Called when the item is placed into an inventory slot. Cancels shatter countdown and sleep tasks, sets `persists = true`, plays "rose" animation, and removes sleep/wake hooks to persist indefinitely in inventory.
* **Parameters:**  
  * `inst` (Entity) — the item entity.  
  * `owner` (Entity) — the inventory owner (e.g., player).  
* **Returns:** Nothing.
* **Error states:** Early exit if item is already marked as persistent or animation is already complete.

### `DoFallShatterSound(inst)`
* **Description:** Plays the shatter sound effect once called (via a task scheduled on drop).
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — fires `ErodeAway` when rose_shatter animation completes (in `OnDropped` state only).
- **Pushes:** None directly.