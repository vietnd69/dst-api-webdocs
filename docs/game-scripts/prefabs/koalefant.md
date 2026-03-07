---
id: koalefant
title: Koalefant
description: Creates the Koalefant entity (a seasonal large herbivore) with combat, movement, sleeping behavior, poop spawing, and seasonally variant loot.
tags: [combat, ai, loot, season]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ddf8b8b
system_scope: entity
---

# Koalefant

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines the `koalefant_summer` and `koalefant_winter` prefabs — large herbivorous creatures that roam the world, graze on vegetables, sleep when players approach too closely, and drop seasonal loot upon death. It uses an Entity Component System (ECS) approach, initializing an entity with components for health, combat, movement, eating, loot dropping, periodic spawing (poop), salt licking, and sleeping. The Koalefant also participates in group targeting: when attacked, it shares aggro with nearby Koalefant allies. It depends on the `koalefantbrain` AI brain and the `SGkoalefant` stategraph for behavior orchestration.

## Usage example
```lua
-- Spawn a Koalefant (summer variant) in the world
local koalefant = SpawnPrefab("koalefant_summer")
if koalefant then
    koalefant.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `eater`, `health`, `locomotor`, `lootdropper`, `periodicspawner`, `saltlicker`, `sleeper`, `inspectable`, `timer`, `physics`, `animstate`, `soundemitter`, `dynamicshadow`, `network`, `transform`

**Tags:** `koalefant`, `animal`, `largecreature`, `saltlicker`, `burnt` (checked conditionally in loot logic)

## Properties
No public properties are defined directly on the prefab function or returned entity. All state is managed through components.

## Main functions
### `SimulateKoalefantDrops(inst)`
*   **Description:** Simulates loot drops as if a Koalefant were slain and meats eaten — primarily used for testing or UI previews. It assumes `inst.components.lootdropper` exists.
*   **Parameters:** `inst` (entity) — must have a `lootdropper` component attached.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; may fail silently if `lootdropper` is missing.

### `create_base(build)`
*   **Description:** Internal constructor helper that sets up the core entity structure shared by both summer and winter variants. Handles entity creation, physics, animations, tags, and component initialization.
*   **Parameters:** `build` (string) — the build name (e.g., `"koalefant_summer_build"` or `"koalefant_winter_build"`).
*   **Returns:** `inst` (entity) — the initialized entity (pristine on client; fully configured on master).
*   **Error states:** Returns early with only basic assets on the client if `TheWorld.ismastersim` is false.

### `create_summer()`
*   **Description:** Public prefab factory for the summer Koalefant variant. Calls `create_base` and sets loot table to summer-specific items.
*   **Parameters:** None.
*   **Returns:** `Prefab` instance for `"koalefant_summer"`.

### `create_winter()`
*   **Description:** Public prefab factory for the winter Koalefant variant. Calls `create_base` and sets loot table to winter-specific items.
*   **Parameters:** None.
*   **Returns:** `Prefab` instance for `"koalefant_winter"`.

### `ShouldWakeUp(inst)`
*   **Description:** Sleep test function — returns `true` if the Koalefant should wake up due to proximity to any player.
*   **Parameters:** `inst` (entity) — the Koalefant instance.
*   **Returns:** `boolean` — `true` if any player is within `WAKE_TO_RUN_DISTANCE` (10 units) or default wake conditions apply.
*   **Error states:** Relies on `DefaultWakeTest` and `IsAnyPlayerInRange`.

### `ShouldSleep(inst)`
*   **Description:** Wake test function — returns `true` if the Koalefant should attempt to sleep (i.e., is not near a player).
*   **Parameters:** `inst` (entity).
*   **Returns:** `boolean` — `true` if default sleep conditions apply and no player is within `SLEEP_NEAR_ENEMY_DISTANCE` (14 units).
*   **Error states:** Relies on `DefaultSleepTest` and `IsAnyPlayerInRange`.

### `KeepTarget(inst, target)`
*   **Description:** Combat callback — ensures the Koalefant stops pursuing a target that moves too far away.
*   **Parameters:**  
    `inst` (entity) — the Koalefant.  
    `target` (entity) — the current combat target.
*   **Returns:** `boolean` — `true` if target is within `TUNING.KOALEFANT_CHASE_DIST`.
*   **Error states:** Uses `inst:IsNear(target, ...)`, which may fail if target is nil or missing transform.

### `ShareTargetFn(dude)`
*   **Description:** Filter function for combat targeting — determines which entities will accept the Koalefant’s shared aggro.
*   **Parameters:** `dude` (entity).
*   **Returns:** `boolean` — `true` if the entity is a Koalefant, not a player, and not dead.
*   **Error states:** Calls `dude.components.health:IsDead()`, which assumes health component exists.

### `OnAttacked(inst, data)`
*   **Description:** Event handler fired when the Koalefant is attacked — sets the attacker as target and shares the target with up to 5 nearby Koalefant allies.
*   **Parameters:**  
    `inst` (entity) — the Koalefant.  
    `data` (table) — event data including `attacker`.
*   **Returns:** Nothing.

### `lootsetfn(lootdropper)`
*   **Description:** Loot setup callback — conditionally overrides the loot table if the Koalefant is burning or burnt.
*   **Parameters:** `lootdropper` (LootDropper component).
*   **Returns:** Nothing (modifies `lootdropper.loot` internally).
*   **Error states:** Relies on `burnable:IsBurning()` and tag check; safe if components exist.

## Events & listeners
- **Listens to:** `attacked` — triggers `OnAttacked`, updating combat target and sharing aggro with allies.

- **Pushes:** No events are explicitly pushed by this prefab; event flow is driven by component behavior and stategraph transitions.