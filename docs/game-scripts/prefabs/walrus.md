---
id: walrus
title: Walrus
description: Creates a walrus character prefab with AI-driven combat behavior, inventory-equipped projectiles, and day/night sleep/return logic.
tags: [combat, ai, creature]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e36cc6b5
system_scope: entity
---

# Walrus

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `walrus` prefab defines a playable and wild NPC character in DST. It uses the Entity Component System (ECS) to implement combat, locomotion, inventory, sleep, and AI behaviors via its brain and state graph. The walrus can switch between normal and "little" (juvenile) variants, with the latter behaving as a follower. Key behaviors include retargeting nearby entities, sharing aggro with nearby walruses on attack, equipping a blowdart projectile on spawn, and returning to its home at the end of the day (if located in a non-home area).

## Usage example
```lua
-- Create a normal walrus
local walrus = Prefab("walrus", create_normal, assets, prefabs)
local inst = walrus()

-- Create a little (juvenile) walrus
local little_walrus = Prefab("little_walrus", create_little, assets)
local child = little_walrus()

-- The component setup is handled internally by the prefab factory functions.
-- No manual component addition is needed by the caller.
```

## Dependencies & tags
**Components used:** `locomotor`, `drownable`, `sleeper`, `eater`, `combat`, `health`, `lootdropper`, `inventory`, `inspectable`, `leader`, `follower`  
**Tags:** Adds `character`, `walrus`, `houndfriend`, and conditionally `taunt_attack` (for little walrus). Checks `flare_summoned` (during save/load), `ndeath`, `debris`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flare_summoned` | boolean | `false` | Tracks whether the walrus is summoned by a flare. Stored in save data. |

## Main functions
### `create_common(build, scale, tag)`
*   **Description:** Internal helper that constructs the base walrus entity with shared functionality (physics, animations, components, behaviors).
*   **Parameters:**  
    `build` (string) – anim build name (e.g., `"walrus_build"` or `"walrus_baby_build"`).  
    `scale` (number) – transform scale factor.  
    `tag` (string or nil) – optional additional tag to add (e.g., `"taunt_attack"` for little walruses).
*   **Returns:** The fully configured entity instance.
*   **Error states:** Returns early with non-master-sim entity if `TheWorld.ismastersim` is false.

### `create_normal()`
*   **Description:** Factory function to create a standard adult walrus.
*   **Parameters:** None.
*   **Returns:** Entity instance of normal walrus (1.5 scale, high health, standard stats).

### `create_little()`
*   **Description:** Factory function to create a juvenile little walrus, which behaves as a follower and has different stats.
*   **Parameters:** None.
*   **Returns:** Entity instance of little walrus (1.0 scale, faster movement, lower damage, `follower` component, `wee_mctusk` soundgroup).

### `EquipBlowdart(inst)`
*   **Description:** Adds a temporary, non-persistent blowdart to the walrus's inventory and equips it.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** Nothing.
*   **Error states:** Skips equip if inventory slot is already occupied.

### `Retarget(inst)`
*   **Description:** Callback used by the combat component to find a new valid target.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** Entity (or `nil`) if a suitable target is found within `TUNING.WALRUS_TARGET_DIST`.
*   **Error states:** May return `nil` if no valid target exists within range or tags.

### `KeepTarget(inst, target)`
*   **Description:** Determines whether the walrus should keep the current target or drop it.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.  
    `target` (entity) – the current target.
*   **Returns:** `true` if target is still within `TUNING.WALRUS_LOSETARGET_DIST`, else `false`.

### `ShareTargetFn(dude)`
*   **Description:** Predicate used when sharing aggro with other walruses.
*   **Parameters:**  
    `dude` (entity) – candidate helper entity.
*   **Returns:** `true` if the candidate is a non-dead walrus; `false` otherwise.

### `OnAttacked(inst, data)`
*   **Description:** Event handler that reacts when the walrus is attacked.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.  
    `data` (table) – contains `attacker` and other combat-related fields.
*   **Returns:** Nothing.
*   **Effect:** Sets the attacker as the combat target and summons up to 5 nearby walruses to assist within a 30-unit range.

### `DoReturn(inst)`
*   **Description:** Removes the walrus from the world if it has a valid home and executes a home-return event.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** Nothing.

### `ShouldSleep(inst)`
*   **Description:** Determines if the walrus should fall asleep (default logic unless home is valid).
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** `true` if no home exists and default sleep conditions apply; otherwise `false`.

### `OnStopDay(inst)`
*   **Description:** World-state watcher callback triggered at day's end.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** Nothing.
*   **Effect:** Calls `DoReturn(inst)` if the walrus is currently asleep.

### `OnEntitySleep(inst)`
*   **Description:** Executed when the entity enters the sleep state.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.
*   **Returns:** Nothing.
*   **Effect:** Calls `DoReturn(inst)` if the world is currently night (`not TheWorld.state.isday`).

### `OnSave(inst, data)`
*   **Description:** Save data serializer.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.  
    `data` (table) – save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Save data deserializer.
*   **Parameters:**  
    `inst` (entity) – the walrus entity.  
    `data` (table or nil) – loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` – triggers `OnAttacked` to set and share target.
- **Watches world state:** `stopday` – triggers `OnStopDay` for day-end sleep logic.
- **Listens to entity sleep event:** `OnEntitySleep` – triggers `DoReturn` at night.