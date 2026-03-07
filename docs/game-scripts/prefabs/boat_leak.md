---
id: boat_leak
title: Boat Leak
description: A temporary game object that simulates water leaking into a boat, interacting with nearby entities and inventory items to simulate clogging and eventual ejection.
tags: [environment, physics, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9a4e0809
system_scope: environment
---

# Boat Leak

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boat_leak` prefab represents a localized water leak in a boat hull. It operates as a non-persistent entity that actively monitors the surrounding area for objects blocking the leak. When blocked by valid entities (e.g., crew members, creatures, or inventory items), it applies wetness effects to them and eventually ejects (launches/jiggles) any inventory items blocking the leak after a timed delay. It integrates with components like `boatleak`, `hauntable`, `moisture`, `inventoryitem`, `floater`, and `updatelooper`.

## Usage example
```lua
local leak = SpawnPrefab("boat_leak")
leak.Transform:SetWorldPosition(x, y, z)
-- The leak will automatically detect and interact with nearby entities via its component callbacks
```

## Dependencies & tags
**Components used:** `boatleak`, `updatelooper`, `lootdropper`, `inspectable`, `hauntable`, `moisture`, `floater`, `inventoryitem`, `mine`, `hullhealth`, `transform`, `animstate`, `soundemitter`, `network`

**Tags added:** `boatleak`

**Tags conditionally modified:**
- Added/removed during plug/unplug state changes: `NOCLICK`, `NOBLOCK`

## Properties
No public properties are directly exposed or modified by external code; state is managed via callback hooks on the `boatleak` component.

## Main functions
### `FindLeakBlocker(inst, dt)`
* **Description:** Periodically called via `updatelooper`. Scans for entities within `BLOCK_RADIUS` that could block the leak. Applies wetness bonuses to valid entities, tracks them in `inst._wettargets`, and handles delayed ejection logic for inventory items.
* **Parameters:**
  * `inst` (Entity) — the `boat_leak` entity instance.
  * `dt` (number) — delta time in seconds since last update.
* **Returns:** Nothing.
* **Error states:** If no entities are found, it unplugs the leak, removes all wetness bonuses, and clears `inst._wettargets`. Uses `inst.components.boatleak:SetPlugged(setting)` to toggle between plugged/unplugged states.

## Events & listeners
- **Listens to:** `enterlimbo`, `on_landed` — registered via `item:ListenForEvent` on flung inventory items to trigger `OnEndFlung` cleanup.
- **Pushes:** None directly; delegates event logic to callback assignments on `inst.components.boatleak.onsprungleak` and `inst.components.boatleak.onrepairedleak`, which may trigger further logic (e.g., hauntable activation or deactivation, moisture interaction).
  
