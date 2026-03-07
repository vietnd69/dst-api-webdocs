---
id: mermhouse
title: Mermhouse
description: A structure that spawns Merm minions during the night and regenerates them over time, with special behavior when crafted with an offering pot.
tags: [structure, spawner, combat, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 047230e9
system_scope: world
---

# Mermhouse

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
The `mermhouse` prefab represents a structure in DST that functions as a Merm spawner. It manages a pool of Merm units and regenerates them over time, especially at night (unless the game is in Winter). It interacts with several core systems: `childspawner` (for minion management), `burnable` (for fire behavior), `lootdropper` (for demolition rewards), `workable` (for hammering interaction), and `hauntable` (for ghost haunting). The crafted variant also interfaces with the `deployhelper` and `worldsettingstimer` components to support dynamic spawning rate adjustments via Wurt's offering pot.

## Usage example
```lua
-- Creating a pristine Mermhouse instance
local house = Prefab("mermhouse", ...)

-- Attaching and configuring child spawner
house:AddComponent("childspawner")
house.components.childspawner.childname = "merm"
house.components.childspawner:SetSpawnPeriod(TUNING.MERMHOUSE_RELEASE_TIME)
house.components.childspawner:SetMaxChildren(TUNING.MERMHOUSE_MERMS)

-- Enabling loot and burn behavior
house:AddComponent("lootdropper")
house.components.lootdropper:SetLoot({ "boards", "rocks", "pondfish" })
MakeMediumBurnable(house)
```

## Dependencies & tags
**Components used:** `burnable`, `childspawner`, `combat`, `deployhelper`, `hauntable`, `inspectable`, `lootdropper`, `updatelooper`, `workable`, `worldsettingstimer`, `health` (via `MakeMediumBurnable`, `MakeLargePropagator`, `MakeObstaclePhysics`).

**Tags added/checked:** `structure`, `CLASSIFIED`, `NOCLICK`, `placer`, `burnt`.  
The component also checks for `character`, `merm`, `playerghost`, `INLIMBO` in haunt targeting logic.

## Properties
No public properties are defined on the `mermhouse` prefab itself — it uses component properties exposed via `inst.components.X`. Key component-based properties used include:
- `childspawner.childname` (string) — prefab name of spawned Merm.
- `childspawner.childreninside` (integer) — current count of available children in the house.
- `childspawner.canemergencyspawn` (boolean) — whether emergency spawning is enabled.
- `hauntable.value` (number) — haunt value used when a ghost interacts.

## Main functions
### `MakeMermHouse(name, common_postinit, master_postinit)`
*   **Description:** Factory function that constructs and returns a Prefab for a Mermhouse. Accepts optional per-instance post-initialization callbacks.
*   **Parameters:**
    - `name` (string) — name of the prefab (`"mermhouse"` or `"mermhouse_crafted"`).
    - `common_postinit` (function | nil) — invoked on both server and client during entity creation.
    - `master_postinit` (function | nil) — invoked only on master sim (server) after components are added.
*   **Returns:** `Prefab` — fully configured prefab definition.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Enables or disables the placement helper visual ring (e.g., during offering pot crafting). Used only by crafted variant on non-dedicated servers.
*   **Parameters:**
    - `inst` (Entity) — the entity instance.
    - `enabled` (boolean) — whether to show/hide the helper ring.
    - `recipename` (string) — name of the recipe being crafted.
    - `placerinst` (Entity) — optional reference to the placer entity used for distance checks.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Handles destruction of the house via hammering, extinguishing fire, dropping loot, spawning collapse FX, and removing the entity.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
    - `worker` (Entity) — the entity performing the hammer action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggered when the house is damaged (but not destroyed), releases all Merm children and plays a hit animation.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
    - `worker` (Entity) — the entity striking the house.
*   **Error states:** No effect if `inst:HasTag("burnt")`.

### `StartSpawning(inst)`, `StopSpawning(inst)`
*   **Description:** Enable/disable automatic child spawing based on world state (`isday`, `iswinter`, `burnt`). Called by `OnIsDay` callback.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
*   **Returns:** Nothing.

### `OnSpawned(inst, child)`
*   **Description:** Callback fired when a Merm leaves the house. Plays a door sound and may stop spawning if daytime and children remain.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
    - `child` (Entity) — the spawned Merm.
*   **Returns:** Nothing.

### `OnGoHome(inst, child)`
*   **Description:** Callback fired when a Merm returns home. Plays a door sound and restarts spawning if no children remain outside.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
    - `child` (Entity) — the returning Merm.
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** World state listener that toggles spawning on/off based on time of day. Stops spawning at day, starts at night (unless burnt or in winter).
*   **Parameters:**
    - `inst` (Entity) — the house entity.
    - `isday` (boolean) — current daylight state.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles ghost haunt attempts: spawns a Merm at the house via `onhit`, if haunt chance passes and a valid target is nearby.
*   **Parameters:**
    - `inst` (Entity) — the house entity.
*   **Returns:** `boolean` — `true` if haunt succeeded, `false` otherwise.

### `UpdateSpawningTime(inst, data)`
*   **Description:** Adjusts regen and spawn periods dynamically based on kelp offering count in the nearby offering pot. Used only by crafted variant.
*   **Parameters:**
    - `inst` (Entity) — the crafted house entity.
    - `data` (table) — event payload containing `inst`, `count` of offerings.
*   **Returns:** Nothing. Early exit if data invalid or offering pot out of range.

## Events & listeners
- **Listens to:** `onignite`, `burntup`, `isday` (via `WatchWorldState`), `onbuilt`, `ms_updateofferingpotstate` (crafted variant only).
- **Pushes:** None — relies on component-level events (`childspawner`, `burnable`, `workable`) for state updates.
