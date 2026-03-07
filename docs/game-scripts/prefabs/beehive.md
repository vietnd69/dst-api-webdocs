---
id: beehive
title: Beehive
description: Manages hive behavior including bee spawning, seasonal rate adjustments, damage response, hauntable mechanics, and interactions with freezing and burning.
tags: [spawning, weather, combat, freezing, burning]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f367067e
system_scope: entity
---

# Beehive

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beehive` prefab is a structure that spawns bees (`bee`) and killer bees (`killerbee`) over time, responds to damage and hauntings by releasing killer bees, and adapts spawning rates based on season (specifically increased aggression in Spring). It integrates with multiple core components: `childspawner`, `health`, `combat`, `burnable`, `freezable`, `hauntable`, and `lootdropper`. Spawning is active only during the day unless frozen, and is disabled in winter.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("childspawner")
inst.components.childspawner.childname = "bee"
inst.components.childspawner:SetMaxChildren(12)
inst.components.childspawner:SetSpawnPeriod(6)
inst.components.childspawner:SetRegenPeriod(60)
inst.components.childspawner:StartSpawning()
```

## Dependencies & tags
**Components used:** `health`, `childspawner`, `lootdropper`, `burnable`, `freezable`, `combat`, `hauntable`, `inspectable`  
**Tags added:** `structure`, `lifedrainable`, `beaverchewable`, `hive`, `beehive`

## Properties
No public properties are exposed directly on the `beehive` prefab. All configuration occurs via component properties (e.g., `inst.components.childspawner.childname`) set during `fn()` initialization.

## Main functions
### `SeasonalSpawnChanges(inst, season)`
*   **Description:** Adjusts spawning parameters based on the current season, increasing bee production and release rates during Spring.
*   **Parameters:** `season` (string) – one of `SEASONS.SPRING` or other season constants.
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** Enables or disables spawning based on whether it is currently daytime.
*   **Parameters:** `isday` (boolean) – `true` if daytime, `false` otherwise.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Triggers when the hive catches fire. Releases all bees, stops looping sound, and calls `DefaultBurnFn`.
*   **Parameters:** `inst` (Entity) – the hive instance.
*   **Returns:** Nothing.

### `OnHit(inst, attacker, damage)`
*   **Description:** Responds to direct damage by releasing killer bees toward the attacker.
*   **Parameters:**  
    `attacker` (Entity) – the entity dealing damage;  
    `damage` (number) – amount of damage dealt.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Handles haunting: attempts to find a valid nearby target, triggers `OnHit`, and returns success/failure status.
*   **Parameters:** `inst` (Entity) – the hive instance.
*   **Returns:** `true` if a target was found and attacked; `false` otherwise.
*   **Error states:** Returns early with `false` if hauntable conditions are not met (e.g., childspawner unavailable, spawning blocked, or random chance fails).

## Events & listeners
- **Listens to:**  
  `isday` (world state) – triggers `OnIsDay`;  
  `season` (world state) – triggers `SeasonalSpawnChanges`;  
  `freeze`, `onthaw`, `unfreeze` – triggers respective freeze/thaw handlers;  
  `death` – triggers `OnKilled`.
- **Pushes:**  
  No events directly; relies on component events (e.g., `childspawner:ReleaseAllChildren`).
