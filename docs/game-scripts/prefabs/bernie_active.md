---
id: bernie_active
title: Bernie Active
description: Represents the active, playable form of Bernie — a small companion creature that can transform into inactive or larger forms, managing health, movement, and inventory interactions.
tags: [companion, transformation, combat, ai]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12c16fbb
system_scope: entity
---

# Bernie Active

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bernie_active` prefab is the primary combat and movement form of Bernie, a companion entity that can transition into `bernie_inactive` or `bernie_big` forms based on game conditions (e.g., time, player action, or leader state). It integrates several core systems: health, locomotion, combat, inventory (via `inventoryitem`), and custom transformation logic. The component adds networking support, physics, animation, and a dedicated brain (`berniebrain`) for AI behavior.

## Usage example
```lua
local bernie = SpawnPrefab("bernie_active")
bernie.Transform:SetPosition(0, 0, 0)
bernie.components.health:SetMaxHealth(TUNING.BERNIE_HEALTH)
bernie.components.locomotor.walkspeed = TUNING.BERNIE_SPEED
```

## Dependencies & tags
**Components used:** `health`, `inspectable`, `locomotor`, `combat`, `timer`, `inventoryitem`, `hauntable`  
**Tags added:** `smallcreature`, `companion`, `soulless`

## Properties
No public properties are directly exposed or initialized beyond standard component interfaces.

## Main functions
### `GoInactive()`
*   **Description:** Transforms `bernie_active` into `bernie_inactive`, transferring remaining health as fuel percentage and preserving position and transform rotation. Cancels pending transformation cooldown if active.
*   **Parameters:** None.
*   **Returns:** `bernie_inactive` instance if successful; `nil` otherwise.
*   **Error states:** May return `nil` if `SpawnPrefab("bernie_inactive", ...)` fails.

### `GoBig(leader)`
*   **Description:** Transforms `bernie_active` into `bernie_big`, but only if the `leader` has not already spawned a big Bernie. Preserves position, rotation, and health percentage, and registers the new form in `leader.bigbernies`.
*   **Parameters:** `leader` (entity) — the boss or controlling entity associated with Bernie.
*   **Returns:** `bernie_big` instance if successful; `nil` otherwise.
*   **Error states:** Returns early with `nil` if `leader.bigbernies` is truthy; may return `nil` on `SpawnPrefab` failure.

### `OnEntitySleep(inst)`
*   **Description:** Schedules a transformation to `bernie_inactive` after a short delay (0.5s) upon world sleep (e.g., nightfall).
*   **Parameters:** `inst` (entity) — the Bernie instance.
*   **Returns:** None (sets `inst._sleeptask` for delayed execution).

### `OnEntityWake(inst)`
*   **Description:** Cancels a pending sleep transformation if the world wakes (e.g., morning).
*   **Parameters:** `inst` (entity) — the Bernie instance.
*   **Returns:** None (clears `inst._sleeptask` if present).

### `ReplaceOnPickup(inst, container, src_pos)`
*   **Description:** Converts `bernie_active` to `bernie_inactive` and gives it to the target container or inventory. Used as the core logic for both pickup and inventory insertion.
*   **Parameters:**  
  - `inst` (entity) — the Bernie instance.  
  - `container` (Inventory or Container component) — destination inventory.  
  - `src_pos` (vector3) — source position for placement.  
*   **Returns:** `true` — always returns true to indicate the original entity was removed.

## Events & listeners
- **Listens to:** `entitysleep` — triggers `OnEntitySleep`; used to schedule transformation to inactive form at night.  
- **Listens to:** `entitywakeup` — triggers `OnEntityWake`; cancels pending transformation on waking.  
- **Pushes:** None — this prefab does not emit custom events; relies on component-based events (e.g., inventory interactions).