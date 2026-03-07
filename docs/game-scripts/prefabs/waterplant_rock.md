---
id: waterplant_rock
title: Waterplant Rock
description: A anchored marine structure that functions as a mineable resource and upgradeable water obstacle, dropping rocks when harvested or upgraded.
tags: [environment, resource, obstacle, upgrade]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2d0499d1
system_scope: environment
---

# Waterplant Rock

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `waterplant_rock` prefab represents a rock-like marine structure in Don't Starve Together, designed to mimic a barnacle-encrusted seastack. It combines environmental obstacle behavior (via `MakeWaterObstaclePhysics` and `floater` component) with resource mechanics (via `workable` and `lootdropper`). It supports mining, upgrading to waterplants, and reacts to collisions with boats. This prefab is part of the world generation and environmental resource system, typically found in ocean biomes.

## Usage example
```lua
-- Typical usage within a worldgen task or room placement
local rock = SpawnPrefab("waterplant_rock")
rock.Transform:SetPosition(x, y, z)
-- No additional setup needed — the prefab initializes all components in its constructor.
-- Mining is triggered automatically via ACTIONS.MINE, and upgrading uses UPGRADETYPES.WATERPLANT.
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `minimapentity`, `network`, `floater`, `lootdropper`, `workable`, `inspectable`, `upgradeable`, `hauntable`, `boatphysics` (read-only), `inventoryitem` (read-only via `MakeInventoryFloatable`)  
**Tags added:** `ignorewalkableplatforms`, `seastack`, `waterplant`

## Properties
No public properties are initialized directly in this file beyond those inherited from component APIs.

## Main functions
### `OnWork(inst, worker, workleft)`
*   **Description:** Callback triggered when work is applied to the rock. When `workleft <= 0`, it spawns an FX effect, drops loot using `lootdropper`, removes physics radius override, and destroys the entity.
*   **Parameters:**  
    *   `inst` (Entity) — the waterplant_rock instance.  
    *   `worker` (Entity) — the entity performing the work (e.g., player or creature).  
    *   `workleft` (number) — remaining work to be done (typically decremented by `TUNING.WATERPLANT_MINE` per action).
*   **Returns:** Nothing.
*   **Error states:** None documented; relies on `workleft <= 0` check to trigger destruction.

### `on_upgraded(inst, upgrade_doer)`
*   **Description:** Callback triggered when the rock is upgraded (e.g., via player command using Upgrade Station or related mechanic). Spawns a `waterplant_baby` and `waterplant_destroy` FX at the same location, notifies the world of an item planting event, and removes the rock.
*   **Parameters:**  
    *   `inst` (Entity) — the waterplant_rock instance.  
    *   `upgrade_doer` (Entity or nil) — the entity that initiated the upgrade, if any.
*   **Returns:** Nothing.

### `OnCollide(inst, data)`
*   **Description:** Event handler for collision events (`on_collide`). When colliding with a boat, computes damage scaled by boat velocity and reports it to the `workable` component as if the boat had mined the rock.
*   **Parameters:**  
    *   `inst` (Entity) — the waterplant_rock instance.  
    *   `data` (table) — collision event data, expected to contain `other` (colliding entity) and `hit_dot_velocity` (collision impact direction).
*   **Returns:** Nothing.
*   **Error states:** Only triggers damage logic if `data.other.components.boatphysics` exists.

## Events & listeners
- **Listens to:** `on_collide` — triggers boat-collision logic via `OnCollide`.
- **Pushes:** None directly; relies on components to fire events (e.g., `workable` fires `onworkbegin`, `onwork`, `onworkcomplete`; `upgradeable` fires `onupgrade`).